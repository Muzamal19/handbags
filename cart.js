/* ============================================================
   CART — state, persistence, totals, rendering
   ============================================================ */

(function () {
  const STORE_CART  = 'bb_cart_v2';
  const STORE_PROMO = 'bb_promo_v2';
  const STORE_WISH  = 'bb_wish_v2';

  const read = (k, d) => {
    try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; }
    catch (e) { return d; }
  };
  const write = (k, v) => {
    try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {}
  };

  const Cart = {
    items: read(STORE_CART, {}),      // key -> { id, color, qty }
    promo: read(STORE_PROMO, null),
    wishlist: read(STORE_WISH, []),
    listeners: [],

    on(fn) { this.listeners.push(fn); },
    emit() { this.listeners.forEach(fn => fn(this)); this.persist(); },
    persist() {
      write(STORE_CART, this.items);
      write(STORE_PROMO, this.promo);
      write(STORE_WISH, this.wishlist);
    },

    key(id, color) { return `${id}::${color}`; },

    add(id, color, qty = 1) {
      const k = this.key(id, color);
      if (this.items[k]) this.items[k].qty += qty;
      else this.items[k] = { id, color, qty };
      this.emit();
    },

    changeQty(key, delta) {
      if (!this.items[key]) return;
      this.items[key].qty += delta;
      if (this.items[key].qty <= 0) delete this.items[key];
      this.emit();
    },

    remove(key) { delete this.items[key]; this.emit(); },
    clear() { this.items = {}; this.promo = null; this.emit(); },

    count() {
      return Object.values(this.items).reduce((s, i) => s + i.qty, 0);
    },

    totals() {
      let subtotal = 0;
      Object.values(this.items).forEach(it => {
        const p = window.PRODUCTS.find(x => x.id === it.id);
        if (p) subtotal += p.price * it.qty;
      });

      const promo = this.promo ? window.PROMOS[this.promo] : null;
      const discount = promo ? Math.round(subtotal * promo.pct) / 100 : 0;
      let shipping = subtotal === 0 ? 0 : (subtotal >= 150 ? 0 : 12);
      if (promo && promo.freeShip) shipping = 0;

      const total = Math.max(0, subtotal - discount + shipping);
      return { subtotal, discount, shipping, total, promo };
    },

    applyPromo(code) {
      const c = String(code || '').trim().toUpperCase();
      if (!window.PROMOS[c]) return false;
      this.promo = c;
      this.emit();
      return true;
    },

    clearPromo() { this.promo = null; this.emit(); },

    toggleWish(id) {
      const i = this.wishlist.indexOf(id);
      if (i > -1) this.wishlist.splice(i, 1);
      else this.wishlist.push(id);
      this.emit();
      return i === -1;
    },

    isWished(id) { return this.wishlist.includes(id); }
  };

  window.Cart = Cart;
})();