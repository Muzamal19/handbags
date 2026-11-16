/* ============================================================
   CHECKOUT — 3-step flow with validation & order confirmation
   ============================================================ */

(function () {
  const $  = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const money = n => '$' + Number(n).toFixed(2);

  let step = 1;
  let data = {};

  const Checkout = {
    open() {
      if (!window.Cart.count()) { window.showToast('Add a bag first!'); return; }
      step = 1; data = {};
      window.closeCart();
      this.render();
      $('#checkoutModal').classList.add('open');
      $('#overlay').classList.add('open');
      document.body.style.overflow = 'hidden';
    },

    close() {
      $('#checkoutModal').classList.remove('open');
      if (!$('#productModal').classList.contains('open') &&
          !$('#drawer').classList.contains('open')) {
        $('#overlay').classList.remove('open');
        document.body.style.overflow = '';
      }
    },

    summaryHTML() {
      const t = window.Cart.totals();
      return `
        <div class="co-summary">
          <div class="tot-row"><span>Subtotal</span><span>${money(t.subtotal)}</span></div>
          ${t.discount > 0
            ? `<div class="tot-row discount"><span>Discount (${t.promo.label})</span><span>−${money(t.discount)}</span></div>`
            : ''}
          <div class="tot-row"><span>Shipping</span><span>${t.shipping === 0 ? 'Free' : money(t.shipping)}</span></div>
          <div class="tot-row grand"><span>Total</span><span>${money(t.total)}</span></div>
        </div>`;
    },

    render() {
      $$('#coSteps .step-dot').forEach(s => {
        const n = Number(s.dataset.step);
        s.classList.toggle('active', n === step);
        s.classList.toggle('done', n < step);
      });

      const body = $('#coBody');

      /* ---------- STEP 1: SHIPPING ---------- */
      if (step === 1) {
        body.innerHTML = `
          <div class="co-panel active">
            ${this.summaryHTML()}
            <div class="field">
              <label for="coEmail">Email address</label>
              <input id="coEmail" type="email" placeholder="you@example.com" value="${data.email || ''}" />
            </div>
            <div class="field">
              <label for="coName">Full name</label>
              <input id="coName" type="text" placeholder="Jane Doe" value="${data.name || ''}" />
            </div>
            <div class="field">
              <label for="coAddress">Street address</label>
              <input id="coAddress" type="text" placeholder="123 Bloom Street" value="${data.address || ''}" />
            </div>
            <div class="field-row">
              <div class="field">
                <label for="coCity">City</label>
                <input id="coCity" type="text" placeholder="New York" value="${data.city || ''}" />
              </div>
              <div class="field">
                <label for="coZip">ZIP / Postal code</label>
                <input id="coZip" type="text" placeholder="10001" value="${data.zip || ''}" />
              </div>
            </div>
            <div class="field">
              <label for="coCountry">Country</label>
              <select id="coCountry">
                ${['United States','United Kingdom','Canada','Australia','Germany','France','India','Other']
                  .map(c => `<option ${data.country === c ? 'selected' : ''}>${c}</option>`).join('')}
              </select>
            </div>
            <div class="co-actions">
              <button class="btn btn-primary" id="coNext">Continue to payment</button>
            </div>
          </div>`;
      }

      /* ---------- STEP 2: PAYMENT ---------- */
      if (step === 2) {
        const t = window.Cart.totals();
        body.innerHTML = `
          <div class="co-panel active">
            ${this.summaryHTML()}
            <div class="field">
              <label for="coCard">Card number</label>
              <input id="coCard" type="text" inputmode="numeric"
                     placeholder="4242 4242 4242 4242" maxlength="19" value="${data.card || ''}" />
            </div>
            <div class="field-row">
              <div class="field">
                <label for="coExp">Expiry</label>
                <input id="coExp" type="text" placeholder="MM/YY" maxlength="5" value="${data.exp || ''}" />
              </div>
              <div class="field">
                <label for="coCvc">CVC</label>
                <input id="coCvc" type="text" inputmode="numeric"
                       placeholder="123" maxlength="4" value="${data.cvc || ''}" />
              </div>
            </div>
            <div class="field">
              <label for="coCardName">Name on card</label>
              <input id="coCardName" type="text" placeholder="Jane Doe" value="${data.cardName || ''}" />
            </div>
            <p style="font-size:.74rem;color:var(--muted);margin-top:.4rem">
              🔒 Demo only — no payment is processed. Use any test numbers.
            </p>
            <div class="co-actions">
              <button class="btn btn-ghost" id="coBack">Back</button>
              <button class="btn btn-primary" id="coPay">Pay ${money(t.total)}</button>
            </div>
          </div>`;
      }

      /* ---------- STEP 3: CONFIRMATION ---------- */
      if (step === 3) {
        const items = Object.entries(window.Cart.items).map(([k, it]) => {
          const p = window.PRODUCTS.find(x => x.id === it.id);
          return p
            ? `<div class="order-line">
                 <span>${p.name} × ${it.qty}
                   <small style="color:var(--muted)">(${it.color})</small>
                 </span>
                 <b>${money(p.price * it.qty)}</b>
               </div>`
            : '';
        }).join('');

        body.innerHTML = `
          <div class="co-panel active">
            <div class="confirm">
              <div class="check-circle">
                <svg viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5"/></svg>
              </div>
              <h3>Order confirmed!</h3>
              <p>Thanks ${data.name ? data.name.split(' ')[0] : 'friend'} — your bag is on its way.</p>
              <div class="order-num">Order ${data.orderNum}</div>
              <div class="order-items">
                <h4>What you ordered</h4>
                ${items}
              </div>
              <div class="co-actions">
                <button class="btn btn-primary" id="coDone">Keep shopping</button>
              </div>
            </div>
          </div>`;
      }
    },

    bind() {
      const body = $('#coBody');

      body.addEventListener('click', e => {
        /* NEXT → step 2 */
        if (e.target.closest('#coNext')) {
          const email = $('#coEmail').value.trim();
          const name  = $('#coName').value.trim();
          const addr  = $('#coAddress').value.trim();
          const city  = $('#coCity').value.trim();
          const zip   = $('#coZip').value.trim();

          let ok = true;
          [['#coEmail', /.+@.+\..+/.test(email)],
           ['#coName', !!name],
           ['#coAddress', !!addr],
           ['#coCity', !!city],
           ['#coZip', !!zip]].forEach(([sel, valid]) => {
            const el = $(sel);
            if (!valid) { el.classList.add('err'); ok = false; }
            else el.classList.remove('err');
          });

          if (!ok) { window.showToast('Please fill in all fields correctly'); return; }

          data = { email, name, address: addr, city, zip, country: $('#coCountry').value };
          step = 2;
          this.render();
        }

        /* BACK → step 1 */
        if (e.target.closest('#coBack')) {
          data.card     = $('#coCard')?.value || '';
          data.exp      = $('#coExp')?.value || '';
          data.cvc      = $('#coCvc')?.value || '';
          data.cardName = $('#coCardName')?.value || '';
          step = 1;
          this.render();
        }

        /* PAY → step 3 */
        if (e.target.closest('#coPay')) {
          const card = ($('#coCard').value || '').replace(/\s/g, '');
          const exp  = ($('#coExp').value || '').trim();
          const cvc  = ($('#coCvc').value || '').trim();
          const cname = ($('#coCardName').value || '').trim();

          let ok = true;
          [['#coCard', card.length >= 15],
           ['#coExp', /^\d{2}\/\d{2}$/.test(exp)],
           ['#coCvc', cvc.length >= 3],
           ['#coCardName', !!cname]].forEach(([sel, valid]) => {
            const el = $(sel);
            if (!valid) { el.classList.add('err'); ok = false; }
            else el.classList.remove('err');
          });

          if (!ok) { window.showToast('Check your card details'); return; }

          data.card = $('#coCard').value;
          data.exp = exp;
          data.cvc = cvc;
          data.cardName = cname;
          data.orderNum = 'BB-' + Math.floor(100000 + Math.random() * 900000);

          window.Cart.clear();
          step = 3;
          this.render();
          window.showToast('🎉 Order placed successfully!');
        }

        /* DONE */
        if (e.target.closest('#coDone')) {
          this.close();
          document.getElementById('shop').scrollIntoView({ behavior: 'smooth' });
        }
      });

      /* live-format card fields */
      body.addEventListener('input', e => {
        if (e.target.id === 'coCard') {
          const v = e.target.value.replace(/\D/g, '').slice(0, 16);
          e.target.value = v.replace(/(.{4})/g, '$1 ').trim();
        }
        if (e.target.id === 'coExp') {
          let v = e.target.value.replace(/\D/g, '').slice(0, 4);
          if (v.length >= 3) v = v.slice(0, 2) + '/' + v.slice(2);
          e.target.value = v;
        }
        if (e.target.id === 'coCvc') {
          e.target.value = e.target.value.replace(/\D/g, '').slice(0, 4);
        }
      });
    }
  };

  window.Checkout = Checkout;
})();