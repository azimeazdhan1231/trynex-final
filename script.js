// Global Variables
let currentSlide = 0;
let products = [];
let categories = [];
let cart = [];
let filteredProducts = [];
let displayedProducts = 6;

// Environment Variables (fallback to defaults)
const WHATSAPP_NUMBER = '01747292277';
const PAYMENT_NUMBER = '01747292277';

// DOM Elements
const searchOverlay = document.getElementById('search-overlay');
const searchInput = document.getElementById('search-input');
const cartModal = document.getElementById('cart-modal');
const checkoutModal = document.getElementById('checkout-modal');
const loadingOverlay = document.getElementById('loading-overlay');

// Initialize Application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
    startSlideshow();
});

// Initialize Application
async function initializeApp() {
    showLoading();
    try {
        await loadData();
        renderCategories();
        renderProducts();
        loadCartFromStorage();
        updateCartUI();
    } catch (error) {
        console.error('Failed to initialize app:', error);
        showErrorMessage('Failed to load application data');
    } finally {
        hideLoading();
    }
}

// Load Data
async function loadData() {
    try {
        // Load products
        const productResponse = await fetch('./products.json');
        if (productResponse.ok) {
            products = await productResponse.json();
        } else {
            // Fallback to static data if JSON files don't exist
            products = getStaticProducts();
        }

        // Load categories
        const categoryResponse = await fetch('./categories.json');
        if (categoryResponse.ok) {
            categories = await categoryResponse.json();
        } else {
            categories = getStaticCategories();
        }

        filteredProducts = [...products];
    } catch (error) {
        // Fallback to static data
        products = getStaticProducts();
        categories = getStaticCategories();
        filteredProducts = [...products];
    }
}

