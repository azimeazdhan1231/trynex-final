// TryneX - Premium Gift Shop JavaScript
// Global Variables
let cart = JSON.parse(localStorage.getItem('trynex-cart')) || [];
let orders = JSON.parse(localStorage.getItem('trynex-orders')) || [];
let promoCodes = JSON.parse(localStorage.getItem('trynex-promo-codes')) || [
    { code: 'WELCOME10', discount: 10, type: 'percentage', expiry: '2025-12-31', active: true },
    { code: 'SAVE50', discount: 50, type: 'fixed', expiry: '2025-12-31', active: true },
    { code: 'LUXURY15', discount: 15, type: 'percentage', expiry: '2025-12-31', active: true }
];
let currentPromoCode = null;
let currentPage = 1;
let itemsPerPage = 12;
let filteredProducts = [];
let currentSlide = 0;
let sliderInterval;

// WhatsApp Number
const WHATSAPP_NUMBER = '8801747292277';

// Product Data - 50+ items across 11 categories
const products = [
    // Mugs Category
    {
        id: 1,
        title: 'Classic Ceramic Mug',
        price: 550,
        category: 'mugs',
        image: 'https://images.unsplash.com/photo-1514228742587-6b1558fcf93a?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
        description: 'Premium ceramic mug perfect for your daily coffee ritual. Dishwasher safe and microwave friendly.'
    },
    {
        id: 2,
        title: 'Designer Mug',
        price: 650,
        category: 'mugs',
        image: 'https://images.unsplash.com/photo-1506717726346-6c0a97d1fe87?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
        description: 'Elegant designer mug with unique patterns. Perfect for gifting or personal use.'
    },
    {
        id: 3,
        title: 'Personalized Mug',
        price: 700,
        category: 'mugs',
        image: 'https://via.placeholder.com/300x300/d4af37/ffffff?text=Personalized+Mug',
        description: 'Custom personalized mug with your name or message. Great for special occasions.'
    },
    {
        id: 4,
        title: 'Travel Mug',
        price: 800,
        category: 'mugs',
        image: 'https://via.placeholder.com/300x300/d4af37/ffffff?text=Travel+Mug',
        description: 'Insulated travel mug to keep your drinks hot or cold for hours. Perfect for on-the-go.'
    },
    {
        id: 5,
        title: 'Magic Mug',
        price: 750,
        category: 'mugs',
        image: 'https://via.placeholder.com/300x300/d4af37/ffffff?text=Magic+Mug',
        description: 'Color-changing magic mug that reveals hidden designs when hot liquid is added.'
    },

    // T-Shirts Category
    {
        id: 6,
        title: 'Comfort T-Shirt',
        price: 550,
        category: 't-shirts',
        image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
        description: '100% cotton comfortable t-shirt. Available in multiple colors and sizes.'
    },
    {
        id: 7,
        title: 'Premium Graphic Tee',
        price: 600,
        category: 't-shirts',
        image: 'https://via.placeholder.com/300x300/d4af37/ffffff?text=Premium+Graphic+Tee',
        description: 'Premium quality graphic t-shirt with unique designs. Perfect for casual wear.'
    },
    {
        id: 8,
        title: 'Custom T-Shirt',
        price: 650,
        category: 't-shirts',
        image: 'https://via.placeholder.com/300x300/d4af37/ffffff?text=Custom+T-Shirt',
        description: 'Custom printed t-shirt with your design or message. High-quality printing guaranteed.'
    },
    {
        id: 9,
        title: 'Oversized Tee',
        price: 700,
        category: 't-shirts',
        image: 'https://via.placeholder.com/300x300/d4af37/ffffff?text=Oversized+Tee',
        description: 'Trendy oversized t-shirt for a relaxed and comfortable fit. Perfect for streetwear.'
    },
    {
        id: 10,
        title: 'Vintage T-Shirt',
        price: 580,
        category: 't-shirts',
        image: 'https://via.placeholder.com/300x300/d4af37/ffffff?text=Vintage+T-Shirt',
        description: 'Retro vintage-style t-shirt with classic designs. Soft and comfortable fabric.'
    },

    // Keychains Category
    {
        id: 11,
        title: 'Elegant Keychain',
        price: 400,
        category: 'keychains',
        image: 'https://via.placeholder.com/300x300/d4af37/ffffff?text=Elegant+Keychain',
        description: 'Elegant metal keychain with premium finish. Perfect accessory for your keys.'
    },
    {
        id: 12,
        title: 'Custom Keychain',
        price: 450,
        category: 'keychains',
        image: 'https://via.placeholder.com/300x300/d4af37/ffffff?text=Custom+Keychain',
        description: 'Personalized keychain with your name or design. Made with durable materials.'
    },
    {
        id: 13,
        title: 'Metal Keychain',
        price: 500,
        category: 'keychains',
        image: 'https://via.placeholder.com/300x300/d4af37/ffffff?text=Metal+Keychain',
        description: 'Heavy-duty metal keychain with unique design. Long-lasting and stylish.'
    },
    {
        id: 14,
        title: 'Leather Keychain',
        price: 600,
        category: 'keychains',
        image: 'https://via.placeholder.com/300x300/d4af37/ffffff?text=Leather+Keychain',
        description: 'Premium leather keychain with elegant finishing. Perfect for professionals.'
    },
    {
        id: 15,
        title: 'LED Keychain',
        price: 480,
        category: 'keychains',
        image: 'https://via.placeholder.com/300x300/d4af37/ffffff?text=LED+Keychain',
        description: 'Functional LED keychain with bright light. Perfect for everyday use.'
    },

    // Water Bottles Category
    {
        id: 16,
        title: 'Eco-Friendly Bottle',
        price: 800,
        category: 'water-bottles',
        image: 'https://via.placeholder.com/300x300/d4af37/ffffff?text=Eco-Friendly+Bottle',
        description: 'Environmentally friendly water bottle made from recycled materials. BPA-free.'
    },
    {
        id: 17,
        title: 'Insulated Bottle',
        price: 900,
        category: 'water-bottles',
        image: 'https://via.placeholder.com/300x300/d4af37/ffffff?text=Insulated+Bottle',
        description: 'Double-wall insulated bottle keeps drinks hot or cold for 12+ hours.'
    },
    {
        id: 18,
        title: 'Stainless Steel Bottle',
        price: 1000,
        category: 'water-bottles',
        image: 'https://via.placeholder.com/300x300/d4af37/ffffff?text=Stainless+Steel+Bottle',
        description: 'Premium stainless steel water bottle with leak-proof design. Durable and stylish.'
    },
    {
        id: 19,
        title: 'Sports Bottle',
        price: 1100,
        category: 'water-bottles',
        image: 'https://via.placeholder.com/300x300/d4af37/ffffff?text=Sports+Bottle',
        description: 'Sports water bottle with ergonomic design. Perfect for workouts and outdoor activities.'
    },
    {
        id: 20,
        title: 'Glass Water Bottle',
        price: 850,
        category: 'water-bottles',
        image: 'https://via.placeholder.com/300x300/d4af37/ffffff?text=Glass+Water+Bottle',
        description: 'Borosilicate glass water bottle with protective silicone sleeve. Pure taste guaranteed.'
    },

    // Gift for Him Category
    {
        id: 21,
        title: 'Men\'s Leather Wallet',
        price: 1200,
        category: 'gift-him',
        image: 'https://via.placeholder.com/300x300/d4af37/ffffff?text=Mens+Leather+Wallet',
        description: 'Premium leather wallet with multiple card slots and bill compartment. RFID blocking.'
    },
    {
        id: 22,
        title: 'Men\'s Watch',
        price: 1500,
        category: 'gift-him',
        image: 'https://via.placeholder.com/300x300/d4af37/ffffff?text=Mens+Watch',
        description: 'Stylish men\'s watch with stainless steel band. Water-resistant and durable.'
    },
    {
        id: 23,
        title: 'Perfume Set',
        price: 1800,
        category: 'gift-him',
        image: 'https://via.placeholder.com/300x300/d4af37/ffffff?text=Perfume+Set',
        description: 'Premium men\'s perfume set with long-lasting fragrance. Perfect for special occasions.'
    },
    {
        id: 24,
        title: 'Tie Set',
        price: 2000,
        category: 'gift-him',
        image: 'https://via.placeholder.com/300x300/d4af37/ffffff?text=Tie+Set',
        description: 'Elegant silk tie set with matching pocket square. Professional and sophisticated.'
    },
    {
        id: 25,
        title: 'Grooming Kit',
        price: 1400,
        category: 'gift-him',
        image: 'https://via.placeholder.com/300x300/d4af37/ffffff?text=Grooming+Kit',
        description: 'Complete grooming kit with premium tools. Perfect for the modern gentleman.'
    },

    // Gift for Her Category
    {
        id: 26,
        title: 'Ladies\' Pearl Necklace',
        price: 1500,
        category: 'gift-her',
        image: 'https://via.placeholder.com/300x300/d4af37/ffffff?text=Pearl+Necklace',
        description: 'Elegant pearl necklace with sterling silver clasp. Perfect for formal occasions.'
    },
    {
        id: 27,
        title: 'Handbag Set',
        price: 1800,
        category: 'gift-her',
        image: 'https://via.placeholder.com/300x300/d4af37/ffffff?text=Handbag+Set',
        description: 'Luxury handbag set with matching accessories. Premium quality materials.'
    },
    {
        id: 28,
        title: 'Earring Set',
        price: 2000,
        category: 'gift-her',
        image: 'https://via.placeholder.com/300x300/d4af37/ffffff?text=Earring+Set',
        description: 'Beautiful earring set with premium stones. Hypoallergenic and comfortable.'
    },
    {
        id: 29,
        title: 'Spa Kit',
        price: 2200,
        category: 'gift-her',
        image: 'https://via.placeholder.com/300x300/d4af37/ffffff?text=Spa+Kit',
        description: 'Luxury spa kit with essential oils and bath products. Perfect for relaxation.'
    },
    {
        id: 30,
        title: 'Jewelry Box',
        price: 1400,
        category: 'gift-her',
        image: 'https://via.placeholder.com/300x300/d4af37/ffffff?text=Jewelry+Box',
        description: 'Elegant jewelry box with velvet lining. Multiple compartments for organization.'
    },

    // Gift for Parents Category
    {
        id: 31,
        title: 'Family Photo Frame',
        price: 1000,
        category: 'gift-parents',
        image: 'https://via.placeholder.com/300x300/d4af37/ffffff?text=Family+Photo+Frame',
        description: 'Beautiful family photo frame with elegant design. Perfect for displaying memories.'
    },
    {
        id: 32,
        title: 'Personalized Plaque',
        price: 1300,
        category: 'gift-parents',
        image: 'https://via.placeholder.com/300x300/d4af37/ffffff?text=Personalized+Plaque',
        description: 'Custom engraved plaque with family name or message. Premium wood finish.'
    },
    {
        id: 33,
        title: 'Couple Mug Set',
        price: 1500,
        category: 'gift-parents',
        image: 'https://via.placeholder.com/300x300/d4af37/ffffff?text=Couple+Mug+Set',
        description: 'Matching couple mug set with romantic designs. Perfect for morning coffee together.'
    },
    {
        id: 34,
        title: 'Memory Book',
        price: 1700,
        category: 'gift-parents',
        image: 'https://via.placeholder.com/300x300/d4af37/ffffff?text=Memory+Book',
        description: 'Custom memory book for preserving family memories. High-quality photo paper.'
    },
    {
        id: 35,
        title: 'Garden Set',
        price: 1200,
        category: 'gift-parents',
        image: 'https://via.placeholder.com/300x300/d4af37/ffffff?text=Garden+Set',
        description: 'Complete garden tool set for plant-loving parents. Durable and ergonomic.'
    },

    // Gifts for Babies Category
    {
        id: 36,
        title: 'Baby Rattle Set',
        price: 700,
        category: 'gift-babies',
        image: 'https://via.placeholder.com/300x300/d4af37/ffffff?text=Baby+Rattle+Set',
        description: 'Safe and colorful baby rattle set. BPA-free and designed for tiny hands.'
    },
    {
        id: 37,
        title: 'Soft Toy Bundle',
        price: 850,
        category: 'gift-babies',
        image: 'https://via.placeholder.com/300x300/d4af37/ffffff?text=Soft+Toy+Bundle',
        description: 'Cuddly soft toy bundle with various animals. Safe and washable materials.'
    },
    {
        id: 38,
        title: 'Baby Blanket',
        price: 950,
        category: 'gift-babies',
        image: 'https://via.placeholder.com/300x300/d4af37/ffffff?text=Baby+Blanket',
        description: 'Ultra-soft baby blanket with adorable designs. Hypoallergenic and comfortable.'
    },
    {
        id: 39,
        title: 'Teether Set',
        price: 1000,
        category: 'gift-babies',
        image: 'https://via.placeholder.com/300x300/d4af37/ffffff?text=Teether+Set',
        description: 'Safe silicone teether set for teething babies. BPA-free and easy to clean.'
    },
    {
        id: 40,
        title: 'Baby Photo Album',
        price: 800,
        category: 'gift-babies',
        image: 'https://via.placeholder.com/300x300/d4af37/ffffff?text=Baby+Photo+Album',
        description: 'Beautiful baby photo album for preserving precious moments. Acid-free pages.'
    },

    // For Couple Category
    {
        id: 41,
        title: 'Couple\'s Mug Set',
        price: 1100,
        category: 'for-couple',
        image: 'https://via.placeholder.com/300x300/d4af37/ffffff?text=Couples+Mug+Set',
        description: 'Romantic couple\'s mug set with matching designs. Perfect for morning coffee dates.'
    },
    {
        id: 42,
        title: 'Love Photo Frame',
        price: 1400,
        category: 'for-couple',
        image: 'https://via.placeholder.com/300x300/d4af37/ffffff?text=Love+Photo+Frame',
        description: 'Romantic photo frame for couple\'s memories. Elegant design with heart motifs.'
    },
    {
        id: 43,
        title: 'Couple Keychain',
        price: 1600,
        category: 'for-couple',
        image: 'https://via.placeholder.com/300x300/d4af37/ffffff?text=Couple+Keychain',
        description: 'Matching couple keychain set that connects together. Symbol of eternal love.'
    },
    {
        id: 44,
        title: 'Heart Pendant',
        price: 1800,
        category: 'for-couple',
        image: 'https://via.placeholder.com/300x300/d4af37/ffffff?text=Heart+Pendant',
        description: 'Beautiful heart pendant necklace for couples. Sterling silver with engraving.'
    },
    {
        id: 45,
        title: 'Date Night Kit',
        price: 1300,
        category: 'for-couple',
        image: 'https://via.placeholder.com/300x300/d4af37/ffffff?text=Date+Night+Kit',
        description: 'Complete date night kit with candles, wine accessories, and more.'
    },

    // Premium Luxury Gift Hampers Category
    {
        id: 46,
        title: 'Luxury Hamper',
        price: 2500,
        category: 'luxury-hampers',
        image: 'https://via.placeholder.com/300x300/d4af37/ffffff?text=Luxury+Hamper',
        description: 'Premium luxury hamper with gourmet treats and premium gifts. Perfect for VIPs.'
    },
    {
        id: 47,
        title: 'Deluxe Gift Box',
        price: 3000,
        category: 'luxury-hampers',
        image: 'https://via.placeholder.com/300x300/d4af37/ffffff?text=Deluxe+Gift+Box',
        description: 'Deluxe gift box with assorted premium items. Beautifully packaged and presented.'
    },
    {
        id: 48,
        title: 'Premium Hamper',
        price: 3500,
        category: 'luxury-hampers',
        image: 'https://via.placeholder.com/300x300/d4af37/ffffff?text=Premium+Hamper',
        description: 'Ultimate premium hamper with luxury items and gourmet delicacies.'
    },
    {
        id: 49,
        title: 'Elite Basket',
        price: 4000,
        category: 'luxury-hampers',
        image: 'https://via.placeholder.com/300x300/d4af37/ffffff?text=Elite+Basket',
        description: 'Elite gift basket with the finest selection of luxury items and treats.'
    },
    {
        id: 50,
        title: 'Executive Hamper',
        price: 2800,
        category: 'luxury-hampers',
        image: 'https://via.placeholder.com/300x300/d4af37/ffffff?text=Executive+Hamper',
        description: 'Executive hamper perfect for corporate gifts and business occasions.'
    },

    // Chocolates & Flowers Category
    {
        id: 51,
        title: 'Chocolate Flower Combo',
        price: 1300,
        category: 'chocolates-flowers',
        image: 'https://via.placeholder.com/300x300/d4af37/ffffff?text=Chocolate+Flower+Combo',
        description: 'Beautiful combination of premium chocolates and fresh flowers. Perfect for romance.'
    },
    {
        id: 52,
        title: 'Rose & Truffle Set',
        price: 1600,
        category: 'chocolates-flowers',
        image: 'https://via.placeholder.com/300x300/d4af37/ffffff?text=Rose+Truffle+Set',
        description: 'Elegant rose bouquet with premium chocolate truffles. Luxury gift for special occasions.'
    },
    {
        id: 53,
        title: 'Flower Bouquet',
        price: 1800,
        category: 'chocolates-flowers',
        image: 'https://via.placeholder.com/300x300/d4af37/ffffff?text=Flower+Bouquet',
        description: 'Fresh flower bouquet with seasonal blooms. Professionally arranged and delivered.'
    },
    {
        id: 54,
        title: 'Chocolate Tower',
        price: 2000,
        category: 'chocolates-flowers',
        image: 'https://via.placeholder.com/300x300/d4af37/ffffff?text=Chocolate+Tower',
        description: 'Impressive chocolate tower with assorted premium chocolates. Perfect centerpiece.'
    },
    {
        id: 55,
        title: 'Valentine Special',
        price: 1500,
        category: 'chocolates-flowers',
        image: 'https://via.placeholder.com/300x300/d4af37/ffffff?text=Valentine+Special',
        description: 'Special Valentine\'s Day combo with red roses and heart-shaped chocolates.'
    }
];

