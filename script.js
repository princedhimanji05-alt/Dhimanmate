// Local Image Paths (User uploaded exact photos)
const IMAGES = {
    redBricks: "images/red-bricks.png",
    riverSand: "images/river-sand.png",
    ultratechCement: "images/ultratech-cement.png",
    ambujaCement: "images/ultratech-cement.png",
    heroBanner: "images/red-bricks.png"
};

// Updated Products List
const productsData = [
    {
        id: 1,
        name: "Red Bricks",
        category: "Bricks",
        price: 8,
        unit: "/ piece",
        defaultQty: 100,
        image: IMAGES.redBricks
    },
    {
        id: 3,
        name: "Ultratech Cement (43 Grade)",
        category: "Cement",
        price: 360,
        unit: "/ bag",
        defaultQty: 1,
        image: IMAGES.ultratechCement
    },
    {
        id: 4,
        name: "Ambuja Cement (53 Grade)",
        category: "Cement",
        price: 380,
        unit: "/ bag",
        defaultQty: 1,
        image: IMAGES.ambujaCement
    },
    {
        id: 5,
        name: "River Sand",
        category: "Sand",
        price: 1200,
        unit: "/ quintal",
        defaultQty: 1,
        image: IMAGES.riverSand
    }
];

// State
let quantities = {};
let cart = [];
let currentCategory = "All";

// Initialize page
document.addEventListener("DOMContentLoaded", () => {
    // Set default quantities
    productsData.forEach(p => {
        quantities[p.id] = p.defaultQty;
    });

    renderProducts();
    updateCartUI();
});

// Render Popular Products Grid
function renderProducts() {
    const grid = document.getElementById("productGrid");
    if (!grid) return;

    const filtered = currentCategory === "All" 
        ? productsData 
        : productsData.filter(p => p.category === currentCategory);

    grid.innerHTML = filtered.map(p => `
        <div class="product-card bg-white rounded-3xl p-5 border border-gray-200/90 shadow-sm flex flex-col justify-between">
            <div>
                <!-- Product Image -->
                <div class="h-48 w-full rounded-2xl overflow-hidden mb-4 bg-gray-50 flex items-center justify-center relative border border-gray-100">
                    <img src="${p.image}" alt="${p.name}" class="w-full h-full object-cover">
                </div>

                <!-- Title & Category -->
                <h3 class="text-base font-extrabold text-brand-navy mb-0.5">${p.name}</h3>
                <p class="text-xs text-gray-400 font-medium mb-3">${p.category}</p>

                <!-- Price -->
                <div class="flex items-baseline gap-1 mb-4">
                    <span class="text-lg font-extrabold text-brand-navy">₹ ${p.price.toLocaleString("en-IN")}</span>
                    <span class="text-xs text-gray-500 font-medium">${p.unit}</span>
                </div>
            </div>

            <!-- Quantity & Add to Cart -->
            <div class="space-y-3">
                <!-- Quantity Stepper -->
                <div class="flex items-center justify-between bg-gray-100/80 rounded-xl p-1.5 border border-gray-200">
                    <button onclick="changeQty(${p.id}, -1)" class="qty-btn w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center text-gray-600 hover:bg-gray-50 text-xs font-bold">
                        <i class="fa-solid fa-minus"></i>
                    </button>
                    <input type="number" id="qty-input-${p.id}" value="${quantities[p.id]}" onchange="setQtyDirect(${p.id}, this.value)" class="w-16 text-center bg-transparent text-xs font-bold text-brand-navy focus:outline-none">
                    <button onclick="changeQty(${p.id}, 1)" class="qty-btn w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center text-gray-600 hover:bg-gray-50 text-xs font-bold">
                        <i class="fa-solid fa-plus"></i>
                    </button>
                </div>

                <!-- Add to Cart Button -->
                <button onclick="addToCart(${p.id})" class="w-full bg-brand-navy hover:bg-brand-darkNavy text-white font-bold py-2.5 px-4 rounded-xl text-xs transition-all flex items-center justify-center gap-2 shadow-sm">
                    <i class="fa-solid fa-cart-shopping text-xs"></i> Add to Cart
                </button>
            </div>
        </div>
    `).join("");
}

// Change Quantity
function changeQty(productId, delta) {
    const product = productsData.find(p => p.id === productId);
    const step = product.category === "Bricks" ? 10 : 1;
    quantities[productId] = Math.max(1, (quantities[productId] || product.defaultQty) + (delta * step));
    
    const input = document.getElementById(`qty-input-${productId}`);
    if (input) input.value = quantities[productId];
}

function setQtyDirect(productId, val) {
    const num = parseInt(val) || 1;
    quantities[productId] = Math.max(1, num);
}

// Category Filter
function filterCategory(category) {
    currentCategory = category;
    
    // Update active filter button styles
    document.querySelectorAll(".category-btn").forEach(btn => {
        btn.classList.remove("bg-brand-navy", "text-white");
        btn.classList.add("bg-white", "text-gray-700");
    });
    
    const activeBtn = document.getElementById(`btn-${category}`);
    if (activeBtn) {
        activeBtn.classList.remove("bg-white", "text-gray-700");
        activeBtn.classList.add("bg-brand-navy", "text-white");
    }

    renderProducts();

    // Scroll smoothly to products section if clicked from categories
    const section = document.getElementById("products");
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
    }
}

