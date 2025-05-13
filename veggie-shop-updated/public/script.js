let cart = {};
let user = {};

function login() {
  const name = document.getElementById('user-name').value;
  const phone = document.getElementById('user-phone').value;
  if (!name || !phone) {
    alert("Please enter your name and phone number.");
    return;
  }
  user.name = name;
  user.phone = phone;
  document.getElementById('login-section').style.display = 'none';
  document.getElementById('shop-section').style.display = 'block';
}

function addToCart(name, price) {
  cart[name] = (cart[name] || 0) + 1;
  updateCartDisplay();
}

function updateCartDisplay() {
  const count = Object.values(cart).reduce((a, b) => a + b, 0);
  document.getElementById('cart-count').textContent = count;
}

function openCart() {
  updateCartModal();
  document.getElementById('cart-modal').style.display = 'block';
}

function closeCart() {
  document.getElementById('cart-modal').style.display = 'none';
}

function updateCartModal() {
  const container = document.getElementById('cart-items');
  container.innerHTML = '';
  let total = 0;
  for (const item in cart) {
    const quantity = cart[item];
    const price = parseFloat(document.querySelector(`[data-name="${item}"]`).dataset.price);
    const itemTotal = quantity * price + quantity;
    total += itemTotal;

    const div = document.createElement('div');
    div.innerHTML = `
      ${item} - $${price} x ${quantity} + $${quantity} fee = $${itemTotal.toFixed(2)}
      <button onclick="changeQty('${item}', -1)">-</button>
      <button onclick="changeQty('${item}', 1)">+</button>
    `;
    container.appendChild(div);
  }
  document.getElementById('total').textContent = 'Approx Total: $' + total.toFixed(2);
}

function changeQty(item, delta) {
  cart[item] += delta;
  if (cart[item] <= 0) delete cart[item];
  updateCartDisplay();
  updateCartModal();
}

document.getElementById('checkout-btn').addEventListener('click', async () => {
  const address = prompt("Please enter your delivery address:");
  if (address && address.trim() !== "") {
    const itemCount = Object.values(cart).reduce((a, b) => a + b, 0);
    await fetch('/order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        address, 
        itemCount,
        name: user.name,
        phone: user.phone
      })
    });
    alert("Thank you for your purchase!\nA notification has been sent to the driver.");
    for (const item in cart) delete cart[item];
    updateCartDisplay();
    updateCartModal();
    closeCart();
  } else {
    alert("Checkout canceled. Delivery address is required.");
  }
});

document.getElementById('search-input').addEventListener('input', function () {
  const query = this.value.toLowerCase();
  document.querySelectorAll('.product').forEach(product => {
    const name = product.dataset.name.toLowerCase();
    product.style.display = name.includes(query) ? 'block' : 'none';
  });
});
