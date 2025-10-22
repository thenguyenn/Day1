function initData() {
    if (!localStorage.getItem('users')) {
        localStorage.setItem('users', JSON.stringify([
            { id: 1, name: 'Admin User', email: 'admin@example.com', password: '123456', role: 'Admin' },
            { id: 2, name: 'Normal User', email: 'user@example.com', password: '123456', role: 'User' }
        ]));
    }

    if (!localStorage.getItem('products')) {
        localStorage.setItem('products', JSON.stringify([
            {
                id: 1,
                name: 'iPhone 15 Pro Max',
                price: 29990000,
                description: 'Điện thoại cao cấp với chip A17 Pro',
                image: 'https://via.placeholder.com/300x200/667eea/fff?text=iPhone+15+Pro'
            },
            {
                id: 2,
                name: 'MacBook Air M3',
                price: 35990000,
                description: 'Laptop siêu mỏng nhẹ với chip M3',
                image: 'https://via.placeholder.com/300x200/764ba2/fff?text=MacBook+Air'
            },
            {
                id: 3,
                name: 'AirPods Pro 2',
                price: 6990000,
                description: 'Tai nghe không dây chống ồn',
                image: 'https://via.placeholder.com/300x200/f093fb/fff?text=AirPods+Pro'
            }
        ]));
    }
}

function checkLoginStatus() {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const user = JSON.parse(localStorage.getItem('currentUser'));

    if (isLoggedIn && user) {
        window.location.href = user.role === 'Admin' 
    ? '../Admin/Admin.html' 
    : '../Home/Home.html';

    }
}

function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();
    const errorMsg = document.getElementById('errorMsg');

    if (!email || !password) {
        errorMsg.textContent = '❌ Vui lòng nhập đầy đủ thông tin!';
        errorMsg.classList.remove('d-none');
        return;
    }

    if (password.length < 6) {
        errorMsg.textContent = '❌ Mật khẩu phải có ít nhất 6 ký tự!';
        errorMsg.classList.remove('d-none');
        return;
    }

    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('currentUser', JSON.stringify(user));
        window.location.href = user.role === 'Admin' ? '../Admin/Admin.html' : '../Home/Home.html';
    } else {
        errorMsg.textContent = '❌ Email hoặc mật khẩu không đúng!';
        errorMsg.classList.remove('d-none');
        setTimeout(() => errorMsg.classList.add('d-none'), 3000);
    }
}

function hideError() {
    document.getElementById('errorMsg').classList.add('d-none');
}

initData();
checkLoginStatus();

document.getElementById('loginForm').addEventListener('submit', handleLogin);
document.getElementById('email').addEventListener('input', hideError);
document.getElementById('password').addEventListener('input', hideError);