// Static Data Fallbacks
function getStaticProducts() {
    return [
        {
            id: 1,
            name: "Classic Ceramic Mug",
            name_bn: "ক্লাসিক সিরামিক মগ",
            price: 550,
            category: "Mugs",
            image: "https://pixabay.com/get/g875e9bed23cfd7372aedb93d937a7b847df753b50d255397f8190d05a5b16aab4fe3bf8e8df8d0c4e8ec4eb22975efb774dde2434dbe85e6bbd57f3c061421f9_1280.jpg",
            description: "Premium quality ceramic mug perfect for daily use",
            description_bn: "দৈনন্দিন ব্যবহারের জন্য উপযুক্ত প্রিমিয়াম মানের সিরামিক মগ"
        },
        {
            id: 2,
            name: "Designer Mug",
            name_bn: "ডিজাইনার মগ",
            price: 650,
            category: "Mugs",
            image: "https://pixabay.com/get/g8c1884756c0a400b9ca864a0aea88b66f736437917a8e53583df7e3296b5386fabd2655ac359f95af7551629743dac4a0b07325cfec252da4ab9ab34c5808aa6_1280.jpg",
            description: "Elegant designer mug with unique patterns",
            description_bn: "অনন্য প্যাটার্ন সহ মার্জিত ডিজাইনার মগ"
        },
        {
            id: 3,
            name: "Premium Ceramic Mug",
            name_bn: "প্রিমিয়াম সিরামিক মগ",
            price: 750,
            category: "Mugs",
            image: "https://pixabay.com/get/g16cebb01fde62e80dac623221c4708c94beb44105587bc38cac57c02f84f64bc143a87f025aed7cc10923250b617594336cca9d88ef071353989ad3f875e5ee3_1280.jpg",
            description: "High-quality premium ceramic mug for special occasions",
            description_bn: "বিশেষ অনুষ্ঠানের জন্য উচ্চ মানের প্রিমিয়াম সিরামিক মগ"
        },
        {
            id: 4,
            name: "Comfort T-Shirt",
            name_bn: "আরামদায়ক টি-শার্ট",
            price: 550,
            category: "T-Shirts",
            image: "https://pixabay.com/get/g5523718b6c0dbd5eaee1a4fe4dc63ea8daf223f3c76d2be78f925c5a74b78ebceae08303b0405b3090c3e84db866ccfc78fe6f987bf5446d8b8d34d73cd4c775_1280.jpg",
            description: "Comfortable cotton t-shirt for everyday wear",
            description_bn: "দৈনন্দিন পরিধানের জন্য আরামদায়ক কটন টি-শার্ট"
        },
        {
            id: 5,
            name: "Premium Graphic Tee",
            name_bn: "প্রিমিয়াম গ্রাফিক টি",
            price: 600,
            category: "T-Shirts",
            image: "https://pixabay.com/get/gc7007fa672e16be80787b0ccf0c6a9f2e5c1ccc4e4f8cb3ec4d943bcdc22308c5e6552e409f7bb06f9f5afe9bef3520c2d35cfb5a3bfa9b297f148663aa8ec4c_1280.jpg",
            description: "Stylish graphic t-shirt with modern design",
            description_bn: "আধুনিক ডিজাইন সহ স্টাইলিশ গ্রাফিক টি-শার্ট"
        },
        {
            id: 6,
            name: "Designer T-Shirt",
            name_bn: "ডিজাইনার টি-শার্ট",
            price: 700,
            category: "T-Shirts",
            image: "https://pixabay.com/get/g3306227bdba7814a5e499c42b02a86cbde00ec1d6ab909f254317ab599e02f135750597d1796bc03913f062a6fdb9380f74bfdf77d5f1dc6f4c845538d1f55b1_1280.jpg",
            description: "Premium designer t-shirt with unique style",
            description_bn: "অনন্য স্টাইল সহ প্রিমিয়াম ডিজাইনার টি-শার্ট"
        },
        {
            id: 7,
            name: "Elegant Keychain",
            name_bn: "মার্জিত চাবির চেইন",
            price: 400,
            category: "Keychains",
            image: "https://pixabay.com/get/g0e9f27af49df631d17e78f790a134902c26f9814b5f47ab1ac7506dde21a6bd013b00c94d39d6dd7c786e263e651a292ca368b6a6ef8e130ae4ef723b6981576_1280.jpg",
            description: "Stylish and durable keychain for daily use",
            description_bn: "দৈনন্দিন ব্যবহারের জন্য স্টাইলিশ এবং টেকসই চাবির চেইন"
        },
        {
            id: 8,
            name: "Custom Keychain",
            name_bn: "কাস্টম চাবির চেইন",
            price: 450,
            category: "Keychains",
            image: "https://pixabay.com/get/g318d9b5903eb4fd74aa0df92a9388eae4fe91e68d4b63affe6d3103cb2d627e9760bedbcde20ed4e344880a540d6e42758a5080eb73cce0054781762e2451bf4_1280.jpg",
            description: "Personalized keychain with custom design",
            description_bn: "কাস্টম ডিজাইন সহ ব্যক্তিগতকৃত চাবির চেইন"
        },
        {
            id: 9,
            name: "Eco-Friendly Bottle",
            name_bn: "পরিবেশ বান্ধব বোতল",
            price: 800,
            category: "Water Bottles",
            image: "https://pixabay.com/get/gc240144ade73cf5afeebc210152bb439eb30a2b1f9ad936a1e1a3140ee7d958ce18d991b5a548b69bb0d96d414a62df5b41e502e4df3d4e6ad91ffc1ed07b17e_1280.jpg",
            description: "Sustainable water bottle for eco-conscious users",
            description_bn: "পরিবেশ সচেতন ব্যবহারকারীদের জন্য টেকসই পানির বোতল"
        },
        {
            id: 10,
            name: "Insulated Bottle",
            name_bn: "ইনসুলেটেড বোতল",
            price: 900,
            category: "Water Bottles",
            image: "https://pixabay.com/get/ga1f958c7040a160265d41d460fb7cee9260b761665d24f4e1209a6a852fe48c650aa09550e5a3b4d228ef28a9941191dfac88e47a71570c4921e0ec0eb6566bb_1280.jpg",
            description: "Insulated water bottle keeps drinks hot or cold",
            description_bn: "ইনসুলেটেড পানির বোতল পানীয় গরম বা ঠান্ডা রাখে"
        },
        {
            id: 11,
            name: "Men's Leather Wallet",
            name_bn: "পুরুষদের চামড়ার মানিবাগ",
            price: 1200,
            category: "Gift for Him",
            image: "https://via.placeholder.com/300x300/d4af37/000000?text=Leather+Wallet",
            description: "Premium leather wallet perfect for men",
            description_bn: "পুরুষদের জন্য নিখুঁত প্রিমিয়াম চামড়ার মানিবাগ"
        },
        {
            id: 12,
            name: "Ladies' Pearl Necklace",
            name_bn: "মহিলাদের মুক্তার হার",
            price: 1500,
            category: "Gift for Her",
            image: "https://via.placeholder.com/300x300/d4af37/000000?text=Pearl+Necklace",
            description: "Elegant pearl necklace for special occasions",
            description_bn: "বিশেষ অনুষ্ঠানের জন্য মার্জিত মুক্তার হার"
        },
        {
            id: 13,
            name: "Family Photo Frame",
            name_bn: "পারিবারিক ছবির ফ্রেম",
            price: 1000,
            category: "Gift for Parents",
            image: "https://via.placeholder.com/300x300/d4af37/000000?text=Photo+Frame",
            description: "Beautiful photo frame for cherished memories",
            description_bn: "লালিত স্মৃতির জন্য সুন্দর ছবির ফ্রেম"
        },
        {
            id: 14,
            name: "Baby Rattle Set",
            name_bn: "শিশুর র‌্যাটল সেট",
            price: 700,
            category: "Gifts for Babies",
            image: "https://via.placeholder.com/300x300/d4af37/000000?text=Baby+Rattle",
            description: "Safe and colorful rattle set for babies",
            description_bn: "শিশুদের জন্য নিরাপদ এবং রঙিন র‌্যাটল সেট"
        },
        {
            id: 15,
            name: "Couple's Mug Set",
            name_bn: "দম্পতির মগ সেট",
            price: 1100,
            category: "For Couple",
            image: "https://pixabay.com/get/gb66ab674dd3dfe9feb02afb693d9acc7e27181fa5ee0ae7733d8a5424af428aea92c5df321fb2a873663cc3e6a2e7f642514c24c3575598ef62ef624b759f871_1280.jpg",
            description: "Romantic matching mug set for couples",
            description_bn: "দম্পতিদের জন্য রোমান্টিক ম্যাচিং মগ সেট"
        },
        {
            id: 16,
            name: "Luxury Hamper",
            name_bn: "বিলাসবহুল হ্যাম্পার",
            price: 2500,
            category: "Premium Luxury Gift Hampers",
            image: "https://pixabay.com/get/g074e52b952ac9ac7c0bad33bfffeb5c6247955618fb9adf9a6f9d2ffc9c3a5bf710dd21d999bfab92ab35b3363c544675c7d8d0176b3b2ecb29ee7823c9bf7db_1280.jpg",
            description: "Premium luxury gift hamper with assorted items",
            description_bn: "বিভিন্ন আইটেম সহ প্রিমিয়াম বিলাসবহুল উপহার হ্যাম্পার"
        },
        {
            id: 17,
            name: "Premium Gift Hamper",
            name_bn: "প্রিমিয়াম গিফট হ্যাম্পার",
            price: 3000,
            category: "Premium Luxury Gift Hampers",
            image: "https://pixabay.com/get/g539d3d60ed90c0ade5aedc44b52d400df27520bbc729dbc01e9bbc8792922bd4ea6f400c8277a1206504db7969d541a090c01996cf2f045d6dcd5e477179b88f_1280.jpg",
            description: "Ultimate luxury gift hamper for special occasions",
            description_bn: "বিশেষ অনুষ্ঠানের জন্য চূড়ান্ত বিলাসবহুল উপহার হ্যাম্পার"
        },
        {
            id: 18,
            name: "Chocolate Flower Combo",
            name_bn: "চকলেট ফুলের কম্বো",
            price: 1300,
            category: "Chocolates & Flowers",
            image: "https://pixabay.com/get/gf68420a72358f1efd59cfc740ed0c9ceaefd2ae5c7cd7e3330e3f3681a3992ce857cf4726e15fe3a67b442cd0a3ca4205ef2151b985e71a3a41f591f28c40f91_1280.jpg",
            description: "Romantic combination of chocolates and flowers",
            description_bn: "চকলেট এবং ফুলের রোমান্টিক সমন্বয়"
        }
    ];
}

