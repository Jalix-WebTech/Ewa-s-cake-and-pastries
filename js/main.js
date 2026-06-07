/* =================================================================
   EWA'S CAKES AND PASTRIES — MAIN APPLICATION SCRIPT
   -----------------------------------------------------------------
   Author : Jalixon (https://jalixon.vercel.app/)
   -----------------------------------------------------------------
   WHAT THIS FILE DOES:
   - Boots the splash screen, navigation, scroll effects.
   - Holds the product/gallery/testimonial DATA (single source).
   - Renders products, handles search + category filtering.
   - Manages the shopping cart (add / qty / remove / total).
   - Builds the WhatsApp checkout + booking messages.
   - Powers the gallery lightbox and testimonial carousel.

   WHY MODULAR:
   - Each feature is wrapped in its own function (Single
     Responsibility Principle) so it can be tested and reused
     independently. Data is separated from rendering logic.

   FUTURE IMPROVEMENTS:
   - Replace inline data with a fetch() to a JSON API / CMS.
   - Persist cart to localStorage across sessions.
   - Add real payment gateway + order backend.
   ================================================================= */

'use strict';

/* -----------------------------------------------------------------
   0. CONFIGURATION — change these once to rebrand/redeploy.
----------------------------------------------------------------- */
const CONFIG = {
  whatsappNumber: '2348000000000', // <-- replace with real WhatsApp number (intl format, no +)
  currency: '₦',
  businessName: "Ewa's Cakes and Pastries"
};

/* Small helpers -------------------------------------------------- */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
const formatPrice = (n) => CONFIG.currency + Number(n).toLocaleString('en-NG');

/* SECURITY: escape user/data text before injecting into the DOM to
   prevent XSS. Always pass dynamic strings through this. */
function escapeHTML(str = '') {
  return String(str).replace(/[&<>"']/g, (c) => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
  ));
}

