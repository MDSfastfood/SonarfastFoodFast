// CONSUME LOGIN ENDPOINT
const loginBtn = document.getElementById('loginBtn');
const userField = document.getElementById('usernameEmail');
const passwordField = document.getElementById('password');

const usernameErr = document.querySelector('div#usernameErr');
const emailErr = document.querySelector('div#emailErr');
const passwordErr = document.querySelector('div#passwordErr');
const password2Err = document.querySelector('div#password2Err');

loginBtn.onmouseover = () => {
  if (!userField.value || !passwordField.value || emailErr.innerHTML !== '' || passwordErr.innerHTML !== '' || password2Err.innerHTML !== '') {
    loginBtn.style.opacity = 0.6;
  } else {
    loginBtn.style.opacity = 1;
  }
};

const localhost = 'http://localhost:9999/api/v1';
// UNCOMMENT BELOW AND USE IN REQ FOR PRODUCTION
// const herokuhost = 'https://fast-food-fast-bobsar0.herokuapp.com/api/v1/';

loginBtn.onclick = () => {
  const usernameEmail = userField.value;
  const password = passwordField.value;

  if (!usernameEmail.trim() || !password.trim()) {
    password2Err.innerHTML = 'Please fill in all fields';
    return;
  }
  password2Err.innerHTML = '';
  if (emailErr.innerHTML !== '' || passwordErr.innerHTML !== '' || password2Err.innerHTML !== '') {
    usernameErr.innerHTML = 'Please correct the errors in red below';
  } else {
    usernameErr.innerHTML = '';
    // const usernameEmail = document.getElementById('usernamEmail').value;
    const req = new Request(`${localhost}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ usernameEmail, password }),
    });
    fetch(req).then(resp => resp.json().then((res) => {
      if (res.status === 'fail') {
        password2Err.innerHTML = res.message;
      }
      if (res.status === 'success' && res.token) {
        localStorage.setItem('token', res.token);
        localStorage.setItem('username', res.user.username);
        localStorage.setItem('address', res.user.address);
        localStorage.setItem('phone', res.user.phone);
        localStorage.setItem('email', res.user.email);
        localStorage.setItem('id', res.user.userid);
        const anonymousCart = localStorage.getItem('fastfoodfast.cart.v1.anonymous');
        const userCartKey = `fastfoodfast.cart.v1.${res.user.userid}`;
        let mergeFailed = false;
        if (anonymousCart) {
          try {
            const guest = JSON.parse(anonymousCart);
            const currentText = localStorage.getItem(userCartKey);
            const current = currentText ? JSON.parse(currentText) : { version: 2, items: [] };
            if (!Array.isArray(guest.items) || !Array.isArray(current.items)) throw new Error('Invalid cart');
            const normalizeId = (item) => {
              if (!item || item.productId === undefined || item.productId === null) return null;
              const productId = String(item.productId).trim();
              if (!/^\d+$/.test(productId) || Number(productId) <= 0) return null;
              return String(Number(productId));
            };
            const items = current.items.map(item => ({ productId: normalizeId(item), quantity: item.quantity }))
              .filter(item => item.productId && Number.isInteger(item.quantity) && item.quantity > 0);
            guest.items.map(item => ({ productId: normalizeId(item), quantity: item.quantity }))
              .filter(item => item.productId && Number.isInteger(item.quantity) && item.quantity > 0)
              .forEach((guestItem) => {
                const item = items.find(existing => existing.productId === guestItem.productId);
                if (item) item.quantity += guestItem.quantity;
                else items.push(guestItem);
            });
            localStorage.setItem(userCartKey, JSON.stringify({ version: 2, items }));
            localStorage.removeItem('fastfoodfast.cart.v1.anonymous');
          } catch (error) {
            mergeFailed = true;
          }
        }

        password2Err.textContent = mergeFailed
          ? `${res.message}. Login succeeded, but the cart could not be merged; your saved carts were preserved.`
          : `${res.message}...redirecting`;
        if (res.user.role === 'admin') {
          localStorage.setItem(res.user.username, 'an');
          setTimeout(() => {
            window.location.href = 'admin';
          }, 100);
          return;
        }
        setTimeout(() => {
          window.location.href = 'userMenu';
        }, 100);
      }
    }).catch((err) => {
      password2Err.innerHTML = err.message;
    }))
      .catch(((fetchErr) => {
        usernameErr.innerHTML = fetchErr;
      }));
  }
};
