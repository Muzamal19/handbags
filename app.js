/* ============================================================
   APP — UI wiring, rendering, filters, modals, toast
   ============================================================ */

(function () {
  const $  = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const money = n => '$' + Number(n).toFixed(2);

  /* ---------- TOAST ---------- */
  let toastTimer;
  window.showToast = function (msg) {
    $('#toastMsg').textContent = msg;
    const t = $('#toast');
    t.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove('show'), 2600);
  };

  /* ---------- CART DRAWER OPEN / CLOSE ---------- */
  window.openCart = function () {
    $('#drawer').classList.add('open');
    $('#overlay').classList.add('open');
    document.body.style.overflow = 'hidden';
  };
  window.closeCart = function () {
    $('#drawer').classList.remove('open');
    if (!$('#productModal').classList.contains('open') &&
        !$('#checkoutModal').classList.contains('open')) {
      $('#overlay').classList.remove('open');
      document.body.style.overflow = '';
    }
  };

  /* ---------- FILTER STATE ---------- */
  const ui = { filter: 'All', sort: 'featured', search: '' };

  /* ============================================================
     CATEGORIES
     ============================================================ */
  function renderCategories() {
    $('#catGrid').innerHTML = window.CATEGORIES.map(c => `
      <div class="cat" data-cat="${c.name}" style="color:${c.color}">
        <div class="cat-img">
          <img src="${c.img}" alt="${c.name} collection"
               data-fallback="#FFB3C7" loading="lazy" />
        </div>
        <h3>${c.name}</h3>
        <span>${c.label}</span>
      </div>
    `).join('');
    window.attachImageFallbacks($('#catGrid'));
  }

  /* ============================================================
     FILTER PILLS
     ============================================================ */
  function renderFilters() {
    const list = ['All', 'Totes', 'Shoulder', 'Mini', 'Clutches', 'Saved'];
    $('#filters').innerHTML = list.map(f => {
      const cls = f === 'Saved' ? 'pill saved' : 'pill';
      const label = f === 'Saved' ? '♥ Saved' : f;
      const active = f === ui.filter ? ' active' : '';
      return `<button class="${cls}${active}" data-filter="${f}">${label}</button>`;
    }).join('');
  }

  /* ============================================================
     PRODUCT GRID
     ============================================================ */
  function visibleProducts() {
    let list = window.PRODUCTS.slice();

    if (ui.filter === 'Saved') {
      list = list.filter(p => window.Cart.isWished(p.id));
    } else if (ui.filter !== 'All') {
      list = list.filter(p => p.cat === ui.filter);
    }

    if (ui.search.trim()) {
      const q = ui.search.toLowerCase();
      list = list.filter(p =>
        (p.name + ' ' + p.cat + ' ' + p.desc).toLowerCase().includes(q)
      );
    }

    if (ui.sort === 'low')    list.sort((a, b) => a.price - b.price);
    if (ui.sort === 'high')   list.sort((a, b) => b.price - a.price);
    if (ui.sort === 'rating') list.sort((a, b) => b.rating - a.rating);

    return list;
  }

  function renderProducts() {
    const grid = $('#productGrid');
    const list = visibleProducts();

    if (!list.length) {
      grid.innerHTML = `
        <div class="empty-state">
          <svg viewBox="0 0 24 24"><path d="M6 7h12l-1 13H7L6 7z"/><path d="M9 7V5a3 3 0 0 1 6 0v2"/></svg>
          <p>${ui.filter === 'Saved'
            ? 'No saved bags yet — tap a heart to save one.'
            : 'No bags match that search. Try something else!'}</p>
        </div>`;
      return;
    }

    grid.innerHTML = list.map((p, i) => {
      const saved = window.Cart.isWished(p.id);
      return `
        <article class="card" style="animation-delay:${i * 45}ms" data-open="${p.id}">
          <div class="card-media">
            ${p.badge ? `<span class="tag ${p.badgeType || ''}">${p.badge}</span>` : ''}
            <button class="wish-btn ${saved ? 'on' : ''}" data-wish="${p.id}"
                    aria-label="Save ${p.name}">
              <svg viewBox="0 0 24 24"><path d="M12 20s-7-4.4-7-9.2A4 4 0 0 1 12 8a4 4 0 0 1 7 2.8C19 15.6 12 20 12 20z"/></svg>
            </button>
            <img src="${p.images[0]}" alt="${p.name}"
                 data-fallback="${p.colors[0].hex}" loading="lazy" />
          </div>
          <div class="card-body">
            <span class="cat-label">${p.cat}</span>
            <h3>${p.name}</h3>
            <p class="desc">${p.desc}</p>
            <div class="rating">
              <span class="stars">${'★'.repeat(Math.round(p.rating))}</span>
              ${p.rating} · ${p.reviews} reviews
            </div>
            <div class="card-foot">
              <div class="price-wrap">
                <span class="price">${money(p.price)}</span>
                ${p.oldPrice ? `<span class="old-price">${money(p.oldPrice)}</span>` : ''}
              </div>
              <button class="add-btn" data-add="${p.id}">
                <svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>
                Add
              </button>
            </div>
          </div>
        </article>`;
    }).join('');

    window.attachImageFallbacks(grid);
    bindTilt();
  }

  /* ---------- 3D TILT ON CARDS ---------- */
  function bindTilt() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (window.matchMedia('(hover: none)').matches) return;

    $$('.card').forEach(card => {
      card.addEventListener('mousemove', e => {
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        card.style.transform =
          `perspective(900px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) translateY(-8px)`;
      });
      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });
  }

  /* ============================================================
     PRODUCT MODAL
     ============================================================ */
  let modalProduct = null;
  let modalColor = null;
  let modalQty = 1;
  let modalImgIdx = 0;

  function openProduct(id) {
    modalProduct = window.PRODUCTS.find(p => p.id === id);
    modalColor = modalProduct.colors[0];
    modalQty = 1;
    modalImgIdx = 0;
    renderProductModal();
    $('#productModal').classList.add('open');
    $('#overlay').classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeProduct() {
    $('#productModal').classList.remove('open');
    if (!$('#checkoutModal').classList.contains('open') &&
        !$('#drawer').classList.contains('open')) {
      $('#overlay').classList.remove('open');
      document.body.style.overflow = '';
    }
  }

  function renderProductModal() {
    const p = modalProduct;
    const saved = window.Cart.isWished(p.id);

    $('#pmContent').innerHTML = `
      <div class="pm-visual">
        <img src="${p.images[modalImgIdx]}" alt="${p.name}"
             data-fallback="${modalColor.hex}" />
        <div class="pm-thumbs">
          ${p.images.map((src, i) => `
            <button class="${i === modalImgIdx ? 'active' : ''}" data-img="${i}">
              <img src="${src}" alt="${p.name} view ${i + 1}" data-fallback="${modalColor.hex}" />
            </button>`).join('')}
        </div>
      </div>
      <div class="pm-info">
        <span class="cat-label">${p.cat}</span>
        <h2>${p.name}</h2>
        <div class="pm-rating">
          <span class="stars">${'★'.repeat(Math.round(p.rating))}</span>
          ${p.rating} · ${p.reviews} reviews
        </div>
        <p class="pm-desc">${p.desc}</p>
        <div class="pm-price">
          <span class="price">${money(p.price)}</span>
          ${p.oldPrice ? `<span class="old-price">${money(p.oldPrice)}</span>` : ''}
        </div>
        <div class="pm-label">Color — <span style="color:var(--ink)">${modalColor.name}</span></div>
        <div class="swatches">
          ${p.colors.map((c, i) => `
            <button class="swatch ${c.name === modalColor.name ? 'active' : ''}"
                    style="background:${c.hex}" data-color="${i}"
                    aria-label="${c.name}"></button>`).join('')}
        </div>
        <div class="pm-actions">
          <div class="pm-qty">
            <button data-mq="-1" aria-label="Decrease">−</button>
            <span>${modalQty}</span>
            <button data-mq="1" aria-label="Increase">+</button>
          </div>
          <button class="btn btn-primary" id="pmAdd">
            Add to bag · ${money(p.price * modalQty)}
          </button>
        </div>
        <div class="pm-perks">
          <span class="perk"><svg viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5"/></svg>Free shipping</span>
          <span class="perk"><svg viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5"/></svg>30-day returns</span>
          <span class="perk"><svg viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5"/></svg>2yr warranty</span>
        </div>
        <button class="btn btn-ghost" id="pmWish" style="margin-top:.9rem">
          ${saved ? '♥ Saved to wishlist' : '♡ Save to wishlist'}
        </button>
      </div>`;

    window.attachImageFallbacks($('#pmContent'));
  }

  /* ============================================================
     CART UI RENDER
     ============================================================ */
  function renderCart() {
    const { subtotal, discount, shipping, total, promo } = window.Cart.totals();
    const keys = Object.keys(window.Cart.items);
    const count = window.Cart.count();

    /* badges */
    const badge = $('#cartCount');
    badge.textContent = count;
    badge.classList.toggle('show', count > 0);
    $('#drawerCount').textContent = `${count} item${count === 1 ? '' : 's'}`;

    /* wishlist badge */
    const wb = $('#wishCount');
    wb.textContent = window.Cart.wishlist.length;
    wb.classList.toggle('show', window.Cart.wishlist.length > 0);

    /* body */
    const body = $('#drawerBody');
    if (!keys.length) {
      body.innerHTML = `
        <div class="empty">
          <svg viewBox="0 0 24 24"><path d="M6 7h12l-1 13H7L6 7z"/><path d="M9 7V5a3 3 0 0 1 6 0v2"/></svg>
          <p>Your bag is empty.<br>Let's find something beautiful.</p>
          <button class="btn btn-primary" id="emptyShopBtn">Browse bags</button>
        </div>`;
    } else {
      body.innerHTML = keys.map(key => {
        const it = window.Cart.items[key];
        const p = window.PRODUCTS.find(x => x.id === it.id);
        if (!p) return '';
        const c = p.colors.find(x => x.name === it.color) || p.colors[0];
        return `
          <div class="line-item">
            <div class="li-thumb">
              <img src="${p.images[0]}" alt="${p.name}" data-fallback="${c.hex}" />
            </div>
            <div class="li-info">
              <h4>${p.name}</h4>
              <div class="li-color"><i style="background:${c.hex}"></i>${it.color}</div>
              <div class="li-price">${money(p.price)}</div>
              <div class="qty">
                <button data-dec="${key}" aria-label="Decrease">−</button>
                <span>${it.qty}</span>
                <button data-inc="${key}" aria-label="Increase">+</button>
              </div>
            </div>
            <button class="li-remove" data-rem="${key}">Remove</button>
          </div>`;
      }).join('');
      window.attachImageFallbacks(body);
    }

    /* promo area */
    const promoArea = $('#promoArea');
    if (promo) {
      promoArea.innerHTML = `
        <div class="promo-applied">
          <span>✦ ${window.Cart.promo} applied — ${promo.label}</span>
          <button id="removePromo">Remove</button>
        </div>`;
    } else {
      promoArea.innerHTML = `
        <div class="promo-box">
          <input type="text" id="promoInput" placeholder="Promo code" aria-label="Promo code" />
          <button id="applyPromo">Apply</button>
        </div>
        <p class="promo-hint">Try <code>BLOOM10</code> · <code>FIRST20</code> · <code>FREESHIP</code></p>`;
    }

    /* totals */
    const totalsArea = $('#totalsArea');
    if (keys.length) {
      const remaining = Math.max(0, 150 - subtotal);
      totalsArea.innerHTML = `
        <div class="ship-note ${remaining === 0 ? 'free' : ''}">
          ${remaining === 0
            ? '🎉 You unlocked free shipping!'
            : `Add ${money(remaining)} more for free shipping`}
        </div>
        <div class="tot-row"><span>Subtotal</span><span>${money(subtotal)}</span></div>
        ${discount > 0
          ? `<div class="tot-row discount"><span>Discount (${promo.label})</span><span>−${money(discount)}</span></div>`
          : ''}
        <div class="tot-row"><span>Shipping</span><span>${shipping === 0 ? 'Free' : money(shipping)}</span></div>
        <div class="tot-row grand"><span>Total</span><span>${money(total)}</span></div>`;
    } else {
      totalsArea.innerHTML = '';
    }

    $('#checkoutBtn').disabled = keys.length === 0;
  }

  /* ============================================================
     EVENT WIRING
     ============================================================ */
  function bindEvents() {
    /* --- header --- */
    $('#cartBtn').addEventListener('click', window.openCart);
    $('#closeCart').addEventListener('click', window.closeCart);
    $('#checkoutBtn').addEventListener('click', () => window.Checkout.open());

    $('#wishBtn').addEventListener('click', () => {
      ui.filter = 'Saved';
      renderFilters();
      renderProducts();
      document.getElementById('shop').scrollIntoView({ behavior: 'smooth' });
      window.showToast(
        window.Cart.wishlist.length
          ? `${window.Cart.wishlist.length} saved bag${window.Cart.wishlist.length > 1 ? 's' : ''}`
          : 'Your wishlist is empty'
      );
    });

    /* --- overlay --- */
    $('#overlay').addEventListener('click', () => {
      window.closeCart();
      closeProduct();
      window.Checkout.close();
    });

    /* --- esc --- */
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') {
        window.closeCart();
        closeProduct();
        window.Checkout.close();
        $('#navLinks').classList.remove('open');
      }
    });

    /* --- filters --- */
    $('#filters').addEventListener('click', e => {
      const btn = e.target.closest('.pill');
      if (!btn) return;
      ui.filter = btn.dataset.filter;
      renderFilters();
      renderProducts();
    });

    /* --- categories --- */
    $('#catGrid').addEventListener('click', e => {
      const card = e.target.closest('.cat');
      if (!card) return;
      ui.filter = card.dataset.cat;
      renderFilters();
      renderProducts();
      document.getElementById('shop').scrollIntoView({ behavior: 'smooth' });
    });

    /* --- search + sort --- */
    $('#searchInput').addEventListener('input', e => {
      ui.search = e.target.value;
      renderProducts();
    });
    $('#sortSelect').addEventListener('change', e => {
      ui.sort = e.target.value;
      renderProducts();
    });

    /* --- product grid --- */
    $('#productGrid').addEventListener('click', e => {
      const wish = e.target.closest('[data-wish]');
      if (wish) {
        e.stopPropagation();
        const added = window.Cart.toggleWish(Number(wish.dataset.wish));
        window.showToast(added ? 'Saved to your wishlist ♥' : 'Removed from saved');
        renderProducts();
        return;
      }

      const add = e.target.closest('[data-add]');
      if (add) {
        e.stopPropagation();
        const p = window.PRODUCTS.find(x => x.id === Number(add.dataset.add));
        window.Cart.add(p.id, p.colors[0].name, 1);
        window.showToast(`${p.name} (${p.colors[0].name}) added to bag`);
        const badge = $('#cartCount');
        badge.style.transform = 'scale(1.4)';
        setTimeout(() => { badge.style.transform = ''; }, 220);
        return;
      }

      const card = e.target.closest('[data-open]');
      if (card) openProduct(Number(card.dataset.open));
    });

    /* --- product modal --- */
    $('#pmContent').addEventListener('click', e => {
      const thumb = e.target.closest('[data-img]');
      if (thumb) {
        modalImgIdx = Number(thumb.dataset.img);
        renderProductModal();
        return;
      }

      const sw = e.target.closest('[data-color]');
      if (sw) {
        modalColor = modalProduct.colors[Number(sw.dataset.color)];
        renderProductModal();
        return;
      }

      const q = e.target.closest('[data-mq]');
      if (q) {
        modalQty = Math.max(1, Math.min(10, modalQty + Number(q.dataset.mq)));
        renderProductModal();
        return;
      }

      if (e.target.closest('#pmAdd')) {
        window.Cart.add(modalProduct.id, modalColor.name, modalQty);
        window.showToast(`${modalProduct.name} added to bag`);
        closeProduct();
        window.openCart();
        return;
      }

      if (e.target.closest('#pmWish')) {
        const added = window.Cart.toggleWish(modalProduct.id);
        window.showToast(added ? 'Saved to wishlist ♥' : 'Removed from saved');
        renderProductModal();
        renderProducts();
      }
    });

    $('#closeProduct').addEventListener('click', closeProduct);
    $('#closeCheckout').addEventListener('click', () => window.Checkout.close());

    /* --- cart drawer body --- */
    $('#drawerBody').addEventListener('click', e => {
      const inc = e.target.closest('[data-inc]');
      const dec = e.target.closest('[data-dec]');
      const rem = e.target.closest('[data-rem]');

      if (inc) window.Cart.changeQty(inc.dataset.inc, 1);
      if (dec) window.Cart.changeQty(dec.dataset.dec, -1);
      if (rem) {
        window.Cart.remove(rem.dataset.rem);
        window.showToast('Removed from bag');
      }
      if (e.target.closest('#emptyShopBtn')) {
        window.closeCart();
        document.getElementById('shop').scrollIntoView({ behavior: 'smooth' });
      }
    });

    /* --- promo --- */
    $('#promoArea').addEventListener('click', e => {
      if (e.target.closest('#applyPromo')) {
        const input = $('#promoInput');
        const code = input.value.trim();
        if (!code) { window.showToast('Enter a promo code first'); return; }
        if (window.Cart.applyPromo(code)) {
          window.showToast(`Promo applied: ${window.PROMOS[code.toUpperCase()].label}`);
        } else {
          window.showToast("That code isn't valid — try BLOOM10");
          input.style.borderColor = 'var(--red)';
          setTimeout(() => { input.style.borderColor = ''; }, 900);
        }
      }
      if (e.target.closest('#removePromo')) {
        window.Cart.clearPromo();
        window.showToast('Promo removed');
      }
    });

    $('#promoArea').addEventListener('keydown', e => {
      if (e.key === 'Enter' && e.target.id === 'promoInput') {
        e.preventDefault();
        $('#applyPromo')?.click();
      }
    });

    /* --- mobile nav --- */
    $('#burger').addEventListener('click', () => $('#navLinks').classList.toggle('open'));
    $('#navLinks').addEventListener('click', e => {
      if (e.target.tagName === 'A') $('#navLinks').classList.remove('open');
    });

    /* --- newsletter --- */
    $('#newsForm').addEventListener('submit', e => {
      e.preventDefault();
      e.currentTarget.innerHTML =
        `<p class="success">✦ You're in! Check your inbox for code FIRST20.</p>`;
      window.showToast('Subscribed — code FIRST20 sent!');
    });
  }

  /* ============================================================
     INIT
     ============================================================ */
  function init() {
    renderCategories();
    renderFilters();
    renderProducts();
    bindEvents();
    window.Checkout.bind();

    window.Cart.on(renderCart);
    renderCart();

    window.attachImageFallbacks(document);

    /* replay 3D button → tell three-scene.js */
    $('#replay3d')?.addEventListener('click', () => {
      window.dispatchEvent(new CustomEvent('bb:replay3d'));
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();