/* Build a WhatsApp deep-link with a pre-filled, encoded message. */
function waLink(message) {
  return `https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

/* =================================================================
   1. PRODUCT DATA
   The catalogue. Image paths point to /assets/images/<category>/...
   Each item also has an onerror placeholder fallback so the page
   NEVER shows a broken image (requirement: "No missing images").
   ================================================================= */
const PRODUCTS = [
  { id: 1, name: 'Chocolate Dream Cake', cat: 'Birthday Cakes', price: 25000, rating: 5, tag: 'Bestseller',
    img: 'https://images.pexels.com/photos/7381533/pexels-photo-7381533.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
    desc: 'Rich moist chocolate sponge with silky ganache, perfect for birthdays.' },
  { id: 2, name: 'Royal Wedding Tier', cat: 'Wedding Cakes', price: 120000, rating: 5, tag: 'Premium',
    img: 'https://images.pexels.com/photos/33756083/pexels-photo-33756083.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
    desc: 'Elegant 3-tier vanilla cake with handcrafted floral fondant detailing.' },
  { id: 3, name: 'Strawberry Vanilla Delight', cat: 'Birthday Cakes', price: 22000, rating: 4,
    img: 'https://images.pexels.com/photos/10455820/pexels-photo-10455820.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
    desc: 'Fluffy vanilla sponge layered with fresh strawberry cream.' },
  { id: 4, name: 'Anniversary Red Velvet', cat: 'Anniversary Cakes', price: 30000, rating: 5, tag: 'Loved',
    img: 'https://images.pexels.com/photos/26341195/pexels-photo-26341195.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
    desc: 'Classic red velvet with cream-cheese frosting for special milestones.' },
  { id: 5, name: 'Rainbow Cupcakes (12)', cat: 'Cupcakes', price: 8000, rating: 4,
    img: 'https://images.pexels.com/photos/1055270/pexels-photo-1055270.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
    desc: 'A dozen colourful buttercream cupcakes — a party favourite.' },
  { id: 6, name: 'Party Small Chops Tray', cat: 'Small Chops', price: 15000, rating: 5, tag: 'Hot',
    img: 'https://images.pexels.com/photos/19846423/pexels-photo-19846423.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
    desc: 'Spring rolls, samosas, puff puff &amp; peppered gizzard — serves 10.' },
  { id: 7, name: 'Golden Meat Pie (6)', cat: 'Pastries', price: 6000, rating: 4,
    img: 'https://images.pexels.com/photos/29185236/pexels-photo-29185236.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
    desc: 'Flaky, buttery crust packed with seasoned minced meat &amp; potatoes.' },
  { id: 8, name: 'Glazed Doughnuts (12)', cat: 'Pastries', price: 7000, rating: 5,
    img: 'https://images.pexels.com/photos/2955820/pexels-photo-2955820.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
    desc: 'Soft, pillowy doughnuts with a sweet vanilla glaze.' },
  { id: 9, name: 'Parfait Dessert Cups (6)', cat: 'Desserts', price: 12000, rating: 5, tag: 'New',
    img: 'https://images.pexels.com/photos/7190366/pexels-photo-7190366.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
    desc: 'Layered yoghurt, granola &amp; fresh fruit dessert cups.' },
  { id: 10, name: 'Kids Theme Cake', cat: 'Birthday Cakes', price: 35000, rating: 5,
    img: 'https://images.pexels.com/photos/20546572/pexels-photo-20546572.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
    desc: 'Custom themed birthday cake to make little ones smile.' },
  { id: 11, name: 'Classic Vanilla Cupcakes (6)', cat: 'Cupcakes', price: 4500, rating: 4,
    img: 'https://images.pexels.com/photos/1055271/pexels-photo-1055271.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
    desc: 'Six soft vanilla cupcakes topped with swirled buttercream.' },
  { id: 12, name: 'Luxury Engagement Cake', cat: 'Wedding Cakes', price: 65000, rating: 5, tag: 'Premium',
    img: 'https://images.pexels.com/photos/29388914/pexels-photo-29388914.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
    desc: 'Sophisticated tiered cake with floral and pearl accents.' }
];

const CATEGORIES = ['All', 'Birthday Cakes', 'Wedding Cakes', 'Anniversary Cakes', 'Cupcakes', 'Small Chops', 'Pastries', 'Desserts'];

/* Placeholder colours per category for graceful fallbacks */
const PLACEHOLDER = (text) => `https://placehold.co/400x400/e6a157/fff?text=${encodeURIComponent(text)}`;

/* =================================================================
   2. SPLASH SCREEN (6-second branded intro)
   ================================================================= */
function initSplash() {
  const splash = $('#splash');
  if (!splash) return;
  // Lock scroll while splash is visible
  document.body.style.overflow = 'hidden';
  setTimeout(() => {
    splash.classList.add('hide');
    document.body.style.overflow = '';
    // remove from DOM after fade for cleanliness/performance
    setTimeout(() => splash.remove(), 900);
  }, 6000);
}

/* =================================================================
   3. NAVIGATION (mobile menu, scroll state, hero/contact WA links)
   ================================================================= */
function initNav() {
  const header = $('#header');
  const menuToggle = $('#menuToggle');
  const navLinks = $('#navLinks');

  // Sticky header style change on scroll (passive listener = perf)
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 30);
    $('#toTop').classList.toggle('show', window.scrollY > 600);
  }, { passive: true });

  // Mobile menu open/close
  menuToggle.addEventListener('click', () => {
    const open = navLinks.classList.toggle('open');
    menuToggle.classList.toggle('active', open);
    menuToggle.setAttribute('aria-expanded', open);
  });

  // Close mobile menu after clicking a link
  $$('#navLinks a').forEach((a) => a.addEventListener('click', () => {
    navLinks.classList.remove('open');
    menuToggle.classList.remove('active');
  }));

  // Pre-fill WhatsApp quick links
  const greeting = `Hello ${CONFIG.businessName}! 👋 I'd like to place an order.`;
  $('#heroWhatsApp').href = waLink(greeting);
  $('#contactWhatsApp').href = waLink(greeting);
  $('#waFloat').href = waLink(greeting); // fixed floating WhatsApp button

  // Back to top
  $('#toTop').addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  // Footer year
  $('#year').textContent = new Date().getFullYear();
}