function getStaticCategories() {
    return [
        { id: 1, name: "Mugs", name_bn: "মগ", icon: "fas fa-coffee", description: "Premium ceramic mugs starting from ৫৫০৳" },
        { id: 2, name: "T-Shirts", name_bn: "টি-শার্ট", icon: "fas fa-tshirt", description: "Comfortable t-shirts starting from ৫৫০৳" },
        { id: 3, name: "Keychains", name_bn: "চাবির চেইন", icon: "fas fa-key", description: "Stylish keychains starting from ৪০০৳" },
        { id: 4, name: "Water Bottles", name_bn: "পানির বোতল", icon: "fas fa-bottle-water", description: "Eco-friendly bottles starting from ৮০০৳" },
        { id: 5, name: "Gift for Him", name_bn: "তার জন্য উপহার", icon: "fas fa-male", description: "🎁 স্পেশাল gifts for men" },
        { id: 6, name: "Gift for Her", name_bn: "তার জন্য উপহার", icon: "fas fa-female", description: "💝 এক্সক্লুসিভ gifts for women" },
        { id: 7, name: "Gift for Parents", name_bn: "বাবা-মায়ের জন্য উপহার", icon: "fas fa-heart", description: "❤️ ভালোবাসা filled gifts" },
        { id: 8, name: "Gifts for Babies", name_bn: "শিশুদের জন্য উপহার", icon: "fas fa-baby", description: "🍼 সেফ baby products" },
        { id: 9, name: "For Couple", name_bn: "দম্পতির জন্য", icon: "fas fa-heart", description: "💑 রোমান্টিক couple gifts" },
        { id: 10, name: "Premium Luxury Gift Hampers", name_bn: "প্রিমিয়াম লাক্সারি গিফট হ্যাম্পার", icon: "fas fa-gift", description: "🎁 লাক্সারি hampers" },
        { id: 11, name: "Chocolates & Flowers", name_bn: "চকলেট এবং ফুল", icon: "fas fa-rose", description: "🍫🌹 রোমান্টিক combos" }
    ];
}

