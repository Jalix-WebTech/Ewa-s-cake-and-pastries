/* =================================================================
   EWA'S CAKES AND PASTRIES — AI ASSISTANT (CLIENT-SIDE)
   -----------------------------------------------------------------
   Author : Jalixon (https://jalixon.vercel.app/)
   -----------------------------------------------------------------
   WHAT THIS FILE DOES:
   - Provides a free, 24/7-feel chatbot with NO paid API.
   - Uses a local "knowledge base" of intents (keywords -> answer).
   - Simulates human typing with a delay + typing indicator.

   WHY KEYWORD-BASED:
   - It runs fully offline in the browser, costs nothing, and is
     fast. Each intent is a small object so adding new answers is
     trivial (Open/Closed Principle — extend without editing logic).

   FUTURE IMPROVEMENTS:
   - Swap matchIntent() for a real NLP/LLM API call.
   - Persist conversation history to localStorage.
   - Add multilingual (Yoruba/English) responses.
   ================================================================= */

'use strict';

(function () {
  /* Reuse helpers from main.js if available */
  const waLink = (window.EwaStore && window.EwaStore.waLink)
    || ((m) => `https://wa.me/2348000000000?text=${encodeURIComponent(m)}`);

  /* ---------------------------------------------------------------
     1. KNOWLEDGE BASE
     Each intent: keywords to match + a reply. Order matters only
     for overlap; we score by number of keyword hits.
  --------------------------------------------------------------- */
  const KNOWLEDGE = [
    {
      keys: ['hi', 'hello', 'hey', 'good morning', 'good afternoon', 'good evening', 'how are you'],
      reply: "Hello! 👋 Welcome to Ewa's Cakes and Pastries. I'm your sweet assistant. Ask me about our cakes, prices, delivery, or how to order!"
    },
    {
      keys: ['price', 'pricing', 'cost', 'how much', 'rate', 'expensive', 'cheap', 'budget'],
      reply: "Here's our pricing 💰:\n• Cupcakes from ₦4,500\n• Small chops from ₦15,000\n• Birthday cakes from ₦22,000\n• Premium designer cakes from ₦25,000\n• Wedding/Event cakes from ₦65,000+\nWant a custom quote? Tap 'Book Event' or message us on WhatsApp!"
    },
    {
      keys: ['cake', 'birthday', 'wedding', 'anniversary', 'flavour', 'flavor', 'design', 'custom'],
      reply: "We bake them all! 🎂 Birthday cakes, wedding tiers, anniversary red velvet, kids theme cakes & more. We do custom flavours, colours and designs — just tell us your idea!"
    },
    {
      keys: ['pastry', 'pastries', 'small chops', 'meat pie', 'doughnut', 'donut', 'snack', 'puff', 'dessert'],
      reply: "Yes! 🥧 We make small chops trays, meat pies, glazed doughnuts, cupcakes and dessert cups — perfect for parties, schools and offices."
    },
    {
      keys: ['delivery', 'deliver', 'shipping', 'send', 'how long', 'when'],
      reply: "🚚 We offer FREE delivery within Iseyin and timely dispatch across Oyo State. Same-day delivery is available for ready items — custom cakes need 24–72 hrs notice."
    },
    {
      keys: ['order', 'buy', 'how to order', 'purchase', 'checkout', 'cart'],
      reply: "Ordering is easy! 🛒\n1. Browse the Shop section\n2. Add items to your cart\n3. Tap 'Checkout via WhatsApp'\nOr use the 'Book Event' form for custom orders. We'll confirm everything on WhatsApp!"
    },
    {
      keys: ['location', 'where', 'address', 'find you', 'shop located', 'iseyin'],
      reply: "📍 We're located in Iseyin, Oyo State, Nigeria. Check the Contact section for our map and directions!"
    },
    {
      keys: ['contact', 'phone', 'number', 'call', 'email', 'reach', 'whatsapp'],
      reply: "📞 Reach us anytime!\n• Phone/WhatsApp: +234 800 000 0000\n• Email: hello@ewascakes.com\n• Hours: Mon–Sat, 8AM–8PM. Tap the WhatsApp button to chat with a human now!"
    },
    {
      keys: ['hours', 'open', 'time', 'working', 'closed'],
      reply: "🕒 We're open Monday to Saturday, 8:00 AM – 8:00 PM. WhatsApp orders are welcome anytime!"
    },
    {
      keys: ['event', 'catering', 'wedding planner', 'corporate', 'school', 'church', 'bulk', 'party'],
      reply: "🎉 We handle full event catering, dessert tables and bulk orders for weddings, churches, schools and corporate events. Use the 'Book Event' form and we'll plan it with you!"
    },
    {
      keys: ['ceo', 'owner', 'founder', 'olamide', 'who runs'],
      reply: "Our founder & CEO is Ms Olamide 👑 — a passionate baker with 5+ years of experience turning celebrations into beautiful, edible memories. See the 'Meet the Founder' section!"
    },
    {
      keys: ['thank', 'thanks', 'appreciate', 'nice', 'great', 'awesome', 'love'],
      reply: "Aww, thank you so much! 🥰 We can't wait to bake something special for you. Anything else I can help with?"
    },
    {
      keys: ['bye', 'goodbye', 'see you', 'later'],
      reply: "Goodbye for now! 👋 Don't be a stranger — your next celebration deserves Ewa's Cakes. 🎂"
    }
  ];

  const FALLBACK = "I'm not totally sure about that one 🤔, but our team would love to help! Tap the WhatsApp button or ask me about cakes, prices, delivery, ordering, or location.";

  const QUICK_REPLIES = ['💰 Prices', '🚚 Delivery', '🛒 How to order', '📍 Location', '🎂 Cakes'];

  /* ---------------------------------------------------------------
     2. INTENT MATCHING — score each intent by keyword hits.
  --------------------------------------------------------------- */
  function matchIntent(text) {
    const msg = text.toLowerCase();
    let best = null, bestScore = 0;
    KNOWLEDGE.forEach((intent) => {
      let score = 0;
      intent.keys.forEach((k) => { if (msg.includes(k)) score += k.split(' ').length; });
      if (score > bestScore) { bestScore = score; best = intent; }
    });
    return bestScore > 0 ? best.reply : FALLBACK;
  }

  /* ---------------------------------------------------------------
     3. DOM REFERENCES + UI WIRING
  --------------------------------------------------------------- */
  const fab = document.getElementById('chatFab');
  const win = document.getElementById('chatWindow');
  const closeBtn = document.getElementById('chatClose');
  const body = document.getElementById('chatBody');
  const form = document.getElementById('chatForm');
  const input = document.getElementById('chatInput');
  const quickWrap = document.getElementById('chatQuick');

  if (!fab || !win) return; // safety guard

  let greeted = false;

  function escapeHTML(str = '') {
    return String(str).replace(/[&<>"']/g, (c) => (
      { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
    ));
  }

  /* Append a message bubble. \n is converted to <br> safely. */
  function addMessage(text, sender) {
    const div = document.createElement('div');
    div.className = `msg ${sender}`;
    div.innerHTML = escapeHTML(text).replace(/\n/g, '<br>');
    body.appendChild(div);
    body.scrollTop = body.scrollHeight;
  }

  /* Show animated typing indicator, then reply after a realistic delay */
  function botRespond(userText) {
    const typing = document.createElement('div');
    typing.className = 'msg bot';
    typing.innerHTML = '<span class="typing"><span></span><span></span><span></span></span>';
    body.appendChild(typing);
    body.scrollTop = body.scrollHeight;

    const reply = matchIntent(userText);
    const delay = 700 + Math.min(reply.length * 12, 1400); // longer answers "type" longer
    setTimeout(() => {
      typing.remove();
      addMessage(reply, 'bot');
    }, delay);
  }

  function renderQuickReplies() {
    quickWrap.innerHTML = QUICK_REPLIES.map((q) =>
      `<button type="button">${q}</button>`).join('');
  }

  /* Open the chat — greet only once per session */
  function openChat() {
    win.classList.add('open');
    if (!greeted) {
      greeted = true;
      renderQuickReplies();
      setTimeout(() => addMessage(KNOWLEDGE[0].reply, 'bot'), 400);
    }
    setTimeout(() => input.focus(), 300);
  }
  function closeChat() { win.classList.remove('open'); }

  /* Process a user message (from input or quick reply) */
  function handleUserMessage(text) {
    const clean = text.trim();
    if (!clean) return;
    addMessage(clean, 'user');
    input.value = '';
    botRespond(clean);
  }

  /* ---------------------------------------------------------------
     4. EVENT LISTENERS
  --------------------------------------------------------------- */
  fab.addEventListener('click', () => win.classList.contains('open') ? closeChat() : openChat());
  closeBtn.addEventListener('click', closeChat);

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    handleUserMessage(input.value);
  });

  quickWrap.addEventListener('click', (e) => {
    const btn = e.target.closest('button');
    if (btn) handleUserMessage(btn.textContent.replace(/^[^\w]+/, '').trim());
  });

  // Close chat on Escape for accessibility
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && win.classList.contains('open')) closeChat();
  });
})();