/* =================================================================
   4. PRODUCT RENDERING + FILTER + SEARCH
   ================================================================= */
let activeCategory = 'All';
let searchTerm = '';

function renderFilters() {
  // Category filter is now a <select> dropdown (cleaner, mobile-friendly UI).
  const select = $('#categorySelect');
  select.innerHTML = CATEGORIES.map((c) =>
    `<option value="${escapeHTML(c)}" ${c === activeCategory ? 'selected' : ''}>${escapeHTML(c)}</option>`
  ).join('');

  select.addEventListener('change', (e) => {
    activeCategory = e.target.value;
    renderProducts();
  });
}

function getFilteredProducts() {
  return PRODUCTS.filter((p) => {
    const matchCat = activeCategory === 'All' || p.cat === activeCategory;
    const matchSearch = !searchTerm ||
      p.name.toLowerCase().includes(searchTerm) ||
      p.cat.toLowerCase().includes(searchTerm) ||
      p.desc.toLowerCase().includes(searchTerm);
    return matchCat && matchSearch;
  });
}

function renderProducts() {
  const grid = $('#productGrid');
  const items = getFilteredProducts();

  if (!items.length) {
    grid.innerHTML = `<p class="no-results">😔 No products match your search. Try a different keyword.</p>`;
    return;
  }

  // Build cards. Note: desc contains pre-escaped HTML entities (e.g. &amp;)
  // already authored safely in data, names are escaped on render.
  grid.innerHTML = items.map((p) => `
    <article class="product-card" data-id="${p.id}">
      <div class="pc-media">
        ${p.tag ? `<span class="pc-tag">${escapeHTML(p.tag)}</span>` : ''}
        <img src="${p.img}" alt="${escapeHTML(p.name)}" loading="lazy"
             onerror="this.src='${PLACEHOLDER(p.cat)}'" />
        <div class="pc-quick"><button class="quick-btn" data-id="${p.id}">Quick View</button></div>
      </div>
      <div class="pc-body">
        <span class="pc-cat">${escapeHTML(p.cat)}</span>
        <h3>${escapeHTML(p.name)}</h3>
        <p class="pc-desc">${p.desc}</p>
        <div class="pc-rating">${'★'.repeat(p.rating)}${'☆'.repeat(5 - p.rating)}</div>
        <div class="pc-foot">
          <span class="pc-price">${formatPrice(p.price)}</span>
          <button class="pc-add" data-id="${p.id}" aria-label="Add ${escapeHTML(p.name)} to cart">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14"/></svg>
          </button>
        </div>
      </div>
    </article>`).join('');
}

function initShop() {
  renderFilters();
  renderProducts();

  // Debounced search for performance (avoids re-render on every keystroke)
  let t;
  $('#searchInput').addEventListener('input', (e) => {
    clearTimeout(t);
    t = setTimeout(() => {
      searchTerm = e.target.value.trim().toLowerCase();
      renderProducts();
    }, 200);
  });

  // Event delegation on the grid (one listener instead of many = perf)
  $('#productGrid').addEventListener('click', (e) => {
    const addBtn = e.target.closest('.pc-add');
    const quickBtn = e.target.closest('.quick-btn');
    if (addBtn) addToCart(Number(addBtn.dataset.id));
    if (quickBtn) openQuickView(Number(quickBtn.dataset.id));
  });
}

/* =================================================================
   5. CATEGORIES SHOWCASE
   ================================================================= */