// Event Listeners
function setupEventListeners() {
    // Navigation
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Search
    const searchBtn = document.getElementById('search-btn');
    const searchClose = document.getElementById('search-close');
    
    searchBtn.addEventListener('click', () => {
        searchOverlay.classList.add('active');
        searchInput.focus();
    });
    
    searchClose.addEventListener('click', () => {
        searchOverlay.classList.remove('active');
        searchInput.value = '';
    });

    searchInput.addEventListener('input', handleSearch);

    // Cart
    const cartBtn = document.getElementById('cart-btn');
    cartBtn.addEventListener('click', () => openModal('cart-modal'));

    // Category filter
    const categorySelect = document.getElementById('category-select');
    categorySelect.addEventListener('change', (e) => {
        filterByCategory(e.target.value);
    });

    // Load more products
    const loadMoreBtn = document.getElementById('load-more-btn');
    loadMoreBtn.addEventListener('click', loadMoreProducts);

    // Newsletter
    const newsletterForm = document.getElementById('newsletter-form');
    newsletterForm.addEventListener('submit', handleNewsletterSubmit);

    // Contact form
    const contactForm = document.getElementById('contact-form');
    contactForm.addEventListener('submit', handleContactSubmit);

    // Header scroll effect
    window.addEventListener('scroll', handleScroll);

    // Close modal on overlay click
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            closeModal(e.target.id);
        }
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeAllModals();
        }
    });
}

// Slideshow Functions
function startSlideshow() {
    setInterval(() => {
        changeSlide(1);
    }, 5000);
}

function changeSlide(direction) {
    const slides = document.querySelectorAll('.slide');
    const indicators = document.querySelectorAll('.indicator');
    
    slides[currentSlide].classList.remove('active');
    indicators[currentSlide].classList.remove('active');
    
    currentSlide = (currentSlide + direction + slides.length) % slides.length;
    
    slides[currentSlide].classList.add('active');
    indicators[currentSlide].classList.add('active');
}

function goToSlide(n) {
    const slides = document.querySelectorAll('.slide');
    const indicators = document.querySelectorAll('.indicator');
    
    slides[currentSlide].classList.remove('active');
    indicators[currentSlide].classList.remove('active');
    
    currentSlide = n - 1;
    
    slides[currentSlide].classList.add('active');
    indicators[currentSlide].classList.add('active');
}

