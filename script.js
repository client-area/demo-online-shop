// DATABASE PRODUK
const PRODUCTS_DATA = [
    { id: 1, name: "Minimalist Black Tee", category: "baju", price: 299000, img: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=500" },
    { id: 2, name: "Premium Denim Jeans", category: "celana", price: 549000, img: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=500" },
    { id: 3, name: "Classic Carry Tote", category: "aksesoris", price: 189000, img: "https://images.unsplash.com/photo-1544816155-12df9643f363?w=500" },
    { id: 4, name: "Relaxed Linen Shirt", category: "baju", price: 449000, img: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=500" },
    { id: 5, name: "Modern Cargo Navy", category: "celana", price: 499000, img: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=500" },
    { id: 6, name: "Silver Chrono Watch", category: "aksesoris", price: 2500000, img: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500" },
    { id: 7, name: "Premium Leather Belt", category: "aksesoris", price: 250000, img: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500" },
    { id: 8, name: "White Summer Dress", category: "baju", price: 650000, img: "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?w=500" },
];

let cart = [];

// INITIALIZE
document.addEventListener("DOMContentLoaded", () => {
    renderProducts('all');
    setupFilters();
    initScrollNavbar();
});

// NAVBAR SCROLL EFFECT
function initScrollNavbar() {
    window.addEventListener('scroll', () => {
        const nav = document.getElementById('navbar');
        if (window.scrollY > 50) nav.classList.add('scrolled');
        else nav.classList.remove('scrolled');
    });
}

// RENDER PRODUCTS
function renderProducts(filter) {
    const grid = document.getElementById("productGrid");
    grid.innerHTML = "";

    const items = filter === 'all' ? PRODUCTS_DATA : PRODUCTS_DATA.filter(p => p.category === filter);

    items.forEach(p => {
        grid.innerHTML += `
            <div class="p-card">
                <div class="p-image-box">
                    <img src="${p.img}" alt="${p.name}">
                    <button class="p-add-overlay" onclick="addToCart(${p.id})">TAMBAH KE TAS</button>
                </div>
                <div class="p-info">
                    <h4>${p.name}</h4>
                    <span>Rp ${p.price.toLocaleString()}</span>
                </div>
            </div>
        `;
    });
}

// SETUP FILTERS
function setupFilters() {
    const tabs = document.querySelectorAll(".filter-tab");
    tabs.forEach(tab => {
        tab.onclick = () => {
            tabs.forEach(t => t.classList.remove("active"));
            tab.classList.add("active");
            renderProducts(tab.getAttribute("data-filter"));
        };
    });
}

// CART TOGGLE
function toggleCart(isOpen) {
    const sidebar = document.getElementById("cartSidebar");
    const overlay = document.getElementById("cartOverlay");
    if(isOpen) {
        sidebar.classList.add("open");
        overlay.classList.add("show");
        document.body.style.overflow = "hidden";
    } else {
        sidebar.classList.remove("open");
        overlay.classList.remove("show");
        document.body.style.overflow = "auto";
    }
}

// ADD TO CART LOGIC
function addToCart(id) {
    const product = PRODUCTS_DATA.find(p => p.id === id);
    const existing = cart.find(item => item.id === id);

    if (existing) {
        existing.qty++;
    } else {
        cart.push({ ...product, qty: 1 });
    }

    updateCartUI();
    toggleCart(true);
}

// UPDATE CART UI
function updateCartUI() {
    const badge = document.getElementById("cart-badge");
    const container = document.getElementById("cartContent");
    const totalDisplay = document.getElementById("cartTotalDisplay");

    badge.innerText = cart.reduce((total, item) => total + item.qty, 0);
    container.innerHTML = "";
    
    let subtotal = 0;

    cart.forEach((item, index) => {
        subtotal += item.price * item.qty;
        container.innerHTML += `
            <div class="cart-item">
                <img src="${item.img}" alt="">
                <div class="cart-item-info">
                    <h6>${item.name}</h6>
                    <p>Rp ${item.price.toLocaleString()}</p>
                    <div class="qty-control">
                        <button onclick="changeQty(${index}, -1)">-</button>
                        <span>${item.qty}</span>
                        <button onclick="changeQty(${index}, 1)">+</button>
                    </div>
                </div>
                <i class="fa-solid fa-trash-can remove-btn" onclick="removeItem(${index})"></i>
            </div>
        `;
    });

    // --- BAGIAN YANG DIPERBAIKI AGAR TIDAK BLANK ---
    if(cart.length === 0) {
        container.innerHTML = `
            <div class="empty-cart-msg">
                <i class="fa-solid fa-bag-shopping"></i>
                <p>KERANJANG ANDA KOSONG</p>
            </div>
        `;
    }

    totalDisplay.innerText = `Rp ${subtotal.toLocaleString()}`;
}

function changeQty(index, delta) {
    if (cart[index].qty + delta > 0) {
        cart[index].qty += delta;
    } else {
        cart.splice(index, 1);
    }
    updateCartUI();
}

function removeItem(index) {
    cart.splice(index, 1);
    updateCartUI();
}

// CHECKOUT WHATSAPP
function checkoutWhatsApp() {
    if(cart.length === 0) return alert("Pilih barang favoritmu dulu!");

    const adminNum = "6281234567890"; // GANTI NOMOR WA DISINI
    let message = "*ORDER BARU - VOGUE LUXURY STORE*\n----------------------------------\n";
    let total = 0;

    cart.forEach((item, i) => {
        const itemTotal = item.price * item.qty;
        message += `${i+1}. ${item.name} (${item.qty}x)\n   Total: Rp ${itemTotal.toLocaleString()}\n\n`;
        total += itemTotal;
    });

    message += `----------------------------------\n*ESTIMASI TOTAL: Rp ${total.toLocaleString()}*`;
    message += `\n\n_Mohon konfirmasi ketersediaan barang ya admin!_`;

    window.open(`https://wa.me/${adminNum}?text=${encodeURIComponent(message)}`, '_blank');
}

// SIMPLE MOBILE MENU
function toggleMobileMenu() {
    const navLinks = document.getElementById("navLinks");
    navLinks.classList.toggle("active");
}