function renderCategoryShowcase() {
  const showcase = [
    { name: 'Birthday Cakes', img: 'https://images.pexels.com/photos/20546572/pexels-photo-20546572.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940' },
    { name: 'Wedding Cakes', img: 'https://images.pexels.com/photos/29388914/pexels-photo-29388914.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940' },
    { name: 'Cupcakes', img: 'https://images.pexels.com/photos/1055270/pexels-photo-1055270.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940' },
    { name: 'Small Chops', img: 'https://images.pexels.com/photos/19846423/pexels-photo-19846423.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940' },
    { name: 'Meat Pie', img: 'https://images.pexels.com/photos/29185236/pexels-photo-29185236.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940' },
    { name: 'Doughnuts', img: 'https://images.pexels.com/photos/2955820/pexels-photo-2955820.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940' },
    { name: 'Desserts', img: 'https://images.pexels.com/photos/7190366/pexels-photo-7190366.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940' },
    { name: 'Anniversary Cakes', img: 'https://images.pexels.com/photos/26341195/pexels-photo-26341195.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940' }
  ];
  $('#categoryGrid').innerHTML = showcase.map((c) => `
    <div class="cat-card" data-cat="${escapeHTML(c.name)}">
      <img src="${c.img}" alt="${escapeHTML(c.name)}" loading="lazy" onerror="this.src='${PLACEHOLDER(c.name)}'" />
      <div class="overlay"><span>${escapeHTML(c.name)}</span></div>
    </div>`).join('');

  // Clicking a category scrolls to shop and applies a matching filter
  $('#categoryGrid').addEventListener('click', (e) => {
    const card = e.target.closest('.cat-card');
    if (!card) return;
    const cat = card.dataset.cat;
    // Map showcase names to actual filter categories where they differ
    const map = { 'Meat Pie': 'Pastries', 'Doughnuts': 'Pastries' };
    const target = CATEGORIES.includes(cat) ? cat : (map[cat] || 'All');
    activeCategory = target;
    $('#categorySelect').value = target; // keep dropdown in sync
    renderProducts();
    $('#shop').scrollIntoView({ behavior: 'smooth' });
  });
}

/* =================================================================
   6. SHOPPING CART
   Cart state is an array of { id, qty }. Product details are looked
   up from PRODUCTS so we never duplicate data (DRY principle).
   ================================================================= */
let cart = [];

function findProduct(id) { return PRODUCTS.find((p) => p.id === id); }

function addToCart(id) {
  const existing = cart.find((c) => c.id === id);
  if (existing) existing.qty++;
  else cart.push({ id, qty: 1 });
  updateCartUI();
  showToast(`${findProduct(id).name} added to cart`);
}

function changeQty(id, delta) {
  const item = cart.find((c) => c.id === id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) cart = cart.filter((c) => c.id !== id);
  updateCartUI();
}

function removeFromCart(id) {
  cart = cart.filter((c) => c.id !== id);
  updateCartUI();
}

function cartTotal() {
  return cart.reduce((sum, c) => sum + findProduct(c.id).price * c.qty, 0);
}

function updateCartUI() {
  const count = cart.reduce((s, c) => s + c.qty, 0);
  $('#cartCount').textContent = count;
  $('#cartTotal').textContent = formatPrice(cartTotal());

  const wrap = $('#cartItems');
  if (!cart.length) {
    wrap.innerHTML = `
      <div class="cart-empty">
        <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
        <p>Your cart is empty.<br>Add some sweetness! 🍰</p>
      </div>`;
    return;
  }

  wrap.innerHTML = cart.map((c) => {
    const p = findProduct(c.id);
    return `
      <div class="cart-item">
        <img src="${p.img}" alt="${escapeHTML(p.name)}" onerror="this.src='${PLACEHOLDER(p.cat)}'" />
        <div class="ci-info">
          <h4>${escapeHTML(p.name)}</h4>
          <div class="ci-price">${formatPrice(p.price)}</div>
          <div class="qty-control">
            <button class="qd" data-id="${p.id}" aria-label="Decrease quantity">−</button>
            <span>${c.qty}</span>
            <button class="qi" data-id="${p.id}" aria-label="Increase quantity">+</button>
          </div>
          <br><button class="ci-remove" data-id="${p.id}">Remove</button>
        </div>
      </div>`;
  }).join('');
}

