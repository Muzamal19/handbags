/* ============================================================
   DATA — products, categories, promos, image fallbacks
   ============================================================ */

const U = (id, w = 900) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;

window.PRODUCTS = [
  {
    id: 1, name: 'Lumière Tote', cat: 'Totes', price: 248, oldPrice: 320,
    rating: 4.9, reviews: 214, badge: 'Bestseller', badgeType: 'hot',
    desc: 'Roomy, structured, and endlessly wearable — the bag that goes everywhere.',
    images: [U('1584917865442-de89df76afd3'), U('1548036328-c9fa89d128fa'), U('1590874103328-eac38a683ce7')],
    colors: [
      { name: 'Blush', hex: '#FFB3C7' },
      { name: 'Lilac', hex: '#C9B6FF' },
      { name: 'Mint',  hex: '#A8E6CF' }
    ]
  },
  {
    id: 2, name: 'Odette Mini', cat: 'Mini', price: 189, oldPrice: null,
    rating: 4.8, reviews: 132, badge: 'New', badgeType: 'new',
    desc: 'Small bag, big energy. Fits phone, keys, cardholder and a little chaos.',
    images: [U('1591561954557-26941169b49e'), U('1566150905458-1bf1fc113f0d'), U('1594223274512-ad4803739b7c')],
    colors: [
      { name: 'Butter', hex: '#FFE066' },
      { name: 'Sky',    hex: '#A8D8FF' },
      { name: 'Pink',   hex: '#FFB3D9' }
    ]
  },
  {
    id: 3, name: 'Margaux Shoulder', cat: 'Shoulder', price: 312, oldPrice: null,
    rating: 4.9, reviews: 98, badge: null, badgeType: null,
    desc: 'Soft slouch, brass clasp, and a strap that sits just right.',
    images: [U('1614179689702-355944cd0918'), U('1553062407-98eeb64c6a62'), U('1606521607362-df2b1a3d3e2b')],
    colors: [
      { name: 'Caramel',   hex: '#D99A5E' },
      { name: 'Chocolate', hex: '#8A5C38' },
      { name: 'Cream',     hex: '#F5E6D3' }
    ]
  },
  {
    id: 4, name: 'Céline Clutch', cat: 'Clutches', price: 156, oldPrice: 195,
    rating: 4.7, reviews: 76, badge: 'Sale', badgeType: 'hot',
    desc: 'Evening, pared back. Satin-lined with a detachable gold chain.',
    images: [U('1575032617751-6ddec2089882'), U('1594633312681-425c7b97ccd1'), U('1564422170194-896b89110ef8')],
    colors: [
      { name: 'Noir', hex: '#2C1A24' },
      { name: 'Gold', hex: '#E8C77A' },
      { name: 'Rose', hex: '#F0B8C8' }
    ]
  },
  {
    id: 5, name: 'Aurelle Bucket', cat: 'Totes', price: 224, oldPrice: null,
    rating: 4.8, reviews: 143, badge: null, badgeType: null,
    desc: 'Drawstring, unlined ease. Slouches beautifully with every wear.',
    images: [U('1584917865442-de89df76afd3', 901), U('1590874103328-eac38a683ce7', 901), U('1548036328-c9fa89d128fa', 901)],
    colors: [
      { name: 'Coral', hex: '#FF8F7E' },
      { name: 'Sage',  hex: '#A8C4A2' },
      { name: 'Sand',  hex: '#E8D8C0' }
    ]
  },
  {
    id: 6, name: 'Vesper Crossbody', cat: 'Mini', price: 198, oldPrice: null,
    rating: 4.9, reviews: 187, badge: 'Bestseller', badgeType: 'hot',
    desc: 'Hands-free, all day. Adjustable strap and a hidden back pocket.',
    images: [U('1594223274512-ad4803739b7c', 902), U('1591561954557-26941169b49e', 902), U('1566150905458-1bf1fc113f0d', 902)],
    colors: [
      { name: 'Sage',  hex: '#8FB88F' },
      { name: 'Lilac', hex: '#B8A8E0' },
      { name: 'Black', hex: '#3A3A3A' }
    ]
  },
  {
    id: 7, name: 'Noa Hobo', cat: 'Shoulder', price: 276, oldPrice: 340,
    rating: 4.6, reviews: 64, badge: 'Sale', badgeType: 'hot',
    desc: 'Buttery drape, wide strap. The one you reach for without thinking.',
    images: [U('1553062407-98eeb64c6a62', 903), U('1614179689702-355944cd0918', 903), U('1606521607362-df2b1a3d3e2b', 903)],
    colors: [
      { name: 'Sand',  hex: '#E0C9A8' },
      { name: 'Tan',   hex: '#C49A6C' },
      { name: 'White', hex: '#F8F4EE' }
    ]
  },
  {
    id: 8, name: 'Isolde Evening', cat: 'Clutches', price: 172, oldPrice: null,
    rating: 4.8, reviews: 52, badge: null, badgeType: null,
    desc: 'Satin-lined, gold chain, and just enough sparkle for after dark.',
    images: [U('1594633312681-425c7b97ccd1', 904), U('1575032617751-6ddec2089882', 904), U('1564422170194-896b89110ef8', 904)],
    colors: [
      { name: 'Champagne', hex: '#F0DDB8' },
      { name: 'Ivory',     hex: '#FAF4E8' },
      { name: 'Rose',      hex: '#F0C0D0' }
    ]
  },
  {
    id: 9, name: 'Mira Top-Handle', cat: 'Totes', price: 298, oldPrice: null,
    rating: 4.9, reviews: 121, badge: 'New', badgeType: 'new',
    desc: 'Structured, boardroom-ready, and secretly fits a 13" laptop.',
    images: [U('1548036328-c9fa89d128fa', 905), U('1584917865442-de89df76afd3', 905), U('1590874103328-eac38a683ce7', 905)],
    colors: [
      { name: 'Ivory', hex: '#F5EDE0' },
      { name: 'Black', hex: '#2E2E2E' },
      { name: 'Blush', hex: '#F0C0CC' }
    ]
  },
  {
    id: 10, name: 'Poppy Baguette', cat: 'Shoulder', price: 214, oldPrice: null,
    rating: 4.7, reviews: 89, badge: null, badgeType: null,
    desc: 'A little Y2K, a lot of fun. Underarm strap, magnetic close.',
    images: [U('1564422170194-896b89110ef8', 906), U('1553062407-98eeb64c6a62', 906), U('1614179689702-355944cd0918', 906)],
    colors: [
      { name: 'Pink',  hex: '#FF7EB6' },
      { name: 'Red',   hex: '#E84A5F' },
      { name: 'Cream', hex: '#F8EEE0' }
    ]
  },
  {
    id: 11, name: 'Luna Bucket', cat: 'Totes', price: 236, oldPrice: null,
    rating: 4.8, reviews: 107, badge: null, badgeType: null,
    desc: 'Deep, roomy, and lined in a secret pop of color. A daily favorite.',
    images: [U('1590874103328-eac38a683ce7', 907), U('1584917865442-de89df76afd3', 907), U('1548036328-c9fa89d128fa', 907)],
    colors: [
      { name: 'Blue',   hex: '#7EB4F0' },
      { name: 'Navy',   hex: '#3A5A8C' },
      { name: 'Silver', hex: '#C8D0DC' }
    ]
  },
  {
    id: 12, name: 'Faye Mini', cat: 'Mini', price: 168, oldPrice: 210,
    rating: 4.6, reviews: 71, badge: 'Sale', badgeType: 'hot',
    desc: 'Pocket-sized sunshine. Chain strap, card slots, zero fuss.',
    images: [U('1566150905458-1bf1fc113f0d', 908), U('1591561954557-26941169b49e', 908), U('1594223274512-ad4803739b7c', 908)],
    colors: [
      { name: 'Yellow', hex: '#FFD93D' },
      { name: 'Orange', hex: '#FFA05C' },
      { name: 'White',  hex: '#FAF6F0' }
    ]
  }
];