// Utility Functions
function generateOrderId() {
    const now = new Date();
    const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '');
    const orderNumber = String(orders.length + 1).padStart(3, '0');
    return `TXR-${dateStr}-${orderNumber}`;
}

function formatPrice(price) {
    return `৳${price}`;
}

function formatDate(date) {
    return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

function saveToLocalStorage(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

function getFromLocalStorage(key) {
    return JSON.parse(localStorage.getItem(key)) || [];
}

function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Search Functionality
function initializeSearch() {
    const searchBtn = document.getElementById('searchBtn');
    const searchOverlay = document.getElementById('searchOverlay');
    const searchInput = document.getElementById('searchInput');
    const searchClose = document.getElementById('searchClose');
    const searchResults = document.getElementById('searchResults');

    searchBtn.addEventListener('click', () => {
        searchOverlay.classList.add('active');
        searchInput.focus();
    });

    searchClose.addEventListener('click', () => {
        searchOverlay.classList.remove('active');
        searchInput.value = '';
        searchResults.innerHTML = '';
    });

    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        if (query.length >= 2) {
            const results = products.filter(product => 
                product.title.toLowerCase().includes(query) ||
                product.category.toLowerCase().includes(query) ||
                product.description.toLowerCase().includes(query)
            ).slice(0, 10);

            displaySearchResults(results);
        } else {
            searchResults.innerHTML = '';
        }
    });

    // Close search on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && searchOverlay.classList.contains('active')) {
            searchOverlay.classList.remove('active');
            searchInput.value = '';
            searchResults.innerHTML = '';
        }
    });
}

