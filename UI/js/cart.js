const localhost = 'http://localhost:9999/api/v1';
const cartTable = document.getElementById('cartTable');
const cartErr = document.getElementById('cartErr');
const checkoutBtn = document.getElementById('checkoutBtn');
const generalModal = document.getElementById('generalModal');
const msg = document.getElementById('generalInfo');
const closeButtons = document.getElementsByClassName('close');
const total = document.getElementById('totalPrice');
const totalItems = document.getElementById('totalItems');
const subtotal = document.getElementById('subtotalPrice');
const couponField = document.getElementById('couponCode');
const couponBtn = document.getElementById('applyCouponBtn');
const removeCouponBtn = document.getElementById('removeCouponBtn');
const couponMsg = document.getElementById('couponMsg');
const discount = document.getElementById('discountPrice');
let totalPrice = 0;
let totalQty = 0;
let orders = [];
let cartArray = [];
let appliedCoupon = null;
let rows = [];

function cartKey() {
  return `fastfoodfast.cart.v1.${localStorage.getItem('id') || 'anonymous'}`;
}

function readCoupons() {
  try {
    const data = JSON.parse(localStorage.getItem('fastfoodfast.coupons.v1'));
    return data && Array.isArray(data.coupons) ? data.coupons : [];
  } catch (error) {
    return [];
  }
}

function displayModal(modal, close) {
  if (!modal || !close) return;
  modal.style.display = 'block';
  close.onclick = () => { modal.style.display = 'none'; };
  window.onclick = event => { if (event.target === modal) modal.style.display = 'none'; };
}

function productElement(prefix, productId) {
  const normalizedId = normalizeProductId(productId);
  if (!normalizedId) return null;
  const candidates = [normalizedId, normalizedId.padStart(2, '0')];
  return candidates.map(id => document.getElementById(`${prefix}${id}`)).find(Boolean) || null;
}

function productPrice(productId) {
  const element = productElement('price', productId);
  if (!element) return null;
  const value = Number(element.textContent.replace(/[^\d.]/g, ''));
  return Number.isFinite(value) && value >= 0 ? value : null;
}

function normalizeProductId(value) {
  if (value === undefined || value === null) return null;
  const productId = String(value).trim();
  if (!/^\d+$/.test(productId) || Number(productId) <= 0) return null;
  return String(Number(productId));
}

function validItem(item) {
  return item && normalizeProductId(item.productId) && Number.isInteger(item.quantity) && item.quantity > 0;
}

function persistCart() {
  const items = orders.map(item => ({ productId: normalizeProductId(item.productId), quantity: item.quantity }));
  localStorage.setItem(cartKey(), JSON.stringify({ version: 2, items }));
  if (localStorage.getItem('id')) localStorage.setItem(`cartCount.${localStorage.getItem('id')}`, `${totalQty}`);
}

function discountValue() {
  if (!appliedCoupon) return 0;
  if (appliedCoupon.discountType === 'percentage') return Math.min(totalPrice, totalPrice * appliedCoupon.discountValue / 100);
  return Math.min(totalPrice, appliedCoupon.discountValue);
}

function updateTotals() {
  totalQty = orders.reduce((sum, item) => sum + item.quantity, 0);
  totalPrice = orders.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const reduction = discountValue();
  if (totalItems) totalItems.textContent = totalQty;
  if (subtotal) subtotal.textContent = totalPrice.toFixed(2);
  if (discount) discount.textContent = reduction.toFixed(2);
  if (total) total.textContent = (totalPrice - reduction).toFixed(2);
  if (checkoutBtn) checkoutBtn.disabled = totalPrice === 0;
  persistCart();
}

function appendRow(order) {
  if (!cartTable) return;
  const tr = document.createElement('TR');
  const values = ['-', order.name, order.quantity, (order.price * order.quantity).toFixed(2)];
  values.forEach(value => {
    const cell = document.createElement('TD');
    cell.textContent = value;
    tr.appendChild(cell);
  });
  const action = document.createElement('TD');
  const remove = document.createElement('BUTTON');
  remove.className = 'cancelOdr';
  remove.textContent = 'Delete Item';
  remove.onclick = () => {
    orders = orders.filter(item => item.productId !== order.productId);
    renderCart();
  };
  action.appendChild(remove);
  tr.appendChild(action);
  cartTable.appendChild(tr);
  rows.push(tr);
}

