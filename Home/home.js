if (localStorage.getItem("isLoggedIn") !== "true") {
            window.location.href = '../Login/login.html' ;
        }

        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        document.getElementById('userName').textContent = currentUser.name;

        function logout() {
            if (confirm('Đăng xuất?')) {
                localStorage.removeItem("isLoggedIn");
                localStorage.removeItem("currentUser");
                window.location.href = '../Login/login.html' ;
            }
        }

        function formatPrice(price) {
            return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
        }

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
                        <div class="product-card" onclick='openModal(${JSON.stringify(p)})'>
                            <img src="${p.image}" class="product-img" alt="${p.name}" onerror="this.src='https://tse2.mm.bing.net/th/id/OIP.QJYIxFXDqJt-p4tQYsrWfQHaEK?pid=Api&P=0&h=180'">
                            <div class="product-body">
                                <div class="product-name">${p.name}</div>
                                <div class="product-desc">${p.description}</div>
                                <div class="product-price">${formatPrice(p.price)}</div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            `;
        }

        function openModal(product) {
            document.getElementById('modalImg').src = product.image;
            document.getElementById('modalTitle').textContent = product.name;
            document.getElementById('modalPrice').textContent = formatPrice(product.price);
            document.getElementById('modalDesc').textContent = product.description;
            new bootstrap.Modal(document.getElementById('productModal')).show();
        }

        loadProducts();