function initCart() {
  const overlay = $('#overlay');
  const sidebar = $('#cartSidebar');
  const open = () => { sidebar.classList.add('open'); overlay.classList.add('open'); };
  const close = () => { sidebar.classList.remove('open'); overlay.classList.remove('open'); };

  $('#cartToggle').addEventListener('click', open);
  $('#cartClose').addEventListener('click', close);
  overlay.addEventListener('click', close);

  // Quantity / remove via delegation
  $('#cartItems').addEventListener('click', (e) => {
    const id = Number(e.target.dataset.id);
    if (e.target.classList.contains('qi')) changeQty(id, 1);
    if (e.target.classList.contains('qd')) changeQty(id, -1);
    if (e.target.classList.contains('ci-remove')) removeFromCart(id);
  });

  // CHECKOUT -> WhatsApp (no payment gateway, per requirements)
  $('#checkoutBtn').addEventListener('click', () => {
    if (!cart.length) { showToast('Your cart is empty 🛒'); return; }
    let msg = `🎂 *New Order — ${CONFIG.businessName}*\n\n*Items:*\n`;
    cart.forEach((c) => {
      const p = findProduct(c.id);
      msg += `• ${p.name} x${c.qty} — ${formatPrice(p.price * c.qty)}\n`;
    });
    msg += `\n*Total: ${formatPrice(cartTotal())}*\n\n`;
    msg += `Please confirm availability and delivery details. Thank you!`;
    window.open(waLink(msg), '_blank');
  });

  updateCartUI();
}

/* =================================================================
   7. QUICK-VIEW MODAL
   ================================================================= */
function openQuickView(id) {
  const p = findProduct(id);
  const modal = $('#quickModal');
  modal.innerHTML = `
    <div class="modal-card">
      <img src="${p.img}" alt="${escapeHTML(p.name)}" onerror="this.src='${PLACEHOLDER(p.cat)}'" />
      <div class="modal-body">
        <button class="modal-close" aria-label="Close">✕</button>
        <span class="pc-cat">${escapeHTML(p.cat)}</span>
        <h3>${escapeHTML(p.name)}</h3>
        <div class="pc-rating" style="color:var(--color-accent)">${'★'.repeat(p.rating)}${'☆'.repeat(5 - p.rating)}</div>
        <div class="m-price">${formatPrice(p.price)}</div>
        <p>${p.desc}</p>
        <p style="font-size:.85rem">✅ Freshly baked to order &nbsp; ✅ Free Iseyin delivery</p>
        <button class="btn btn-primary btn-block modal-add" data-id="${p.id}">Add to Cart</button>
      </div>
    </div>`;
  modal.classList.add('open');

  modal.querySelector('.modal-close').onclick = closeQuickView;
  modal.querySelector('.modal-add').onclick = () => { addToCart(p.id); closeQuickView(); };
  modal.onclick = (e) => { if (e.target === modal) closeQuickView(); };
}
function closeQuickView() { $('#quickModal').classList.remove('open'); }

/* =================================================================
   8. GALLERY + LIGHTBOX
   ================================================================= */
const GALLERY = [
  { src: 'https://images.pexels.com/photos/17315413/pexels-photo-17315413.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=900&w=700', tall: true,  label: 'Wedding Cake' },
  { src: 'https://images.pexels.com/photos/20546572/pexels-photo-20546572.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940', tall: false, label: 'Birthday Cake' },
  { src: 'https://images.pexels.com/photos/1055270/pexels-photo-1055270.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940', tall: false, label: 'Cupcakes' },
  { src: 'https://images.pexels.com/photos/14017649/pexels-photo-14017649.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940', tall: false, label: 'Event Setup' },
  { src: 'https://images.pexels.com/photos/29185236/pexels-photo-29185236.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=900&w=700', tall: true,  label: 'Small Chops' },
  { src: 'https://images.pexels.com/photos/11522869/pexels-photo-11522869.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940', tall: false, label: 'Decorations' },
  { src: 'https://images.pexels.com/photos/34844491/pexels-photo-34844491.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940', tall: false, label: 'Pastries' },
  { src: 'https://images.pexels.com/photos/26341195/pexels-photo-26341195.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940', tall: false, label: 'Anniversary Cake' }
];

