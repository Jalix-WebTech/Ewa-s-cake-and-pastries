# 📁 Image Assets Guide — Ewa's Cakes and Pastries

The website now uses **real photographs**. For instant rendering they currently
load from optimized Pexels CDN URLs. To make the site 100% self-hosted, simply
**download each photo below into this folder using the listed filename**, then
swap the CDN URLs in `index.html` (logo/hero/about/CEO) and `js/main.js`
(`PRODUCTS`, `GALLERY`, `TESTIMONIALS`, category showcase) back to the local
`assets/images/...` paths. Every `<img>` already has an `onerror` placeholder so
the page never breaks.

## ⬇️ Download list (real images → local filename)
| Save as | Download URL (right-click → Save image as) |
|---------|---------------------------------------------|
| `logo.png` | https://images.pexels.com/photos/1055271/pexels-photo-1055271.jpeg |
| `hero-banner.jpg` | https://images.pexels.com/photos/14017649/pexels-photo-14017649.jpeg |
| `about.jpg` | https://images.pexels.com/photos/3983579/pexels-photo-3983579.jpeg |
| `ceo.jpg` | https://images.pexels.com/photos/31307734/pexels-photo-31307734.jpeg |
| `cakes/cake-1.jpg` | https://images.pexels.com/photos/7381533/pexels-photo-7381533.jpeg |
| `cakes/cake-2.jpg` | https://images.pexels.com/photos/33756083/pexels-photo-33756083.jpeg |
| `cakes/cake-3.jpg` | https://images.pexels.com/photos/10455820/pexels-photo-10455820.jpeg |
| `cakes/cake-4.jpg` | https://images.pexels.com/photos/26341195/pexels-photo-26341195.jpeg |
| `cakes/cake-5.jpg` | https://images.pexels.com/photos/20546572/pexels-photo-20546572.jpeg |
| `cakes/cake-6.jpg` | https://images.pexels.com/photos/29388914/pexels-photo-29388914.jpeg |
| `pastries/cupcake-1.jpg` | https://images.pexels.com/photos/1055270/pexels-photo-1055270.jpeg |
| `pastries/cupcake-2.jpg` | https://images.pexels.com/photos/1055271/pexels-photo-1055271.jpeg |
| `pastries/smallchops-1.jpg` | https://images.pexels.com/photos/19846423/pexels-photo-19846423.jpeg |
| `pastries/meatpie-1.jpg` | https://images.pexels.com/photos/29185236/pexels-photo-29185236.jpeg |
| `pastries/doughnut-1.jpg` | https://images.pexels.com/photos/2955820/pexels-photo-2955820.jpeg |
| `pastries/dessert-1.jpg` | https://images.pexels.com/photos/7190366/pexels-photo-7190366.jpeg |
| `gallery/g-1.jpg` | https://images.pexels.com/photos/17315413/pexels-photo-17315413.jpeg |
| `gallery/g-4.jpg` | https://images.pexels.com/photos/14017649/pexels-photo-14017649.jpeg |
| `gallery/g-6.jpg` | https://images.pexels.com/photos/11522869/pexels-photo-11522869.jpeg |
| `gallery/g-7.jpg` | https://images.pexels.com/photos/34844491/pexels-photo-34844491.jpeg |
| `testimonials/t-1.jpg` | https://images.pexels.com/photos/36551042/pexels-photo-36551042.jpeg |
| `testimonials/t-2.jpg` | https://images.pexels.com/photos/15019490/pexels-photo-15019490.jpeg |
| `testimonials/t-3.jpg` | https://images.pexels.com/photos/31307734/pexels-photo-31307734.jpeg |
| `testimonials/t-4.jpg` | https://images.pexels.com/photos/14950779/pexels-photo-14950779.jpeg |

> Photos courtesy of Pexels (free for commercial use, no attribution required).

---

## (Legacy) original local filename reference

> 💡 Recommended format: **.jpg** for photos (smaller), **.png** for the logo
> (transparent background). Compress images (TinyPNG / Squoosh) and aim for
> < 200 KB each for fast loading.

---

## ✅ Required files & exact paths

### Root images
| File | Path | Purpose | Suggested size |
|------|------|---------|----------------|
| Logo | `assets/images/logo.png` | Header, splash, footer, favicon | 200×200 (square, transparent) |
| Hero banner | `assets/images/hero-banner.jpg` | Hero background | 1920×1080 |
| About photo | `assets/images/about.jpg` | "Our Story" section | 800×1000 (portrait) |
| CEO photo | `assets/images/ceo.jpg` | CEO profile (Ms Olamide) | 720×960 (portrait) |

### `cakes/` — product & showcase cakes
- `cake-1.jpg` (Chocolate Dream Cake)
- `cake-2.jpg` (Royal Wedding Tier)
- `cake-3.jpg` (Strawberry Vanilla Delight)
- `cake-4.jpg` (Anniversary Red Velvet)
- `cake-5.jpg` (Kids Theme Cake)
- `cake-6.jpg` (Luxury Engagement Cake)

### `pastries/` — pastries, snacks, desserts
- `cupcake-1.jpg`, `cupcake-2.jpg`
- `smallchops-1.jpg`
- `meatpie-1.jpg`
- `doughnut-1.jpg`
- `dessert-1.jpg`

### `gallery/` — portfolio lightbox images
- `g-1.jpg` … `g-8.jpg`

### `testimonials/` — customer avatars
- `t-1.jpg` … `t-4.jpg`

---

## 🔁 How to add or change images
1. Place your photo in the correct sub-folder.
2. Use the **exact filename** listed above (or update the path in
   `js/main.js` data arrays — `PRODUCTS`, `GALLERY`, `TESTIMONIALS`).
3. Refresh the page. Done!

## 🧩 Folder structure
```
assets/
└── images/
    ├── logo.png
    ├── hero-banner.jpg
    ├── about.jpg
    ├── ceo.jpg
    ├── cakes/
    ├── pastries/
    ├── gallery/
    └── testimonials/
```