// Render Functions
function renderCategories() {
    const categoryGrid = document.getElementById('category-grid');
    const categorySelect = document.getElementById('category-select');
    
    // Render category cards
    categoryGrid.innerHTML = categories.map(category => `
        <div class="category-card" onclick="filterByCategory('${category.name}')">
            <div class="category-image">
                <i class="${category.icon}"></i>
            </div>
            <div class="category-info">
                <h3>${category.name}</h3>
                <p>${category.description}</p>
            </div>
        </div>
    `).join('');
    
    // Populate category select
    categorySelect.innerHTML = '<option value="">All Categories</option>' + 
        categories.map(category => `
            <option value="${category.name}">${category.name}</option>
        `).join('');
}

function renderProducts() {
    const productsGrid = document.getElementById('products-grid');
    const productsToShow = filteredProducts.slice(0, displayedProducts);
    
    productsGrid.innerHTML = productsToShow.map(product => `
        <div class="product-card fade-in" data-category="${product.category}">
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}" loading="lazy" onerror="this.src='https://via.placeholder.com/300x300/d4af37/000000?text=${encodeURIComponent(product.name)}'">
                ${product.badge ? `<div class="product-badge">${product.badge}</div>` : ''}
            </div>
            <div class="product-info">
                <div class="product-category">${product.category}</div>
                <h3 class="product-name">${product.name}</h3>
                <p class="product-description">${product.description}</p>
                <div class="product-price">৳${product.price}</div>
                <div class="product-actions">
                    <button class="add-to-cart-btn" onclick="addToCart(${product.id})">
                        <i class="fas fa-cart-plus"></i>
                        Add to Cart
                    </button>
                    <button class="whatsapp-btn" onclick="orderViaWhatsApp(${product.id})">
                        <i class="fab fa-whatsapp"></i>
                        Order
                    </button>
                </div>
            </div>
        </div>
    `).join('');
    
    // Update load more button
    const loadMoreBtn = document.getElementById('load-more-btn');
    if (displayedProducts >= filteredProducts.length) {
        loadMoreBtn.style.display = 'none';
    } else {
        loadMoreBtn.style.display = 'block';
    }
}

// Search and Filter Functions
function handleSearch(e) {
    const query = e.target.value.toLowerCase();
    
    if (query === '') {
        filteredProducts = [...products];
    } else {
        filteredProducts = products.filter(product => 
            product.name.toLowerCase().includes(query) ||
            product.category.toLowerCase().includes(query) ||
            product.description.toLowerCase().includes(query)
        );
    }
    
    displayedProducts = 6;
    renderProducts();
}

function filterByCategory(category) {
    if (category === '' || category === null) {
        filteredProducts = [...products];
    } else {
        filteredProducts = products.filter(product => product.category === category);
    }
    
    displayedProducts = 6;
    renderProducts();
    
    // Update category select
    const categorySelect = document.getElementById('category-select');
    categorySelect.value = category || '';
    
    // Scroll to products section
    scrollToSection('shop');
}

function loadMoreProducts() {
    displayedProducts += 6;
    renderProducts();
}

// Cart Functions
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }
    
    updateCartUI();
    saveCartToStorage();
    showSuccessMessage('Product added to cart!');
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartUI();
    saveCartToStorage();
}

function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (!item) return;
    
    item.quantity += change;
    
    if (item.quantity <= 0) {
        removeFromCart(productId);
    } else {
        updateCartUI();
        saveCartToStorage();
    }
}

