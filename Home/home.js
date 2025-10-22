if (localStorage.getItem("isLoggedIn") !== "true") {
  window.location.href = '../Login/login.html';
}

const currentUser = JSON.parse(localStorage.getItem('currentUser'));
document.getElementById('userName').textContent = currentUser.name;

function logout() {
  if (confirm('Đăng xuất?')) {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("currentUser");
    window.location.href = '../Login/login.html';
  }
}

function formatPrice(price) {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
}

let cart = JSON.parse(localStorage.getItem("cart")) || [];

function loadProducts() {
  const products = JSON.parse(localStorage.getItem('products')) || [];
  const container = document.getElementById('productsContainer');

  if (products.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <div style="font-size: 60px;">📦</div>
        <h5>Chưa có sản phẩm</h5>
        <p>Hiện tại chưa có sản phẩm nào trong hệ thống</p>
      </div>
    `;
    return;
  }

  container.innerHTML = `
    <div class="product-grid">
      ${products.map(p => `
        <div class="product-card">
          <img src="${p.image}" class="product-img" alt="${p.name}" onclick='openModal(${JSON.stringify(p)})'
            onerror="this.src='https://tse2.mm.bing.net/th/id/OIP.QJYIxFXDqJt-p4tQYsrWfQHaEK?pid=Api&P=0&h=180'">
          <div class="product-body">
            <div class="product-name">${p.name}</div>
            <div class="product-desc">${p.description}</div>
            <div class="product-price">${formatPrice(p.price)}</div>
            <button class="btn btn-sm btn-primary mt-2" onclick='addToCart(${JSON.stringify(p)})'>Thêm vào giỏ</button>
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

// Mở modal chi tiết sản phẩm
function openModal(product) {
  document.getElementById('modalImg').src = product.image;
  document.getElementById('modalTitle').textContent = product.name;
  document.getElementById('modalPrice').textContent = formatPrice(product.price);
  document.getElementById('modalDesc').textContent = product.description;
  new bootstrap.Modal(document.getElementById('productModal')).show();
}

// Thêm sản phẩm vào giỏ
function addToCart(product) {
  const existing = cart.find(item => item.id === product.id);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }
  localStorage.setItem("cart", JSON.stringify(cart));
  renderCart();
}

// Xóa sản phẩm khỏi giỏ
function removeFromCart(id) {
  const index = cart.findIndex(item => item.id === id);
  if (index !== -1) {
    if (cart[index].quantity > 1) {
      cart[index].quantity -= 1;
    } else {
      cart.splice(index, 1);
    }
    localStorage.setItem("cart", JSON.stringify(cart));
    renderCart();
  }
}


function renderCart() {
  const cartList = document.getElementById("cartList");
  const totalEl = document.getElementById("cartTotal");
  cartList.innerHTML = "";
  let total = 0;

  if (cart.length === 0) {
    cartList.innerHTML = "<p>Giỏ hàng trống.</p>";
    totalEl.textContent = formatPrice(0);
    return;
  }

  cart.forEach(item => {
    const li = document.createElement("li");
    li.className = "d-flex justify-content-between align-items-center";

    li.innerHTML = `
      <div>
        <strong>${item.name}</strong>
        <div class="text-muted" style="font-size: 13px;">${formatPrice(item.price)}</div>
      </div>
      <div class="d-flex align-items-center gap-2">
        <button class="btn btn-sm btn-outline-secondary" onclick="decreaseQuantity(${item.id})">-</button>
        <span>${item.quantity}</span>
        <button class="btn btn-sm btn-outline-secondary" onclick="increaseQuantity(${item.id})">+</button>
        <button class="btn btn-sm btn-danger" onclick="removeItem(${item.id})">🗑</button>
      </div>
    `;

    cartList.appendChild(li);
    total += item.price * item.quantity;
  });

  totalEl.textContent = formatPrice(total);
}


function checkout() {
  if (cart.length === 0) {
    alert("Giỏ hàng trống!");
    return;
  }

  if (confirm("Bạn có chắc muốn thanh toán không?")) {
    alert("Thanh toán thành công!");
    cart = [];
    localStorage.setItem("cart", JSON.stringify(cart));
    renderCart();
  }
}

function increaseQuantity(id) {
  const item = cart.find(i => i.id === id);
  if (item) {
    item.quantity += 1;
    localStorage.setItem("cart", JSON.stringify(cart));
    renderCart();
  }
}

function decreaseQuantity(id) {
  const item = cart.find(i => i.id === id);
  if (item) {
    if (item.quantity > 1) {
      item.quantity -= 1;
    } else {
      if (confirm("Xóa sản phẩm này khỏi giỏ hàng?")) {
        cart = cart.filter(i => i.id !== id);
      }
    }
    localStorage.setItem("cart", JSON.stringify(cart));
    renderCart();
  }
}

function removeItem(id) {
  if (confirm("Xóa sản phẩm này khỏi giỏ hàng?")) {
    cart = cart.filter(i => i.id !== id);
    localStorage.setItem("cart", JSON.stringify(cart));
    renderCart();
  }
}

loadProducts();
renderCart();