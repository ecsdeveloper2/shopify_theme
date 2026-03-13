document.addEventListener('DOMContentLoaded', function () {
const CartDrawer = document.getElementById('CartDrawer'),
    CartOverlay = document.getElementById('CartOverlay');

/* OPEN CART */
function openCart() {
    CartDrawer.classList.add('active');
    CartOverlay.classList.add('active');
    document.body.classList.add('cart-open');
}

/* CLOSE CART */
function closeCart() {
    CartDrawer.classList.remove('active');
    CartOverlay.classList.remove('active');
    document.body.classList.remove('cart-open');
}

/* UPDATE CART UI */
function updateCartUI(cart) {
    const subtotal = document.getElementById('DrawerSubtotal');
    const bubbles = document.querySelectorAll('.cart-count-bubble');

    const itemCount = Number(cart?.item_count) || 0;
    const totalPrice = Number(cart?.total_price) || 0;

    bubbles.forEach((b) => {
    const v = b.querySelector('span[aria-hidden="true"]');
    const h = b.querySelector('.visually-hidden');

    if (v) v.textContent = itemCount;
    if (h) h.textContent = itemCount + ' items';
    });

    if (subtotal) {
    subtotal.textContent = 'Rs. ' + (totalPrice / 100).toLocaleString('en-IN', { minimumFractionDigits: 2 });
    }
}

/* REFRESH CART DRAWER */
function refreshDrawer() {
    fetch(location.href)
    .then((r) => r.text())
    .then((html) => {
        const doc = new DOMParser().parseFromString(html, 'text/html'),
        newDrawer = doc.querySelector('#CartDrawer');
        if (newDrawer) CartDrawer.innerHTML = newDrawer.innerHTML;
    });

    fetch('/cart.js')
    .then((r) => r.json())
    .then((cart) => updateCartUI(cart));
}

/* ADD TO CART */
document.addEventListener('submit', function (e) {
    const form = e.target.closest('form[data-type="add-to-cart-form"]');
    if (!form) return;

    e.preventDefault();
    /* open drawer instantly */
    openCart();
    fetch('/cart/add.js', {
    method: 'POST',
    body: new FormData(form),
    headers: {
        Accept: 'application/json',
    },
    })
    .then((r) => r.json())
    .then((cart) => {
        updateCartUI(cart);
        refreshDrawer();
    })
    .catch((err) => console.error(err));
});

/* CLICK EVENTS */
document.addEventListener('click', function (e) {
    if (e.target.closest('#cart-icon-bubble')) {
    e.preventDefault();
    openCart();
    return;
    }
    if (e.target.id === 'CloseCart' || e.target.id === 'CartOverlay') {
    closeCart();
    return;
    }

    if (e.target.classList.contains('cart-remove-btn')) {
const btn = e.target;
const item = btn.closest('.drawer-item');

if (item) item.remove();

/* check if cart became empty */
if (!CartDrawer.querySelector('.drawer-item')) {
const body = CartDrawer.querySelector('.cart-drawer-body');
body.innerHTML = `
    <div class="cart-items-empty">
    <h1 class="cart-items__title h3">Your cart is empty</h1>
    <a href="/collections/all" class="btn">Continue shopping</a>
    </div>
`;
}
fetch('/cart/change.js', {
method: 'POST',
headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
},
body: JSON.stringify({
    id: btn.dataset.key,
    quantity: 0
})
})
.then(r => r.json())
.then(cart => updateCartUI(cart));

return;
}

    /* QUANTITY UPDATE */
    const qtyWrapper = e.target.closest('.drawer-qty');
    if (!qtyWrapper) return;
    if (qtyWrapper.classList.contains('loading')) return;
    qtyWrapper.classList.add('loading');

    let numberEl = qtyWrapper.querySelector('.qty-number');
    let minusBtn = qtyWrapper.querySelector('.qty-minus');
    let plusBtn = qtyWrapper.querySelector('.qty-plus');
    let value = parseInt(numberEl.textContent.trim()) || 1;
    let newQty = value;
    let max = parseInt(qtyWrapper.dataset.max) || 99;

    if (e.target.classList.contains('qty-plus')) newQty++;
    if (e.target.classList.contains('qty-minus')) newQty--;

    if (newQty < 1) newQty = 1;
    if (newQty > max) newQty = max;

    /* update UI instantly */
    numberEl.textContent = newQty;
    minusBtn.disabled = newQty <= 1;
    plusBtn.disabled = newQty >= max;

    fetch('/cart/change.js', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
    },
    body: JSON.stringify({
        id: qtyWrapper.dataset.key,
        quantity: newQty,
    }),
    })
    .then((res) => res.json())
    .then((cart) => updateCartUI(cart))
    .finally(() => qtyWrapper.classList.remove('loading'));
});
});