function updateCartUI() {
    const cartCount = document.getElementById('cart-count');
    const cartItems = document.getElementById('cart-items');
    const cartEmpty = document.getElementById('cart-empty');
    const cartFooter = document.getElementById('cart-footer');
    const cartTotal = document.getElementById('cart-total');
    
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    cartCount.textContent = totalItems;
    cartTotal.textContent = totalPrice;
    
    if (cart.length === 0) {
        cartItems.style.display = 'none';
        cartEmpty.style.display = 'block';
        cartFooter.style.display = 'none';
    } else {
        cartItems.style.display = 'block';
        cartEmpty.style.display = 'none';
        cartFooter.style.display = 'block';
        
        cartItems.innerHTML = cart.map(item => `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.name}" class="cart-item-image" onerror="this.src='https://via.placeholder.com/80x80/d4af37/000000?text=${encodeURIComponent(item.name)}'">
                <div class="cart-item-info">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-price">৳${item.price}</div>
                    <div class="cart-item-controls">
                        <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)">
                            <i class="fas fa-minus"></i>
                        </button>
                        <span class="quantity">${item.quantity}</span>
                        <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)">
                            <i class="fas fa-plus"></i>
                        </button>
                        <button class="remove-btn" onclick="removeFromCart(${item.id})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    }
}

// Checkout Functions
function proceedToCheckout() {
    if (cart.length === 0) {
        showErrorMessage('Your cart is empty!');
        return;
    }
    
    closeModal('cart-modal');
    openModal('checkout-modal');
    showCheckoutStep(1);
    
    // Update checkout summary
    const checkoutTotal = document.getElementById('checkout-total');
    const remainingAmount = document.getElementById('remaining-amount');
    const checkoutItems = document.getElementById('checkout-items');
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    checkoutTotal.textContent = total;
    remainingAmount.textContent = total - 100;
    
    checkoutItems.innerHTML = cart.map(item => `
        <div class="checkout-item">
            <span>${item.name} x ${item.quantity}</span>
            <span>৳${item.price * item.quantity}</span>
        </div>
    `).join('');
}

function showCheckoutStep(step) {
    document.querySelectorAll('.step').forEach(s => s.classList.remove('active'));
    document.getElementById(`step-${step}`).classList.add('active');
}

function verifyPayment() {
    const transactionId = document.getElementById('transaction-id').value.trim();
    
    if (!transactionId) {
        showErrorMessage('Please enter transaction ID');
        return;
    }
    
    // Mock payment verification
    showLoading();
    
    setTimeout(() => {
        hideLoading();
        showSuccessMessage('Payment verified successfully!');
        showCheckoutStep(2);
    }, 2000);
}

function placeOrder() {
    const customerName = document.getElementById('customer-name').value.trim();
    const customerPhone = document.getElementById('customer-phone').value.trim();
    const customerDistrict = document.getElementById('customer-district').value;
    const customerThana = document.getElementById('customer-thana').value;
    const customerAddress = document.getElementById('customer-address').value.trim();
    const transactionId = document.getElementById('transaction-id').value.trim();
    
    if (!customerName || !customerPhone || !customerDistrict || !customerThana || !customerAddress) {
        showErrorMessage('Please fill in all required fields including district and thana');
        return;
    }
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const orderDetails = cart.map(item => `${item.name} x ${item.quantity} = ৳${item.price * item.quantity}`).join('\n');
    
    const message = `🛒 *New Order from TryneX*\n\n` +
        `👤 *Customer Details:*\n` +
        `Name: ${customerName}\n` +
        `Phone: ${customerPhone}\n` +
        `📍 *Delivery Location:* ${customerDistrict}, ${customerThana}\n` +
        `🏠 *Address:* ${customerAddress}\n\n` +
        `📦 *Order Details:*\n${orderDetails}\n\n` +
        `💰 *Payment Details:*\n` +
        `Total Amount: ৳${total}\n` +
        `Advance Paid: ৳100\n` +
        `Remaining: ৳${total - 100}\n` +
        `Transaction ID: ${transactionId}\n\n` +
        `Please confirm this order. Thank you! 🙏`;
    
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    
    // Show success notification
    showSuccessNotification();
    
    // Clear cart and close modal
    cart = [];
    updateCartUI();
    saveCartToStorage();
    closeModal('checkout-modal');
}

// WhatsApp Functions
function orderViaWhatsApp(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const message = `Hi! I'm interested in ordering:\n\n` +
        `📦 *Product:* ${product.name}\n` +
        `💰 *Price:* ৳${product.price}\n\n` +
        `Please provide more details about availability and delivery. Thank you!`;
    
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
}

// Storage Functions
function saveCartToStorage() {
    localStorage.setItem('trynex_cart', JSON.stringify(cart));
}

function loadCartFromStorage() {
    const savedCart = localStorage.getItem('trynex_cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
    }
}

// Form Handlers
function handleNewsletterSubmit(e) {
    e.preventDefault();
    
    const emailInput = document.getElementById('email-input');
    const email = emailInput.value.trim();
    
    if (!email) {
        showErrorMessage('Please enter a valid email address');
        return;
    }
    
    // Simulate newsletter signup
    showLoading();
    
    setTimeout(() => {
        hideLoading();
        emailInput.value = '';
        document.getElementById('newsletter-success').classList.add('show');
        
        setTimeout(() => {
            document.getElementById('newsletter-success').classList.remove('show');
        }, 3000);
    }, 1000);
}

function handleContactSubmit(e) {
    e.preventDefault();
    
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('contact-email').value.trim();
    const message = document.getElementById('message').value.trim();
    
    if (!name || !email || !message) {
        showErrorMessage('Please fill in all fields');
        return;
    }
    
    const whatsappMessage = `📧 *Contact Form Submission*\n\n` +
        `👤 *Name:* ${name}\n` +
        `📧 *Email:* ${email}\n` +
        `💬 *Message:* ${message}`;
    
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(whatsappMessage)}`;
    window.open(whatsappUrl, '_blank');
    
    // Reset form
    e.target.reset();
    showSuccessMessage('Message sent! We will get back to you soon.');
}

// Utility Functions
function openModal(modalId) {
    document.getElementById(modalId).classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
    document.body.style.overflow = 'auto';
}

function closeAllModals() {
    document.querySelectorAll('.modal').forEach(modal => {
        modal.classList.remove('active');
    });
    searchOverlay.classList.remove('active');
    document.body.style.overflow = 'auto';
}

function showLoading() {
    loadingOverlay.classList.add('active');
}

function hideLoading() {
    loadingOverlay.classList.remove('active');
}

function showSuccessMessage(message) {
    // Create and show a temporary success message
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.innerHTML = `<i class="fas fa-check-circle"></i> ${message}`;
    successDiv.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: #28a745;
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        z-index: 3001;
        box-shadow: 0 4px 20px rgba(0,0,0,0.2);
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;
    
    document.body.appendChild(successDiv);
    
    setTimeout(() => {
        successDiv.style.transform = 'translateX(0)';
    }, 100);
    
    setTimeout(() => {
        successDiv.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(successDiv);
        }, 300);
    }, 3000);
}

function showErrorMessage(message) {
    // Create and show a temporary error message
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;
    errorDiv.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: #dc3545;
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        z-index: 3001;
        box-shadow: 0 4px 20px rgba(0,0,0,0.2);
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;
    
    document.body.appendChild(errorDiv);
    
    setTimeout(() => {
        errorDiv.style.transform = 'translateX(0)';
    }, 100);
    
    setTimeout(() => {
        errorDiv.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(errorDiv);
        }, 300);
    }, 3000);
}

function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
        element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

function handleScroll() {
    const header = document.getElementById('header');
    if (window.scrollY > 100) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
}

// Lazy Loading for Images
function setupLazyLoading() {
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });

        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
}

// Initialize lazy loading when DOM is loaded
document.addEventListener('DOMContentLoaded', setupLazyLoading);

// Service Worker Registration (for PWA features)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}

// Performance optimization
function optimizeImages() {
    document.querySelectorAll('img').forEach(img => {
        img.loading = 'lazy';
        img.addEventListener('error', function() {
            this.src = 'https://via.placeholder.com/300x300/d4af37/000000?text=Image+Not+Found';
        });
    });
}

// Initialize image optimization
document.addEventListener('DOMContentLoaded', optimizeImages);

// Bangladesh Districts and Thanas Data
const bangladeshLocations = {
    "Dhaka": ["Dhanmondi", "Gulshan", "Banani", "Uttara", "Mirpur", "Mohammadpur", "Old Dhaka", "Wari", "Ramna", "Tejgaon", "Pallabi", "Shah Ali"],
    "Chittagong": ["Chittagong Sadar", "Sitakunda", "Mirsharai", "Fatikchhari", "Hathazari", "Raozan", "Patiya", "Chandanaish", "Satkania", "Lohagara", "Banshkhali", "Boalkhali"],
    "Sylhet": ["Sylhet Sadar", "Beanibazar", "Bishwanath", "Balaganj", "Companiganj", "Fenchuganj", "Golapganj", "Gowainghat", "Jaintiapur", "Kanaighat", "Osmani Nagar", "Zakiganj"],
    "Rajshahi": ["Rajshahi Sadar", "Bagha", "Bagmara", "Charghat", "Durgapur", "Godagari", "Mohanpur", "Paba", "Puthia", "Tanore"],
    "Khulna": ["Khulna Sadar", "Batiaghata", "Dacope", "Dumuria", "Dighalia", "Koyra", "Paikgachha", "Phultala", "Rupsa", "Terokhada"],
    "Barisal": ["Barisal Sadar", "Agailjhara", "Babuganj", "Bakerganj", "Banaripara", "Gaurnadi", "Hizla", "Mehendiganj", "Muladi", "Wazirpur"],
    "Rangpur": ["Rangpur Sadar", "Badarganj", "Gangachara", "Kaunia", "Mithapukur", "Pirgachha", "Pirganj", "Taraganj"],
    "Mymensingh": ["Mymensingh Sadar", "Bhaluka", "Dhobaura", "Fulbaria", "Gaffargaon", "Gouripur", "Haluaghat", "Ishwarganj", "Muktagachha", "Nandail", "Phulpur", "Trishal"],
    "Comilla": ["Comilla Sadar", "Barura", "Brahmanpara", "Burichang", "Chandina", "Chauddagram", "Daudkandi", "Debidwar", "Homna", "Laksam", "Meghna", "Muradnagar", "Nangalkot", "Titas"],
    "Gazipur": ["Gazipur Sadar", "Kaliakair", "Kaliganj", "Kapasia", "Sreepur"],
    "Narayanganj": ["Narayanganj Sadar", "Araihazar", "Bandar", "Rupganj", "Sonargaon"],
    "Tangail": ["Tangail Sadar", "Basail", "Bhuapur", "Delduar", "Ghatail", "Gopalpur", "Kalihati", "Madhupur", "Mirzapur", "Nagarpur", "Sakhipur", "Dhanbari"]
};

// Initialize Districts Dropdown
function initializeDistricts() {
    const districtSelect = document.getElementById('customer-district');
    if (districtSelect) {
        Object.keys(bangladeshLocations).forEach(district => {
            const option = document.createElement('option');
            option.value = district;
            option.textContent = district;
            districtSelect.appendChild(option);
        });
    }
}

// Update Thanas based on selected District
function updateThanas() {
    const districtSelect = document.getElementById('customer-district');
    const thanaSelect = document.getElementById('customer-thana');
    
    if (!districtSelect || !thanaSelect) return;
    
    const selectedDistrict = districtSelect.value;
    
    // Clear existing thanas
    thanaSelect.innerHTML = '<option value="">Select Thana</option>';
    
    if (selectedDistrict && bangladeshLocations[selectedDistrict]) {
        bangladeshLocations[selectedDistrict].forEach(thana => {
            const option = document.createElement('option');
            option.value = thana;
            option.textContent = thana;
            thanaSelect.appendChild(option);
        });
    }
}

// Show Success Notification
function showSuccessNotification() {
    const notification = document.getElementById('success-notification');
    if (notification) {
        notification.classList.add('show');
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            closeNotification();
        }, 5000);
    }
}

// Close Notification
function closeNotification() {
    const notification = document.getElementById('success-notification');
    if (notification) {
        notification.classList.remove('show');
    }
}

// Initialize districts on page load
document.addEventListener('DOMContentLoaded', initializeDistricts);

// Export functions for global access
window.filterByCategory = filterByCategory;
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.updateQuantity = updateQuantity;
window.orderViaWhatsApp = orderViaWhatsApp;
window.proceedToCheckout = proceedToCheckout;
window.verifyPayment = verifyPayment;
window.placeOrder = placeOrder;
window.openModal = openModal;
window.closeModal = closeModal;
window.changeSlide = changeSlide;
window.goToSlide = goToSlide;
window.scrollToSection = scrollToSection;
window.updateThanas = updateThanas;
window.showSuccessNotification = showSuccessNotification;
window.closeNotification = closeNotification;