// Add to Cart Logic
function addToCart(productId) {
    const product = productsData.find(p => p.id === productId);
    const qty = quantities[productId] || product.defaultQty;

    const existingIndex = cart.findIndex(item => item.id === productId);
    if (existingIndex > -1) {
        cart[existingIndex].qty += qty;
    } else {
        cart.push({ ...product, qty });
    }

    updateCartUI();
    showToast(`Added ${qty} x ${product.name} to cart!`);
}

// Update Cart UI & Subtotal
function updateCartUI() {
    const badge = document.getElementById("cartBadge");
    const list = document.getElementById("cartItemsList");
    const subtotalEl = document.getElementById("cartSubtotal");

    const totalCount = cart.reduce((sum, item) => sum + item.qty, 0);
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);

    if (badge) badge.innerText = totalCount;
    if (subtotalEl) subtotalEl.innerText = `₹ ${subtotal.toLocaleString("en-IN")}`;

    if (list) {
        if (cart.length === 0) {
            list.innerHTML = `
                <div class="text-center py-12 text-gray-400 space-y-3">
                    <i class="fa-solid fa-basket-shopping text-4xl text-gray-300"></i>
                    <p class="text-sm font-medium">Your cart is currently empty</p>
                </div>
            `;
        } else {
            list.innerHTML = cart.map(item => `
                <div class="flex items-center gap-4 bg-gray-50 p-3 rounded-2xl border border-gray-100">
                    <img src="${item.image}" alt="${item.name}" class="w-14 h-14 rounded-xl object-cover">
                    <div class="flex-1">
                        <h4 class="font-extrabold text-xs text-brand-navy">${item.name}</h4>
                        <p class="text-[11px] text-gray-500">₹ ${item.price} ${item.unit} × ${item.qty}</p>
                        <p class="text-xs font-bold text-orange-500">₹ ${(item.price * item.qty).toLocaleString("en-IN")}</p>
                    </div>
                    <button onclick="removeFromCart(${item.id})" class="text-red-400 hover:text-red-600 p-2 text-xs">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </div>
            `).join("");
        }
    }
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartUI();
    showToast("Item removed from cart");
}

// Toggle Slide-out Cart Drawer
function toggleCartDrawer() {
    const drawer = document.getElementById("cartDrawer");
    const backdrop = document.getElementById("cartDrawerBackdrop");
    
    if (drawer && backdrop) {
        const isOpen = !drawer.classList.contains("translate-x-full");
        if (isOpen) {
            drawer.classList.add("translate-x-full");
            backdrop.classList.add("opacity-0", "pointer-events-none");
        } else {
            drawer.classList.remove("translate-x-full");
            backdrop.classList.remove("opacity-0", "pointer-events-none");
        }
    }
}

// Modals Handler
function openBulkQuoteModal() {
    const modal = document.getElementById("bulkQuoteModal");
    if (modal) modal.classList.add("modal-active");
}

function closeBulkQuoteModal() {
    const modal = document.getElementById("bulkQuoteModal");
    if (modal) modal.classList.remove("modal-active");
}

function openLoginModal() {
    const modal = document.getElementById("loginModal");
    if (modal) modal.classList.add("modal-active");
}

function closeLoginModal() {
    const modal = document.getElementById("loginModal");
    if (modal) modal.classList.remove("modal-active");
}

function openTrackOrderModal() {
    const modal = document.getElementById("trackOrderModal");
    if (modal) modal.classList.add("modal-active");
}

function closeTrackOrderModal() {
    const modal = document.getElementById("trackOrderModal");
    if (modal) modal.classList.remove("modal-active");
}

function toggleMobileMenu() {
    const menu = document.getElementById("mobileMenu");
    if (menu) menu.classList.toggle("hidden");
}

function toggleSearchModal() {
    showToast("Search active: Type Red Bricks, Cement or Sand above");
}

// Form Handlers
function handleBulkQuoteSubmit(e) {
    e.preventDefault();
    closeBulkQuoteModal();
    showToast("Quote Request Received! Our team will contact you shortly on 7060606266.");
}

function handleAuthSubmit(e) {
    e.preventDefault();
    closeLoginModal();
    showToast("Successfully logged in to DhimanMate!");
}

function handleTrackSubmit(e) {
    e.preventDefault();
    closeTrackOrderModal();
    showToast("Order DM-98231: Truck dispatched! En route to site.");
}

function handleNewsletter(e) {
    e.preventDefault();
    showToast("Thank you for subscribing to DhimanMate updates!");
}

function proceedToCheckout() {
    if (cart.length === 0) {
        showToast("Please add items to your cart first!");
        return;
    }
    toggleCartDrawer();
    openBulkQuoteModal();
    showToast("Finalizing order details & delivery site location...");
}

// Toast Notification
function showToast(message) {
    const container = document.getElementById("toastContainer");
    if (!container) return;

    const toast = document.createElement("div");
    toast.className = "toast pointer-events-auto bg-brand-navy text-white px-4 py-3 rounded-2xl shadow-xl flex items-center gap-3 text-xs font-bold border border-gray-700";
    toast.innerHTML = `
        <i class="fa-solid fa-circle-check text-green-400 text-sm"></i>
        <span>${message}</span>
    `;

    container.appendChild(toast);

    setTimeout(() => {
        toast.classList.add("hiding");
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}
