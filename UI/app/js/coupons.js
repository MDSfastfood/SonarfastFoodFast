const couponStorageKey = 'fastfoodfast.coupons.v1';
const couponForm = document.getElementById('couponForm');
const couponCodeAdmin = document.getElementById('couponCodeAdmin');
const couponType = document.getElementById('couponType');
const couponValue = document.getElementById('couponValue');
const couponAdminMsg = document.getElementById('couponAdminMsg');
const couponsTableBody = document.getElementById('couponsTableBody');
const getCoupons = document.getElementById('getCoupons');
const allCoupons = document.getElementById('allCoupons');

function readCoupons() {
  try {
    const stored = JSON.parse(localStorage.getItem(couponStorageKey));
    return stored && Array.isArray(stored.coupons) ? stored.coupons : [];
  } catch (error) {
    return [];
  }
}

function saveCoupons(items) {
  localStorage.setItem(couponStorageKey, JSON.stringify({ version: 1, coupons: items }));
}

function renderCoupons() {
  couponsTableBody.innerHTML = '';
  readCoupons().forEach((coupon) => {
    const row = document.createElement('tr');
    const code = document.createElement('td');
    const type = document.createElement('td');
    const value = document.createElement('td');
    const action = document.createElement('td');
    const remove = document.createElement('button');
    code.textContent = coupon.code;
    type.textContent = coupon.discountType === 'percentage' ? 'Percentage' : 'Fixed amount';
    value.textContent = coupon.discountValue;
    remove.textContent = 'Remove';
    remove.type = 'button';
    remove.onclick = () => {
      saveCoupons(readCoupons().filter(item => item.id !== coupon.id));
      renderCoupons();
    };
    action.appendChild(remove);
    [code, type, value, action].forEach(cell => row.appendChild(cell));
    couponsTableBody.appendChild(row);
  });
}

couponForm.onsubmit = (event) => {
  event.preventDefault();
  const code = couponCodeAdmin.value.trim().toUpperCase();
  const value = Number(couponValue.value);
  const existing = readCoupons();
  if (!code || !Number.isFinite(value) || value <= 0 || (couponType.value === 'percentage' && value > 100)) {
    couponAdminMsg.textContent = 'Enter a valid coupon';
    return;
  }
  if (existing.some(coupon => coupon.code === code)) {
    couponAdminMsg.textContent = 'Coupon code already exists';
    return;
  }
  existing.push({ id: `${Date.now()}-${code}`, code, discountType: couponType.value, discountValue: value });
  saveCoupons(existing);
  couponForm.reset();
  couponAdminMsg.textContent = 'Coupon added';
  renderCoupons();
};

getCoupons.onclick = () => {
  document.getElementById('mySidenav').style.width = '0';
  document.getElementById('main').style.marginLeft = '0';
  document.getElementById('allStats').style.display = 'none';
  document.getElementById('allOrders').style.display = 'none';
  document.getElementById('allFood').style.display = 'none';
  allCoupons.style.display = 'block';
  renderCoupons();
};

renderCoupons();
