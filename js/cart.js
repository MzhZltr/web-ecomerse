// File: js/cart.js
// Shopping Cart Functionality

class ShoppingCart {
    constructor() {
        this.items = this.loadFromStorage();
        this.updateCartCount();
    }

    loadFromStorage() {
        const saved = localStorage.getItem('shoppingCart');
        return saved ? JSON.parse(saved) : [];
    }

    saveToStorage() {
        localStorage.setItem('shoppingCart', JSON.stringify(this.items));
    }

    addItem(nama, harga, image = 'https://picsum.photos/id/20/60/60') {
        const existingItem = this.items.find(item => item.nama === nama);
        
        if (existingItem) {
            existingItem.quantity++;
        } else {
            this.items.push({
                id: Date.now(),
                nama: nama,
                harga: harga,
                quantity: 1,
                image: image
            });
        }
        
        this.saveToStorage();
        this.updateCartCount();
        this.showNotification(`${nama} ditambahkan ke keranjang!`);
        return true;
    }

    removeItem(id) {
        this.items = this.items.filter(item => item.id !== id);
        this.saveToStorage();
        this.updateCartCount();
        this.renderCart();
    }

    updateQuantity(id, newQuantity) {
        const item = this.items.find(item => item.id === id);
        if (item) {
            if (newQuantity <= 0) {
                this.removeItem(id);
            } else {
                item.quantity = newQuantity;
                this.saveToStorage();
                this.updateCartCount();
                this.renderCart();
            }
        }
    }

    getTotal() {
        return this.items.reduce((total, item) => total + (item.harga * item.quantity), 0);
    }

    updateCartCount() {
        const count = this.items.reduce((total, item) => total + item.quantity, 0);
        const cartCountElement = document.getElementById('cartCount');
        if (cartCountElement) {
            cartCountElement.textContent = count;
        }
    }

    showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.innerHTML = `
            <div class="notification-content">
                <span>✅ ${message}</span>
            </div>
        `;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    renderCart() {
        const cartItemsContainer = document.getElementById('cartItems');
        const cartTotalElement = document.getElementById('cartTotal');
        
        if (!cartItemsContainer) return;
        
        if (this.items.length === 0) {
            cartItemsContainer.innerHTML = '<p style="text-align: center;">Keranjang belanja kosong</p>';
            if (cartTotalElement) cartTotalElement.textContent = 'Rp0';
            return;
        }
        
        cartItemsContainer.innerHTML = this.items.map(item => `
            <div class="cart-item" data-id="${item.id}">
                <img src="${item.image}" alt="${item.nama}">
                <div class="cart-item-details">
                    <div class="cart-item-title">${item.nama}</div>
                    <div class="cart-item-price">Rp${item.harga.toLocaleString('id-ID')}</div>
                    <div class="cart-item-quantity">
                        <button class="quantity-btn" data-action="decrease">-</button>
                        <span>${item.quantity}</span>
                        <button class="quantity-btn" data-action="increase">+</button>
                        <button class="remove-item" data-action="remove">🗑️</button>
                    </div>
                </div>
            </div>
        `).join('');
        
        if (cartTotalElement) {
            cartTotalElement.textContent = `Rp${this.getTotal().toLocaleString('id-ID')}`;
        }
        
        document.querySelectorAll('.quantity-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const cartItem = btn.closest('.cart-item');
                const id = parseInt(cartItem.dataset.id);
                const action = btn.dataset.action;
                const item = this.items.find(i => i.id === id);
                
                if (action === 'increase') {
                    this.updateQuantity(id, item.quantity + 1);
                } else if (action === 'decrease') {
                    this.updateQuantity(id, item.quantity - 1);
                }
            });
        });
        
        document.querySelectorAll('.remove-item').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const cartItem = btn.closest('.cart-item');
                const id = parseInt(cartItem.dataset.id);
                this.removeItem(id);
            });
        });
    }
}

const cart = new ShoppingCart();

function openCart() {
    const sidebar = document.getElementById('cartSidebar');
    const overlay = document.getElementById('cartOverlay');
    if (sidebar) sidebar.classList.add('open');
    if (overlay) overlay.classList.add('show');
    cart.renderCart();
}

function closeCart() {
    const sidebar = document.getElementById('cartSidebar');
    const overlay = document.getElementById('cartOverlay');
    if (sidebar) sidebar.classList.remove('open');
    if (overlay) overlay.classList.remove('show');
}

document.querySelectorAll('.tombol-beli').forEach(btn => {
    btn.addEventListener('click', (e) => {
        const nama = btn.dataset.nama;
        const harga = parseInt(btn.dataset.harga);
        cart.addItem(nama, harga);
    });
});

const cartIcon = document.getElementById('cartIcon');
if (cartIcon) {
    cartIcon.addEventListener('click', openCart);
}

function checkout() {
    if (cart.items.length === 0) {
        alert('Keranjang belanja masih kosong!');
        return;
    }
    
    const total = cart.getTotal();
    const message = `Terima kasih telah berbelanja!\nTotal belanja: Rp${total.toLocaleString('id-ID')}\n\nPesanan Anda akan segera diproses.`;
    alert(message);
    
    cart.items = [];
    cart.saveToStorage();
    cart.updateCartCount();
    cart.renderCart();
    closeCart();
}