function displaySearchResults(results) {
    const searchResults = document.getElementById('searchResults');
    
    if (results.length === 0) {
        searchResults.innerHTML = '<div class="search-no-results">No products found</div>';
        return;
    }

    searchResults.innerHTML = results.map(product => `
        <div class="search-result-item" onclick="selectSearchResult(${product.id})">
            <img src="${product.image}" alt="${product.title}" class="search-result-image">
            <div class="search-result-info">
                <h4>${product.title}</h4>
                <p>${product.description.substring(0, 100)}...</p>
            </div>
            <div class="search-result-price">${formatPrice(product.price)}</div>
        </div>
    `).join('');
}

function selectSearchResult(productId) {
    const product = products.find(p => p.id === productId);
    if (product) {
        openQuickViewModal(product);
        document.getElementById('searchOverlay').classList.remove('active');
        document.getElementById('searchInput').value = '';
        document.getElementById('searchResults').innerHTML = '';
    }
}

// Hero Slider
function initializeSlider() {
    const slides = document.querySelectorAll('.slide');
    const sliderDots = document.getElementById('sliderDots');
    const prevBtn = document.getElementById('prevSlide');
    const nextBtn = document.getElementById('nextSlide');

    // Create dots
    slides.forEach((_, index) => {
        const dot = document.createElement('div');
        dot.className = `slider-dot ${index === 0 ? 'active' : ''}`;
        dot.addEventListener('click', () => goToSlide(index));
        sliderDots.appendChild(dot);
    });

    // Event listeners
    prevBtn.addEventListener('click', () => {
        currentSlide = currentSlide > 0 ? currentSlide - 1 : slides.length - 1;
        updateSlider();
    });

    nextBtn.addEventListener('click', () => {
        currentSlide = currentSlide < slides.length - 1 ? currentSlide + 1 : 0;
        updateSlider();
    });

    // Auto-slide
    startSliderInterval();

    // Pause on hover
    const heroSection = document.querySelector('.hero');
    heroSection.addEventListener('mouseenter', stopSliderInterval);
    heroSection.addEventListener('mouseleave', startSliderInterval);
}

