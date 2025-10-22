if (localStorage.getItem("isLoggedIn") !== "true") {
  window.location.href = '../Login/login.html';
}

const currentUser = JSON.parse(localStorage.getItem('currentUser'));
if (!currentUser || currentUser.role !== 'Admin') {
  alert('Bạn không có quyền truy cập!');
  window.location.href = '../Login/login.html';
}

document.getElementById('userName').textContent = currentUser.name;

let users = JSON.parse(localStorage.getItem("users")) || [];
let products = JSON.parse(localStorage.getItem("products")) || [];

function switchTab(tab) {
  document.getElementById('usersTab').classList.toggle('active', tab === 'users');
  document.getElementById('productsTab').classList.toggle('active', tab === 'products');
  document.getElementById('usersSection').style.display = tab === 'users' ? 'block' : 'none';
  document.getElementById('productsSection').style.display = tab === 'products' ? 'block' : 'none';
}

function renderUsers() {
  const table = document.getElementById("userTable");
  table.innerHTML = users.map((user, index) => `
    <tr>
      <td>${user.id}</td>
      <td><input class="form-control form-control-sm" value="${user.name}" onchange="updateUser(${index}, 'name', this.value)"></td>
      <td><input class="form-control form-control-sm" value="${user.email}" onchange="updateUser(${index}, 'email', this.value)"></td>
      <td>
        <select class="form-select form-select-sm" onchange="updateUser(${index}, 'role', this.value)">
          <option value="Admin" ${user.role === "Admin" ? "selected" : ""}>Admin</option>
          <option value="User" ${user.role === "User" ? "selected" : ""}>User</option>
        </select>
      </td>
      <td>
        <button class="btn btn-danger btn-sm btn-action" onclick="deleteUser(${index})">Xóa</button>
      </td>
    </tr>
  `).join('');
}

document.getElementById('addUserForm').addEventListener('submit', function (e) {
  e.preventDefault();

  const name = document.getElementById("userFullName").value.trim();
  const email = document.getElementById("userEmail").value.trim();
  const password = document.getElementById("userPassword").value.trim();
  const role = document.getElementById("userRole").value;

  if (name && email && password) {
    const newId = users.length > 0
      ? Math.max(...users.map(u => typeof u.id === 'number' ? u.id : 0)) + 1
      : 1;

    users.push({ id: newId, name, email, password, role });
    localStorage.setItem("users", JSON.stringify(users));
    renderUsers();
    this.reset();
  } else {
    alert("Vui lòng nhập đầy đủ thông tin người dùng.");
  }
});

function updateUser(index, field, value) {
  users[index][field] = value;
  localStorage.setItem("users", JSON.stringify(users));
}

function deleteUser(index) {
  if (confirm("Xóa người dùng này?")) {
    users.splice(index, 1);
    localStorage.setItem("users", JSON.stringify(users));
    renderUsers();
  }
}

function renderProducts() {
  const table = document.getElementById("productTable");
  table.innerHTML = products.map((p, index) => `
    <tr>
      <td>${p.id}</td>
      <td><img src="${p.image}" class="product-img" onerror="this.src='https://tse2.mm.bing.net/th/id/OIP.QJYIxFXDqJt-p4tQYsrWfQHaEK?pid=Api&P=0&h=180'"></td>
      <td><input class="form-control form-control-sm" value="${p.name}" onchange="updateProduct(${index}, 'name', this.value)"></td>
      <td><input class="form-control form-control-sm" type="number" value="${p.price}" onchange="updateProduct(${index}, 'price', parseInt(this.value))"></td>
      <td><input class="form-control form-control-sm" value="${p.description}" onchange="updateProduct(${index}, 'description', this.value)"></td>
      <td>
        <button class="btn btn-danger btn-sm btn-action" onclick="deleteProduct(${index})">Xóa</button>
      </td>
    </tr>
  `).join('');
}

document.getElementById('addProductForm').addEventListener('submit', function (e) {
  e.preventDefault();

  const name = document.getElementById("productName").value.trim();
  const price = parseInt(document.getElementById("productPrice").value);
  const description = document.getElementById("productDescription").value.trim();
  const image = document.getElementById("productImage").value.trim();

  if (name && !isNaN(price) && description && image) {
    const newId = products.length > 0
      ? Math.max(...products.map(p => typeof p.id === 'number' ? p.id : 0)) + 1
      : 1;

    products.push({ id: newId, name, price, description, image });
    localStorage.setItem("products", JSON.stringify(products));
    renderProducts();
    this.reset();
  } else {
    alert("Vui lòng nhập đầy đủ và đúng định dạng thông tin sản phẩm.");
  }
});

function updateProduct(index, field, value) {
  products[index][field] = value;
  localStorage.setItem("products", JSON.stringify(products));
}

function deleteProduct(index) {
  if (confirm("Xóa sản phẩm này?")) {
    products.splice(index, 1);
    localStorage.setItem("products", JSON.stringify(products));
    renderProducts();
  }
}

function logout() {
  if (confirm('Đăng xuất?')) {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("currentUser");
    window.location.href = '../Login/login.html';
  }
}

renderUsers();
renderProducts();