let lbIndex = 0;
function initGallery() {
  $('#galleryGrid').innerHTML = GALLERY.map((g, i) => `
    <figure class="gallery-item ${g.tall ? 'tall' : ''}" data-i="${i}">
      <img src="${g.src}" alt="${escapeHTML(g.label)}" loading="lazy" onerror="this.src='${PLACEHOLDER(g.label)}'" />
      <figcaption class="g-overlay">🔍</figcaption>
    </figure>`).join('');

  const lb = $('#lightbox');
  const lbImg = $('#lbImg');
  const show = (i) => {
    lbIndex = (i + GALLERY.length) % GALLERY.length;
    const g = GALLERY[lbIndex];
    lbImg.src = g.src;
    lbImg.onerror = () => { lbImg.src = PLACEHOLDER(g.label); };
    lbImg.alt = g.label;
  };

  $('#galleryGrid').addEventListener('click', (e) => {
    const item = e.target.closest('.gallery-item');
    if (!item) return;
    show(Number(item.dataset.i));
    lb.classList.add('open');
  });

  lb.querySelector('.lb-close').onclick = () => lb.classList.remove('open');
  lb.querySelector('.prev').onclick = () => show(lbIndex - 1);
  lb.querySelector('.next').onclick = () => show(lbIndex + 1);
  lb.addEventListener('click', (e) => { if (e.target === lb) lb.classList.remove('open'); });

  // Keyboard navigation (accessibility)
  document.addEventListener('keydown', (e) => {
    if (!lb.classList.contains('open')) return;
    if (e.key === 'Escape') lb.classList.remove('open');
    if (e.key === 'ArrowRight') show(lbIndex + 1);
    if (e.key === 'ArrowLeft') show(lbIndex - 1);
  });
}

/* =================================================================
   9. TESTIMONIALS CAROUSEL (auto-rotating, accessible dots)
   ================================================================= */
const TESTIMONIALS = [
  { name: 'Mrs. Adebayo', loc: 'Iseyin, Oyo State', rating: 5,
    text: 'The wedding cake was absolutely stunning and tasted even better than it looked. Guests are still talking about it!',
    img: 'https://images.pexels.com/photos/36551042/pexels-photo-36551042.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=200&w=200' },
  { name: 'Tunde O.', loc: 'Oyo Town', rating: 5,
    text: 'Ordered small chops for my office event. Fresh, generous and delivered on time. Highly recommended!',
    img: 'https://images.pexels.com/photos/15019490/pexels-photo-15019490.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=200&w=200' },
  { name: 'Sister Grace', loc: 'Iseyin', rating: 5,
    text: 'They handled our church anniversary cakes beautifully. Affordable and professional service.',
    img: 'https://images.pexels.com/photos/31307734/pexels-photo-31307734.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=200&w=200' },
  { name: 'Bisi & Kunle', loc: 'Ibadan', rating: 5,
    text: "Ewa's made our daughter's birthday magical with a custom theme cake. Pure perfection!",
    img: 'https://images.pexels.com/photos/14950779/pexels-photo-14950779.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=200&w=200' }
];

function initTestimonials() {
  const track = $('#testiTrack');
  const dots = $('#testiDots');

  track.innerHTML = TESTIMONIALS.map((t) => `
    <div class="testi-card">
      <div class="testi-inner">
        <img src="${t.img}" alt="${escapeHTML(t.name)}" loading="lazy" onerror="this.src='https://placehold.co/84x84/b5651d/fff?text=${encodeURIComponent(t.name[0])}'" />
        <div class="stars">${'★'.repeat(t.rating)}</div>
        <blockquote>“${escapeHTML(t.text)}”</blockquote>
        <div class="author">${escapeHTML(t.name)}</div>
        <div class="loc">${escapeHTML(t.loc)}</div>
      </div>
    </div>`).join('');

  dots.innerHTML = TESTIMONIALS.map((_, i) =>
    `<button class="${i === 0 ? 'active' : ''}" data-i="${i}" aria-label="Testimonial ${i + 1}"></button>`).join('');

  let current = 0;
  const go = (i) => {
    current = (i + TESTIMONIALS.length) % TESTIMONIALS.length;
    track.style.transform = `translateX(-${current * 100}%)`;
    $$('#testiDots button').forEach((d, di) => d.classList.toggle('active', di === current));
  };

  dots.addEventListener('click', (e) => {
    if (e.target.dataset.i) go(Number(e.target.dataset.i));
  });

  // Auto-advance every 5s; pause on hover for usability
  let timer = setInterval(() => go(current + 1), 5000);
  const carousel = $('.testi-carousel');
  carousel.addEventListener('mouseenter', () => clearInterval(timer));
  carousel.addEventListener('mouseleave', () => timer = setInterval(() => go(current + 1), 5000));
}