function goToSlide(index) {
    currentSlide = index;
    updateSlider();
}

function updateSlider() {
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.slider-dot');

    slides.forEach((slide, index) => {
        slide.classList.toggle('active', index === currentSlide);
    });

    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentSlide);
    });
}

function startSliderInterval() {
    sliderInterval = setInterval(() => {
        const slides = document.querySelectorAll('.slide');
        currentSlide = currentSlide < slides.length - 1 ? currentSlide + 1 : 0;
        updateSlider();
    }, 5000);
}

function stopSliderInterval() {
    clearInterval(sliderInterval);
}

// Product Display
function displayProducts(productsToShow = products, containerId = 'productsGrid') {
    const container = document.getElementById(containerId);
    if (!container) return;

    if (productsToShow.length === 0) {
        container.innerHTML = '<div class="no-products">No products found</div>';
        return;
    }

    container.innerHTML = productsToShow.map(product => `
        <div class="product-card" data-category="${product.category}">
            <div class="product-image">
                <img src="${product.image}" alt="${product.title}" loading="lazy">
                <div class="product-actions">
                    <button class="product-action-btn" onclick="addToCart(${product.id})" title="Add to Cart">
                        <i class="fas fa-shopping-cart"></i>
                    </button>
                    <button class="product-action-btn" onclick="openQuickViewModal(${JSON.stringify(product).replace(/"/g, '&quot;')})" title="Quick View">
                        <i class="fas fa-eye"></i>
                    </button>
                </div>
            </div>
            <div class="product-info">
                <div class="product-category">${getCategoryName(product.category)}</div>
                <h3 class="product-title">${product.title}</h3>
                <p class="product-description">${product.description.substring(0, 100)}...</p>
                <div class="product-price">${formatPrice(product.price)}</div>
                <div class="product-buttons">
                    <button class="add-to-cart-btn" onclick="addToCart(${product.id})">
                        <i class="fas fa-shopping-cart"></i> Add to Cart
                    </button>
                    <button class="quick-view-btn" onclick="openQuickViewModal(${JSON.stringify(product).replace(/"/g, '&quot;')})">
                        <i class="fas fa-eye"></i> Quick View
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

function getCategoryName(category) {
    const categoryNames = {
        'mugs': 'Mugs',
        't-shirts': 'T-Shirts',
        'keychains': 'Keychains',
        'water-bottles': 'Water Bottles',
        'gift-him': 'Gift for Him',
        'gift-her': 'Gift for Her',
        'gift-parents': 'Gift for Parents',
        'gift-babies': 'Gifts for Babies',
        'for-couple': 'For Couple',
        'luxury-hampers': 'Luxury Hampers',
        'chocolates-flowers': 'Chocolates & Flowers'
    };
    return categoryNames[category] || category;
}

// Category Filtering
function filterProducts(category = '') {
    const filteredProducts = category ? products.filter(p => p.category === category) : products;
    displayProducts(filteredProducts);
    
    // Update filter dropdown
    const categoryFilter = document.getElementById('categoryFilter');
    if (categoryFilter) {
        categoryFilter.value = category;
    }
}

function initializeFilters() {
    const categoryFilter = document.getElementById('categoryFilter');
    if (categoryFilter) {
        categoryFilter.addEventListener('change', (e) => {
            filterProducts(e.target.value);
        });
    }

    // Category cards click handlers
    document.querySelectorAll('.category-card').forEach(card => {
        card.addEventListener('click', () => {
            const category = card.dataset.category;
            filterProducts(category);
            scrollToSection('products');
        });
    });
}

// Cart Management
function addToCart(productId, quantity = 1) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({
            id: productId,
            title: product.title,
            price: product.price,
            image: product.image,
            quantity: quantity
        });
    }

    updateCartDisplay();
    saveToLocalStorage('trynex-cart', cart);
    showNotification(`${product.title} added to cart!`);
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartDisplay();
    saveToLocalStorage('trynex-cart', cart);
    showNotification('Item removed from cart');
}

function updateCartQuantity(productId, quantity) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity = Math.max(1, quantity);
        updateCartDisplay();
        saveToLocalStorage('trynex-cart', cart);
    }
}

function updateCartDisplay() {
    const cartCount = document.getElementById('cartCount');
    const cartItems = document.getElementById('cartItems');
    const cartSubtotal = document.getElementById('cartSubtotal');
    const cartTotal = document.getElementById('cartTotal');
    const deliveryFee = document.getElementById('deliveryFee');
    const deliveryLocation = document.getElementById('deliveryLocation');

    // Update cart count
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;

    // Update cart items
    if (cartItems) {
        if (cart.length === 0) {
            cartItems.innerHTML = '<div class="empty-cart">Your cart is empty</div>';
        } else {
            cartItems.innerHTML = cart.map(item => `
                <div class="cart-item">
                    <img src="${item.image}" alt="${item.title}" class="cart-item-image">
                    <div class="cart-item-info">
                        <h4 class="cart-item-title">${item.title}</h4>
                        <div class="cart-item-price">${formatPrice(item.price)}</div>
                        <div class="cart-item-quantity">
                            <button class="qty-btn" onclick="updateCartQuantity(${item.id}, ${item.quantity - 1})">-</button>
                            <input type="number" class="qty-input" value="${item.quantity}" onchange="updateCartQuantity(${item.id}, parseInt(this.value))">
                            <button class="qty-btn" onclick="updateCartQuantity(${item.id}, ${item.quantity + 1})">+</button>
                        </div>
                    </div>
                    <button class="cart-item-remove" onclick="removeFromCart(${item.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `).join('');
        }
    }

    // Update totals
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    let deliveryFeeAmount = 80; // Default Dhaka metro

    if (deliveryLocation) {
        deliveryFeeAmount = deliveryLocation.value === 'outside' ? 120 : 80;
    }

    let total = subtotal + deliveryFeeAmount;

    // Apply promo code discount
    if (currentPromoCode) {
        if (currentPromoCode.type === 'percentage') {
            const discount = (subtotal * currentPromoCode.discount) / 100;
            total = subtotal - discount + deliveryFeeAmount;
        } else {
            total = subtotal - currentPromoCode.discount + deliveryFeeAmount;
        }
    }

    if (cartSubtotal) cartSubtotal.textContent = formatPrice(subtotal);
    if (deliveryFee) deliveryFee.textContent = formatPrice(deliveryFeeAmount);
    if (cartTotal) cartTotal.textContent = formatPrice(total);

    // Update order modal totals
    const orderSubtotal = document.getElementById('orderSubtotal');
    const orderDelivery = document.getElementById('orderDelivery');
    const orderTotal = document.getElementById('orderTotal');
    const discountRow = document.getElementById('discountRow');
    const discountAmount = document.getElementById('discountAmount');

    if (orderSubtotal) orderSubtotal.textContent = formatPrice(subtotal);
    if (orderDelivery) orderDelivery.textContent = formatPrice(deliveryFeeAmount);
    if (orderTotal) orderTotal.textContent = formatPrice(total);

    if (currentPromoCode && discountRow && discountAmount) {
        let discount = 0;
        if (currentPromoCode.type === 'percentage') {
            discount = (subtotal * currentPromoCode.discount) / 100;
        } else {
            discount = currentPromoCode.discount;
        }
        discountRow.style.display = 'flex';
        discountAmount.textContent = `-${formatPrice(discount)}`;
    } else if (discountRow) {
        discountRow.style.display = 'none';
    }
}