function renderCart() {
  rows.forEach(row => row.remove());
  rows = [];
  orders.forEach(appendRow);
  cartArray = orders.map(item => ({ name: item.name, quantity: item.quantity }));
  updateTotals();
}

function loadCart() {
  let stored;
  try {
    stored = JSON.parse(localStorage.getItem(cartKey()));
  } catch (error) {
    stored = null;
  }
  const items = stored && Array.isArray(stored.items) ? stored.items : [];
  const restored = items.filter(validItem).map((item) => {
    const productId = normalizeProductId(item.productId);
    const nameElement = productElement('item', productId);
    const price = productPrice(productId);
    return price === null || !nameElement ? null : { productId, name: nameElement.textContent, quantity: item.quantity, price };
  }).filter(Boolean);
  if (items.length > 0 && restored.length === 0) return;
  orders = restored;
  renderCart();
}

function applyCoupon(code) {
  const normalized = code.trim().toUpperCase();
  return readCoupons().find(coupon => coupon.code === normalized
    && (coupon.discountType === 'percentage' || coupon.discountType === 'fixed')
    && Number.isFinite(coupon.discountValue) && coupon.discountValue > 0
    && (coupon.discountType !== 'percentage' || coupon.discountValue <= 100));
}

if (couponBtn) couponBtn.onclick = () => {
  const coupon = applyCoupon(couponField.value);
  if (!coupon) {
    couponMsg.textContent = 'Coupon not found';
    return;
  }
  appliedCoupon = coupon;
  couponMsg.textContent = `Coupon ${coupon.code} applied for display only. The official order value is unchanged.`;
  updateTotals();
};

if (removeCouponBtn) removeCouponBtn.onclick = () => {
  appliedCoupon = null;
  couponField.value = '';
  couponMsg.textContent = '';
  updateTotals();
};

document.addEventListener('click', (event) => {
  const button = event.target.closest('.cartBtn');
  if (!button) return;
  const productId = button.id.slice(3);
  const nameElement = productElement('item', productId);
  const quantityElement = productElement('selectQty', productId);
  const price = productPrice(productId);
  if (!nameElement || !quantityElement || price === null) return;
  const quantity = Number(quantityElement.value);
  const normalizedId = normalizeProductId(productId);
  const existing = orders.find(item => normalizeProductId(item.productId) === normalizedId);
  if (existing) existing.quantity += quantity;
  else orders.push({ productId: normalizedId, name: nameElement.textContent, quantity, price });
  renderCart();
  const current = orders.find(item => normalizeProductId(item.productId) === normalizedId);
  msg.textContent = `${current.quantity}x ${current.name} successfully added to cart`;
  displayModal(generalModal, closeButtons[1]);
});

const modal = document.getElementById('modalDiv');
const cart = document.getElementById('cartInfo');
const address = document.getElementById('userAddr');
const phone = document.getElementById('userPhone');
if (cart) cart.onclick = () => {
  address.value = localStorage.getItem('address') || '';
  phone.value = localStorage.getItem('phone') || '';
  displayModal(modal, closeButtons[0]);
};

if (checkoutBtn) checkoutBtn.onclick = () => {
  if (!address.value || address.value === 'null') { cartErr.textContent = 'Please fill in your delivery address'; return; }
  if (!phone.value || phone.value === 'null') { cartErr.textContent = 'Please fill in your phone number'; return; }
  if (totalPrice === 0) return;
  const req = new Request(`${localhost}/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-access-token': localStorage.token },
    body: JSON.stringify({ cartArray, address: address.value, phone: phone.value }),
  });
  fetch(req).then(resp => resp.json().then((res) => {
    if (res.status !== 'success') { cartErr.textContent = res.message || res.error; return; }
    msg.textContent = '';
    const title = document.createElement('p');
    title.textContent = `${res.message}! Order #${res.order.userid}FFF${res.order.orderid}`;
    msg.appendChild(title);
    res.order.food.forEach((item) => {
      const line = document.createElement('p');
      line.textContent = `${item.quantity}x ${item.name}`;
      msg.appendChild(line);
    });
    const priceLine = document.createElement('p');
    priceLine.textContent = `Official order price: NGN ${res.order.price}.00`;
    msg.appendChild(priceLine);
    displayModal(generalModal, closeButtons[closeButtons.length - 1]);
    orders = [];
    cartArray = [];
    appliedCoupon = null;
    localStorage.removeItem(cartKey());
    renderCart();
  })).catch(error => { cartErr.textContent = error.message; });
};

document.addEventListener('menuLoaded', loadCart, { once: true });