/* =================================================================
   10. BOOKING FORM — validation + WhatsApp message
   SECURITY: validate all fields client-side; values are URL-encoded.
   ================================================================= */
function initBooking() {
  const form = $('#bookingForm');

  // Prevent past dates
  $('#bDate').min = new Date().toISOString().split('T')[0];

  function validateField(field) {
    const input = field.querySelector('input, select, textarea');
    if (!input) return true;
    // Required fields must be non-empty; ALL fields must pass native validity
    // (e.g. email format, phone pattern). Optional empty fields are valid.
    const hasValue = input.value.trim() !== '';
    let valid = input.checkValidity();
    if (input.required && !hasValue) valid = false;
    field.classList.toggle('invalid', !valid);
    return valid;
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let allValid = true;
    $$('.field', form).forEach((field) => {
      // Validate every field so format errors (email/phone) are also caught.
      if (!validateField(field)) allValid = false;
    });
    if (!allValid) { showToast('Please check the highlighted fields ✍️'); return; }

    // Build a clean, formatted WhatsApp booking message
    const data = Object.fromEntries(new FormData(form).entries());
    let msg = `📅 *Event Booking — ${CONFIG.businessName}*\n\n`;
    msg += `👤 *Name:* ${data.name}\n`;
    msg += `📞 *Phone:* ${data.phone}\n`;
    if (data.email) msg += `✉️ *Email:* ${data.email}\n`;
    msg += `🎉 *Event Type:* ${data.eventType}\n`;
    msg += `🗓️ *Event Date:* ${data.date}\n`;
    msg += `🔢 *Quantity/Servings:* ${data.quantity}\n`;
    msg += `📍 *Delivery Address:* ${data.address}\n`;
    if (data.notes) msg += `📝 *Notes:* ${data.notes}\n`;
    msg += `\nPlease confirm availability & pricing. Thank you! 🎂`;

    window.open(waLink(msg), '_blank');
    showToast('Opening WhatsApp... 🚀');
    form.reset();
  });

  // Live validation feedback
  $$('.field input, .field select, .field textarea', form).forEach((input) => {
    input.addEventListener('blur', () => {
      const field = input.closest('.field');
      if (input.required) validateField(field);
    });
  });
}

/* =================================================================
   11. TOAST NOTIFICATION
   ================================================================= */
let toastTimer;
function showToast(message) {
  const toast = $('#toast');
  $('#toastMsg').textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2800);
}

/* =================================================================
   12. SCROLL REVEAL + ANIMATED COUNTERS (IntersectionObserver)
   Performance-friendly: observes once, then unobserves.
   ================================================================= */
function initReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  $$('.reveal').forEach((el) => observer.observe(el));
}

function initCounters() {
  const counters = $$('[data-count]');
  const obs = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = Number(el.dataset.count);
      let n = 0;
      const step = Math.max(1, Math.ceil(target / 60));
      const tick = () => {
        n += step;
        if (n >= target) { el.textContent = target.toLocaleString() + '+'; }
        else { el.textContent = n.toLocaleString(); requestAnimationFrame(tick); }
      };
      tick();
      obs.unobserve(el);
    });
  }, { threshold: 0.5 });
  counters.forEach((c) => obs.observe(c));
}

/* =================================================================
   13. BOOT — initialise everything once the DOM is ready.
   ================================================================= */
document.addEventListener('DOMContentLoaded', () => {
  initSplash();
  initNav();
  initShop();
  renderCategoryShowcase();
  initCart();
  initGallery();
  initTestimonials();
  initBooking();
  initReveal();
  initCounters();
});

/* Expose a couple of helpers for chatbot.js to reuse (e.g. waLink). */
window.EwaStore = { waLink, CONFIG, showToast };