// Cart Modal
function openCartModal() {
    console.log('Opening cart modal...');
    try {
        updateCartDisplay();
        const cartModal = document.getElementById('cartModal');
        if (cartModal) {
            cartModal.classList.add('active');
            console.log('Cart modal opened successfully');
        } else {
            console.error('Cart modal element not found');
        }
    } catch (error) {
        console.error('Error opening cart modal:', error);
        showNotification('Error opening cart. Please try again.', 'error');
    }
}

function closeCartModal() {
    document.getElementById('cartModal').classList.remove('active');
}

// Order Management
function proceedToOrder() {
    if (cart.length === 0) {
        showNotification('Your cart is empty!', 'error');
        return;
    }

    closeCartModal();
    document.getElementById('orderModal').classList.add('active');
    updateCartDisplay();
}

function placeOrder() {
    const customerName = document.getElementById('customerName').value;
    const customerPhone = document.getElementById('customerPhone').value;
    const customerEmail = document.getElementById('customerEmail').value;
    const deliveryAddress = document.getElementById('deliveryAddress').value;
    const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked');

    if (!customerName || !customerPhone || !customerEmail || !deliveryAddress || !paymentMethod) {
        showNotification('Please fill in all required fields', 'error');
        return;
    }

    const orderId = generateOrderId();
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const deliveryFeeAmount = document.getElementById('deliveryLocation').value === 'outside' ? 120 : 80;
    let total = subtotal + deliveryFeeAmount;
    let discount = 0;

    if (currentPromoCode) {
        if (currentPromoCode.type === 'percentage') {
            discount = (subtotal * currentPromoCode.discount) / 100;
        } else {
            discount = currentPromoCode.discount;
        }
        total = subtotal - discount + deliveryFeeAmount;
    }

    const order = {
        id: orderId,
        date: new Date().toISOString(),
        customerName,
        customerPhone,
        customerEmail,
        deliveryAddress,
        paymentMethod: paymentMethod.value,
        paymentStatus: 'Unpaid',
        status: 'Pending',
        items: [...cart],
        subtotal,
        deliveryFee: deliveryFeeAmount,
        discount,
        total,
        instructions: document.getElementById('orderInstructions').value,
        promoCode: currentPromoCode ? currentPromoCode.code : null
    };

    orders.push(order);
    saveToLocalStorage('trynex-orders', orders);

    // Clear cart
    cart = [];
    saveToLocalStorage('trynex-cart', cart);
    updateCartDisplay();

    // Show success modal
    document.getElementById('orderModal').classList.remove('active');
    showOrderSuccess(order);
}

function showOrderSuccess(order) {
    document.getElementById('generatedOrderId').textContent = order.id;
    document.getElementById('finalOrderTotal').textContent = formatPrice(order.total);
    document.getElementById('orderSuccessModal').classList.add('active');
}

function closeOrderModal() {
    document.getElementById('orderModal').classList.remove('active');
}

function closeOrderSuccessModal() {
    document.getElementById('orderSuccessModal').classList.remove('active');
}

function copyOrderId() {
    const orderId = document.getElementById('generatedOrderId').textContent;
    navigator.clipboard.writeText(orderId).then(() => {
        showNotification('Order ID copied to clipboard!');
    });
}

function trackOrder() {
    const orderId = document.getElementById('generatedOrderId').textContent;
    window.location.href = `track-order.html?id=${orderId}`;
}

function continueShopping() {
    closeOrderSuccessModal();
    window.location.href = 'index.html#products';
}

// Promo Code Management
function applyPromoCode() {
    const promoCodeInput = document.getElementById('promoCode');
    const promoMessage = document.getElementById('promoMessage');
    const code = promoCodeInput.value.trim().toUpperCase();

    if (!code) {
        showPromoMessage('Please enter a promo code', 'error');
        return;
    }

    const promoCode = promoCodes.find(pc => pc.code === code && pc.active);

    if (!promoCode) {
        showPromoMessage('Invalid promo code', 'error');
        return;
    }

    // Check expiry
    if (new Date() > new Date(promoCode.expiry)) {
        showPromoMessage('Promo code has expired', 'error');
        return;
    }

    currentPromoCode = promoCode;
    updateCartDisplay();
    showPromoMessage(`Promo code applied! ${promoCode.discount}${promoCode.type === 'percentage' ? '%' : '৳'} discount`, 'success');
}

function showPromoMessage(message, type) {
    const promoMessage = document.getElementById('promoMessage');
    promoMessage.textContent = message;
    promoMessage.className = `promo-message ${type}`;
}