window.CATEGORIES = [
  { name: 'Totes',    label: 'Everyday carry',   color: 'var(--pink)',   img: U('1584917865442-de89df76afd3', 500) },
  { name: 'Shoulder', label: 'Soft & slouchy',   color: 'var(--purple)', img: U('1614179689702-355944cd0918', 500) },
  { name: 'Mini',     label: 'Small but mighty', color: 'var(--teal)',   img: U('1591561954557-26941169b49e', 500) },
  { name: 'Clutches', label: 'After dark',       color: 'var(--orange)', img: U('1575032617751-6ddec2089882', 500) }
];

window.PROMOS = {
  BLOOM10:  { pct: 10, freeShip: false, label: '10% off' },
  FIRST20:  { pct: 20, freeShip: false, label: '20% off' },
  FREESHIP: { pct: 0,  freeShip: true,  label: 'Free shipping' }
};

/* ---------- Image fallback generator ---------- */
window.fallbackImage = function (hex = '#FFB3C7', label = 'Bloom & Bag') {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800">
      <defs>
        <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="${hex}" stop-opacity="0.35"/>
          <stop offset="100%" stop-color="${hex}" stop-opacity="0.9"/>
        </linearGradient>
      </defs>
      <rect width="800" height="800" fill="url(#g)"/>
      <circle cx="400" cy="380" r="230" fill="rgba(255,255,255,0.28)"/>
      <g transform="translate(400 400)">
        <path d="M-70 -80 V-130 a70 70 0 0 1 140 0 v50" fill="none"
              stroke="rgba(255,255,255,0.9)" stroke-width="18" stroke-linecap="round"/>
        <rect x="-140" y="-90" width="280" height="220" rx="46" fill="rgba(255,255,255,0.92)"/>
        <rect x="-140" y="-40" width="280" height="52" rx="20" fill="${hex}" opacity="0.55"/>
        <circle cx="0" cy="4" r="16" fill="${hex}"/>
      </g>
      <text x="400" y="720" text-anchor="middle" font-family="Georgia,serif"
            font-size="34" fill="rgba(255,255,255,0.92)" letter-spacing="4">${label}</text>
    </svg>`;
  return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg.trim());
};

/* ---------- Attach global image error handling ---------- */
window.attachImageFallbacks = function (root = document) {
  root.querySelectorAll('img[data-fallback]').forEach(img => {
    if (img.dataset.fbBound) return;
    img.dataset.fbBound = '1';
    img.addEventListener('error', () => {
      if (img.dataset.fbUsed) return;
      img.dataset.fbUsed = '1';
      img.src = window.fallbackImage(img.dataset.fallback || '#FFB3C7');
    });
  });
};