function openPromoCodeModal() {
    const promoCodesList = document.getElementById('promoCodesList');
    promoCodesList.innerHTML = promoCodes.filter(pc => pc.active).map(pc => `
        <div class="promo-code-item">
            <div class="promo-code-header">
                <h4>${pc.code}</h4>
                <span class="promo-discount">${pc.discount}${pc.type === 'percentage' ? '%' : '৳'} OFF</span>
            </div>
            <p class="promo-expiry">Expires: ${formatDate(pc.expiry)}</p>
            <button class="promo-apply-btn" onclick="applyPromoCodeFromModal('${pc.code}')">Apply</button>
        </div>
    `).join('');
    
    document.getElementById('promoCodeModal').classList.add('active');
}

function closePromoCodeModal() {
    document.getElementById('promoCodeModal').classList.remove('active');
}

function applyPromoCodeFromModal(code) {
    document.getElementById('promoCode').value = code;
    applyPromoCode();
    closePromoCodeModal();
}

// WhatsApp Integration
function orderViaWhatsApp() {
    if (cart.length === 0) {
        showNotification('Your cart is empty!', 'error');
        return;
    }

    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const deliveryFeeAmount = document.getElementById('deliveryLocation').value === 'outside' ? 120 : 80;
    const total = subtotal + deliveryFeeAmount;
    const instructions = document.getElementById('orderInstructions').value;

    let message = `🛒 *New Order from TryneX*\n\n`;
    message += `📝 *Order Details:*\n`;
    
    cart.forEach(item => {
        message += `• ${item.title} x${item.quantity} - ${formatPrice(item.price * item.quantity)}\n`;
    });
    
    message += `\n💰 *Order Summary:*\n`;
    message += `Subtotal: ${formatPrice(subtotal)}\n`;
    message += `Delivery: ${formatPrice(deliveryFeeAmount)}\n`;
    message += `*Total: ${formatPrice(total)}*\n\n`;
    
    if (instructions) {
        message += `📋 *Special Instructions:*\n${instructions}\n\n`;
    }
    
    message += `Please confirm this order and provide payment details.`;

    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
}

function orderViaWhatsAppSingle() {
    const productId = parseInt(document.getElementById('quickViewQuantity').dataset.productId);
    const quantity = parseInt(document.getElementById('quickViewQuantity').value);
    const product = products.find(p => p.id === productId);

    if (!product) return;

    const total = product.price * quantity;
    let message = `🛒 *New Order from TryneX*\n\n`;
    message += `📝 *Product:* ${product.title}\n`;
    message += `💰 *Price:* ${formatPrice(product.price)}\n`;
    message += `🔢 *Quantity:* ${quantity}\n`;
    message += `*Total: ${formatPrice(total)}*\n\n`;
    message += `Please confirm this order and provide payment details.`;

    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
}

function contactViaWhatsApp() {
    const orderId = document.getElementById('displayOrderId').textContent;
    const message = `Hello! I need help with my order: ${orderId}`;
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
}

// Quick View Modal
function openQuickViewModal(product) {
    document.getElementById('quickViewImage').src = product.image;
    document.getElementById('quickViewImage').alt = product.title;
    document.getElementById('quickViewTitle').textContent = product.title;
    document.getElementById('quickViewCategory').textContent = getCategoryName(product.category);
    document.getElementById('quickViewPrice').textContent = formatPrice(product.price);
    document.getElementById('quickViewDescription').textContent = product.description;
    document.getElementById('quickViewQuantity').value = 1;
    document.getElementById('quickViewQuantity').dataset.productId = product.id;
    
    document.getElementById('quickViewModal').classList.add('active');
}

function closeQuickViewModal() {
    document.getElementById('quickViewModal').classList.remove('active');
}

function changeQuantity(change) {
    const quantityInput = document.getElementById('quickViewQuantity');
    const currentValue = parseInt(quantityInput.value);
    const newValue = Math.max(1, currentValue + change);
    quantityInput.value = newValue;
}

function addToCartFromQuickView() {
    const productId = parseInt(document.getElementById('quickViewQuantity').dataset.productId);
    const quantity = parseInt(document.getElementById('quickViewQuantity').value);
    addToCart(productId, quantity);
    closeQuickViewModal();
}

// Order Tracking
function initializeTrackOrderPage() {
    const urlParams = new URLSearchParams(window.location.search);
    const orderId = urlParams.get('id');
    
    if (orderId) {
        document.getElementById('orderIdInput').value = orderId;
        trackOrderById(orderId);
    }

    displayRecentOrders();
}

function trackOrderById(orderId) {
    const order = orders.find(o => o.id === orderId);
    
    if (order) {
        displayOrderDetails(order);
    } else {
        showOrderNotFound();
    }
}

function displayOrderDetails(order) {
    document.getElementById('orderDetails').style.display = 'block';
    document.getElementById('orderNotFound').style.display = 'none';
    
    document.getElementById('displayOrderId').textContent = order.id;
    document.getElementById('orderDate').textContent = formatDate(order.date);
    document.getElementById('orderStatus').textContent = order.status;
    document.getElementById('orderStatus').className = `status ${order.status.toLowerCase()}`;
    document.getElementById('paymentMethod').textContent = order.paymentMethod;
    document.getElementById('paymentStatus').textContent = order.paymentStatus;
    document.getElementById('paymentStatus').className = `status ${order.paymentStatus.toLowerCase()}`;
    document.getElementById('totalAmount').textContent = formatPrice(order.total);
    document.getElementById('customerName').textContent = order.customerName;
    document.getElementById('customerPhone').textContent = order.customerPhone;
    document.getElementById('customerEmail').textContent = order.customerEmail;
    document.getElementById('deliveryAddress').textContent = order.deliveryAddress;
    document.getElementById('deliveryFeeAmount').textContent = formatPrice(order.deliveryFee);
    
    // Update progress timeline
    updateProgressTimeline(order.status);
    
    // Display order items
    displayOrderItems(order.items);
    
    // Show instructions if any
    if (order.instructions) {
        document.getElementById('specialInstructions').style.display = 'block';
        document.getElementById('instructionsText').textContent = order.instructions;
    } else {
        document.getElementById('specialInstructions').style.display = 'none';
    }
}

function showOrderNotFound() {
    document.getElementById('orderDetails').style.display = 'none';
    document.getElementById('orderNotFound').style.display = 'block';
}

function updateProgressTimeline(status) {
    const steps = ['placed', 'confirmed', 'processing', 'shipped', 'delivered'];
    const currentStepIndex = steps.indexOf(status.toLowerCase());
    
    document.querySelectorAll('.progress-step').forEach((step, index) => {
        step.classList.toggle('active', index <= currentStepIndex);
    });
}

function displayOrderItems(items) {
    const orderItemsList = document.getElementById('orderItemsList');
    orderItemsList.innerHTML = items.map(item => `
        <div class="order-item">
            <img src="${item.image}" alt="${item.title}" class="order-item-image">
            <div class="order-item-info">
                <h4 class="order-item-title">${item.title}</h4>
                <div class="order-item-details">Quantity: ${item.quantity}</div>
            </div>
            <div class="order-item-price">${formatPrice(item.price * item.quantity)}</div>
        </div>
    `).join('');
}

function displayRecentOrders() {
    const recentOrdersList = document.getElementById('recentOrdersList');
    const recentOrders = orders.slice(-5).reverse();
    
    if (recentOrders.length === 0) {
        recentOrdersList.innerHTML = '<p class="no-orders">No recent orders found.</p>';
        return;
    }
    
    recentOrdersList.innerHTML = recentOrders.map(order => `
        <div class="recent-order-item" onclick="trackOrderById('${order.id}')">
            <div class="recent-order-info">
                <div class="recent-order-id">${order.id}</div>
                <div class="recent-order-date">${formatDate(order.date)}</div>
            </div>
            <div class="recent-order-status">
                <span class="status ${order.status.toLowerCase()}">${order.status}</span>
            </div>
            <div class="recent-order-total">${formatPrice(order.total)}</div>
        </div>
    `).join('');
}

function reorderItems() {
    const orderId = document.getElementById('displayOrderId').textContent;
    const order = orders.find(o => o.id === orderId);
    
    if (order) {
        // Clear current cart
        cart = [];
        
        // Add all items from the order to cart
        order.items.forEach(item => {
            cart.push({
                id: item.id,
                title: item.title,
                price: item.price,
                image: item.image,
                quantity: item.quantity
            });
        });
        
        saveToLocalStorage('trynex-cart', cart);
        updateCartDisplay();
        showNotification('Items added to cart!');
        
        // Redirect to home page
        window.location.href = 'index.html#products';
    }
}

// Products Page Functions
function initializeProductsPage() {
    filteredProducts = [...products];
    displayAllProducts();
    initializeProductsFilters();
    initializeViewToggle();
}

function displayAllProducts() {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const productsToShow = filteredProducts.slice(startIndex, endIndex);
    
    displayProducts(productsToShow, 'allProductsGrid');
    updateProductsCount();
    updatePagination();
}

function initializeProductsFilters() {
    const categoryFilter = document.getElementById('categoryFilter');
    const priceFilter = document.getElementById('priceFilter');
    const sortFilter = document.getElementById('sortFilter');
    
    if (categoryFilter) {
        categoryFilter.addEventListener('change', applyFilters);
    }
    
    if (priceFilter) {
        priceFilter.addEventListener('change', applyFilters);
    }
    
    if (sortFilter) {
        sortFilter.addEventListener('change', applyFilters);
    }
}

function applyFilters() {
    const categoryFilter = document.getElementById('categoryFilter').value;
    const priceFilter = document.getElementById('priceFilter').value;
    const sortFilter = document.getElementById('sortFilter').value;
    
    // Filter by category
    filteredProducts = categoryFilter ? products.filter(p => p.category === categoryFilter) : [...products];
    
    // Filter by price
    if (priceFilter) {
        const [min, max] = priceFilter.split('-').map(p => p === '+' ? Infinity : parseInt(p));
        filteredProducts = filteredProducts.filter(p => p.price >= min && (max === Infinity || p.price <= max));
    }
    
    // Sort products
    switch (sortFilter) {
        case 'price-low':
            filteredProducts.sort((a, b) => a.price - b.price);
            break;
        case 'price-high':
            filteredProducts.sort((a, b) => b.price - a.price);
            break;
        case 'name-asc':
            filteredProducts.sort((a, b) => a.title.localeCompare(b.title));
            break;
        case 'name-desc':
            filteredProducts.sort((a, b) => b.title.localeCompare(a.title));
            break;
        default:
            // Featured (default order)
            break;
    }
    
    currentPage = 1;
    displayAllProducts();
}

function clearFilters() {
    document.getElementById('categoryFilter').value = '';
    document.getElementById('priceFilter').value = '';
    document.getElementById('sortFilter').value = 'featured';
    
    filteredProducts = [...products];
    currentPage = 1;
    displayAllProducts();
}

function updateProductsCount() {
    const productsCount = document.getElementById('productsCount');
    if (productsCount) {
        productsCount.textContent = `Showing ${filteredProducts.length} products`;
    }
}

function updatePagination() {
    const pagination = document.getElementById('pagination');
    if (!pagination) return;
    
    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
    
    if (totalPages <= 1) {
        pagination.innerHTML = '';
        return;
    }
    
    let paginationHTML = '';
    
    // Previous button
    if (currentPage > 1) {
        paginationHTML += `<button class="pagination-btn" onclick="goToPage(${currentPage - 1})">Previous</button>`;
    }
    
    // Page numbers
    for (let i = 1; i <= totalPages; i++) {
        if (i === currentPage) {
            paginationHTML += `<button class="pagination-btn active">${i}</button>`;
        } else {
            paginationHTML += `<button class="pagination-btn" onclick="goToPage(${i})">${i}</button>`;
        }
    }
    
    // Next button
    if (currentPage < totalPages) {
        paginationHTML += `<button class="pagination-btn" onclick="goToPage(${currentPage + 1})">Next</button>`;
    }
    
    pagination.innerHTML = paginationHTML;
}

function goToPage(page) {
    currentPage = page;
    displayAllProducts();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function initializeViewToggle() {
    const viewBtns = document.querySelectorAll('.view-btn');
    const productsGrid = document.getElementById('allProductsGrid');
    
    viewBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            viewBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const view = btn.dataset.view;
            if (view === 'list') {
                productsGrid.classList.add('list-view');
            } else {
                productsGrid.classList.remove('list-view');
            }
        });
    });
}

// Newsletter
function initializeNewsletter() {
    const newsletterForm = document.getElementById('newsletterForm');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const email = e.target.querySelector('input[type="email"]').value;
            
            // Simulate subscription
            const newsletters = getFromLocalStorage('trynex-newsletters') || [];
            newsletters.push({ email, date: new Date().toISOString() });
            saveToLocalStorage('trynex-newsletters', newsletters);
            
            // Show success message
            const messageDiv = document.getElementById('newsletterMessage');
            messageDiv.textContent = 'Thank you for subscribing!';
            messageDiv.classList.add('success');
            
            // Reset form
            e.target.reset();
            
            // Hide message after 3 seconds
            setTimeout(() => {
                messageDiv.classList.remove('success');
                messageDiv.textContent = '';
            }, 3000);
        });
    }
}

// Contact Form
function initializeContactForm() {
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const formData = new FormData(e.target);
            const contactData = {
                name: formData.get('name') || e.target.querySelector('input[type="text"]').value,
                email: formData.get('email') || e.target.querySelector('input[type="email"]').value,
                message: formData.get('message') || e.target.querySelector('textarea').value,
                date: new Date().toISOString()
            };
            
            // Save to localStorage
            const contacts = getFromLocalStorage('trynex-contacts') || [];
            contacts.push(contactData);
            saveToLocalStorage('trynex-contacts', contacts);
            
            showNotification('Thank you for your message! We will get back to you soon.');
            e.target.reset();
        });
    }
}

// Navigation
function initializeNavigation() {
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');
    
    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            menuToggle.classList.toggle('active');
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!navMenu.contains(e.target) && !menuToggle.contains(e.target)) {
                navMenu.classList.remove('active');
                menuToggle.classList.remove('active');
            }
        });
        
        // Close menu when clicking on a link
        navMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                menuToggle.classList.remove('active');
            });
        });
    }
    
    // Update active nav link on scroll
    window.addEventListener('scroll', updateActiveNavLink);
}

function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let currentSection = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.offsetHeight;
        
        if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
            currentSection = section.id;
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSection}`) {
            link.classList.add('active');
        }
    });
}

// Utility Functions
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
    }
}

function trackOrder() {
    const orderIdInput = document.getElementById('orderIdInput');
    const orderId = orderIdInput.value.trim();
    
    if (!orderId) {
        showNotification('Please enter an order ID', 'error');
        return;
    }
    
    trackOrderById(orderId);
}

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initializeNavigation();
    initializeSearch();
    initializeFilters();
    initializeNewsletter();
    initializeContactForm();
    
    // Initialize cart button event listener with multiple attempts
    function initializeCartButton() {
        const cartBtn = document.getElementById('cartBtn');
        if (cartBtn) {
            cartBtn.removeEventListener('click', openCartModal); // Remove any existing listeners
            cartBtn.addEventListener('click', openCartModal);
            console.log('Cart button initialized successfully');
        } else {
            console.log('Cart button not found, retrying...');
            setTimeout(initializeCartButton, 100);
        }
    }
    initializeCartButton();
    
    // Initialize slider only on home page
    if (document.querySelector('.hero-slider')) {
        initializeSlider();
    }
    
    // Display featured products on home page
    const productsGrid = document.getElementById('productsGrid');
    if (productsGrid) {
        displayProducts(products.slice(0, 12));
    }
    
    // Update cart display
    updateCartDisplay();
    
    // Close modals when clicking outside
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            e.target.classList.remove('active');
        }
    });
    
    // Delivery location change handler
    const deliveryLocation = document.getElementById('deliveryLocation');
    if (deliveryLocation) {
        deliveryLocation.addEventListener('change', updateCartDisplay);
    }
    
    // Add notification styles
    const style = document.createElement('style');
    style.textContent = `
        .notification {
            position: fixed;
            top: 100px;
            right: 20px;
            background: white;
            border-radius: 12px;
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
            z-index: 4000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
        }
        
        .notification.show {
            transform: translateX(0);
        }
        
        .notification-content {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 16px 20px;
            color: #374151;
        }
        
        .notification.success .notification-content i {
            color: #10b981;
        }
        
        .notification.error .notification-content i {
            color: #ef4444;
        }
        
        .promo-code-item {
            padding: 16px;
            border-bottom: 1px solid #e5e7eb;
            background: #f9fafb;
            margin-bottom: 12px;
            border-radius: 8px;
        }
        
        .promo-code-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 8px;
        }
        
        .promo-code-header h4 {
            margin: 0;
            color: #d4af37;
            font-weight: 600;
        }
        
        .promo-discount {
            background: #d4af37;
            color: white;
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 12px;
            font-weight: 600;
        }
        
        .promo-expiry {
            color: #6b7280;
            font-size: 14px;
            margin: 0 0 12px 0;
        }
        
        .promo-apply-btn {
            background: #d4af37;
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 6px;
            cursor: pointer;
            font-weight: 500;
            transition: background 0.3s ease;
        }
        
        .promo-apply-btn:hover {
            background: #b8941f;
        }
        
        .empty-cart {
            text-align: center;
            padding: 40px 20px;
            color: #6b7280;
        }
        
        .no-products {
            text-align: center;
            padding: 40px 20px;
            color: #6b7280;
            grid-column: 1 / -1;
        }
        
        .search-no-results {
            text-align: center;
            padding: 20px;
            color: #6b7280;
        }
        
        .list-view {
            display: flex;
            flex-direction: column;
            gap: 20px;
        }
        
        .list-view .product-card {
            display: flex;
            align-items: center;
            gap: 20px;
            padding: 20px;
        }
        
        .list-view .product-image {
            width: 150px;
            height: 150px;
            flex-shrink: 0;
        }
        
        .list-view .product-info {
            flex: 1;
        }
        
        .list-view .product-buttons {
            flex-direction: column;
            gap: 10px;
            min-width: 150px;
        }
        
        @media (max-width: 768px) {
            .list-view .product-card {
                flex-direction: column;
                text-align: center;
            }
            
            .list-view .product-image {
                width: 100%;
                max-width: 250px;
            }
            
            .list-view .product-buttons {
                flex-direction: row;
                min-width: auto;
            }
        }
    `;
    document.head.appendChild(style);
});

// Global functions for HTML onclick handlers
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.updateCartQuantity = updateCartQuantity;
window.openCartModal = openCartModal;
window.closeCartModal = closeCartModal;
window.proceedToOrder = proceedToOrder;
window.placeOrder = placeOrder;
window.closeOrderModal = closeOrderModal;
window.closeOrderSuccessModal = closeOrderSuccessModal;
window.copyOrderId = copyOrderId;
window.trackOrder = trackOrder;
window.continueShopping = continueShopping;
window.applyPromoCode = applyPromoCode;
window.openPromoCodeModal = openPromoCodeModal;
window.closePromoCodeModal = closePromoCodeModal;
window.applyPromoCodeFromModal = applyPromoCodeFromModal;
window.orderViaWhatsApp = orderViaWhatsApp;
window.orderViaWhatsAppSingle = orderViaWhatsAppSingle;
window.contactViaWhatsApp = contactViaWhatsApp;
window.openQuickViewModal = openQuickViewModal;
window.closeQuickViewModal = closeQuickViewModal;
window.changeQuantity = changeQuantity;
window.addToCartFromQuickView = addToCartFromQuickView;
window.trackOrderById = trackOrderById;
window.reorderItems = reorderItems;
window.initializeProductsPage = initializeProductsPage;
window.clearFilters = clearFilters;
window.goToPage = goToPage;
window.initializeTrackOrderPage = initializeTrackOrderPage;
window.filterProducts = filterProducts;
window.scrollToSection = scrollToSection;
