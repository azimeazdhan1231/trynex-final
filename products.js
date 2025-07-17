
// Products Page JavaScript
let allProducts = [];
let filteredProducts = [];
let currentPage = 1;
const productsPerPage = 12;
let currentView = 'grid';
let promoCodes = {};

// Initialize Products Page
document.addEventListener('DOMContentLoaded', function() {
    if (window.location.pathname.includes('products.html')) {
        initializeProductsPage();
    }
});

async function initializeProductsPage() {
    showLoading();
    
    try {
        await loadProductsData();
        await loadPromoCodes();
        setupProductsEventListeners();
        populateCategoryFilter();
        renderProducts();
        loadCartFromStorage();
        updateCartUI();
    } catch (error) {
        console.error('Failed to initialize products page:', error);
        showErrorMessage('Failed to load products');
    } finally {
        hideLoading();
    }
}

// Load products data
async function loadProductsData() {
    try {
        // First try to load from CMS
        await loadProductsFromCMS();
        
        if (allProducts.length === 0) {
            // Fallback to static data
            allProducts = getStaticProducts();
        }
        
        filteredProducts = [...allProducts];
        
    } catch (error) {
        console.error('Error loading products:', error);
        allProducts = getStaticProducts();
        filteredProducts = [...allProducts];
    }
}

// Load promo codes
async function loadPromoCodes() {
    try {
        const response = await fetch('_data/promos.json');
        if (response.ok) {
            promoCodes = await response.json();
        } else {
            // Default promo codes
            promoCodes = {
                "WELCOME10": { discount: 10, type: "percentage", active: true, description: "10% off for new customers" },
                "SAVE50": { discount: 50, type: "fixed", active: true, description: "৳50 off on orders above ৳500" },
                "FREESHIP": { discount: 80, type: "shipping", active: true, description: "Free shipping" }
            };
        }
    } catch (error) {
        console.error('Error loading promo codes:', error);
        promoCodes = {};
    }
}

// Setup event listeners for products page
function setupProductsEventListeners() {
    // Filter controls
    const categoryFilter = document.getElementById('category-filter');
    const priceFilter = document.getElementById('price-filter');
    const sortFilter = document.getElementById('sort-filter');
    const productSearch = document.getElementById('product-search');
    
    if (categoryFilter) categoryFilter.addEventListener('change', applyFilters);
    if (priceFilter) priceFilter.addEventListener('change', applyFilters);
    if (sortFilter) sortFilter.addEventListener('change', applySorting);
    if (productSearch) productSearch.addEventListener('input', handleProductSearch);
    
    // View toggle
    const viewBtns = document.querySelectorAll('.view-btn');
    viewBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.view-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            currentView = e.target.dataset.view;
            renderProducts();
        });
    });
    
    // Enhanced search
    const searchBtn = document.getElementById('search-btn');
    const searchOverlay = document.getElementById('search-overlay');
    const searchClose = document.getElementById('search-close');
    const searchInput = document.getElementById('search-input');
    
    if (searchBtn) {
        searchBtn.addEventListener('click', () => {
            searchOverlay.classList.add('active');
            searchInput.focus();
        });
    }
    
    if (searchClose) {
        searchClose.addEventListener('click', () => {
            searchOverlay.classList.remove('active');
            searchInput.value = '';
            clearSearchSuggestions();
        });
    }
    
    if (searchInput) {
        searchInput.addEventListener('input', handleAdvancedSearch);
    }
    
    // Promo code functionality
    const applyPromoBtn = document.getElementById('apply-promo-btn');
    if (applyPromoBtn) {
        applyPromoBtn.addEventListener('click', applyPromoCode);
    }
    
    // Close overlay when clicking outside
    if (searchOverlay) {
        searchOverlay.addEventListener('click', (e) => {
            if (e.target === searchOverlay) {
                searchOverlay.classList.remove('active');
            }
        });
    }
}

// Populate category filter
function populateCategoryFilter() {
    const categoryFilter = document.getElementById('category-filter');
    if (!categoryFilter) return;
    
    const categories = [...new Set(allProducts.map(p => p.category))];
    
    categoryFilter.innerHTML = '<option value="">All Categories</option>';
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        categoryFilter.appendChild(option);
    });
}

// Handle product search
function handleProductSearch(e) {
    const query = e.target.value.toLowerCase();
    applyFilters();
}

// Handle advanced search with suggestions
function handleAdvancedSearch(e) {
    const query = e.target.value.toLowerCase().trim();
    
    if (query.length < 2) {
        clearSearchSuggestions();
        return;
    }
    
    const suggestions = generateSearchSuggestions(query);
    displaySearchSuggestions(suggestions);
}

// Generate search suggestions
function generateSearchSuggestions(query) {
    const suggestions = [];
    const maxSuggestions = 8;
    
    // Product name matches
    allProducts.forEach(product => {
        if (product.name.toLowerCase().includes(query) && suggestions.length < maxSuggestions) {
            suggestions.push({
                type: 'product',
                text: product.name,
                action: () => selectProduct(product)
            });
        }
    });
    
    // Category matches
    const categories = [...new Set(allProducts.map(p => p.category))];
    categories.forEach(category => {
        if (category.toLowerCase().includes(query) && suggestions.length < maxSuggestions) {
            suggestions.push({
                type: 'category',
                text: `All ${category}`,
                action: () => filterByCategory(category)
            });
        }
    });
    
    // Description matches
    allProducts.forEach(product => {
        if (product.description.toLowerCase().includes(query) && 
            !suggestions.some(s => s.text === product.name) && 
            suggestions.length < maxSuggestions) {
            suggestions.push({
                type: 'product',
                text: product.name,
                subtext: product.description.substring(0, 50) + '...',
                action: () => selectProduct(product)
            });
        }
    });
    
    return suggestions;
}

// Display search suggestions
function displaySearchSuggestions(suggestions) {
    const suggestionsContainer = document.getElementById('search-suggestions');
    if (!suggestionsContainer) return;
    
    if (suggestions.length === 0) {
        suggestionsContainer.style.display = 'none';
        return;
    }
    
    suggestionsContainer.innerHTML = suggestions.map((suggestion, index) => `
        <div class="suggestion-item" onclick="selectSuggestion('${suggestion.text.replace(/'/g, "\\'")}', '${suggestion.type}')">
            <div class="suggestion-main">${suggestion.text}</div>
            ${suggestion.subtext ? `<div class="suggestion-sub">${suggestion.subtext}</div>` : ''}
        </div>
    `).join('');
    
    suggestionsContainer.classList.add('show');
    
    // Add click outside to close
    setTimeout(() => {
        document.addEventListener('click', handleOutsideClick);
    }, 100);
}

// Handle clicks outside search suggestions
function handleOutsideClick(e) {
    const searchContainer = document.querySelector('.search-container');
    const suggestionsContainer = document.getElementById('search-suggestions');
    
    if (searchContainer && !searchContainer.contains(e.target)) {
        clearSearchSuggestions();
        document.removeEventListener('click', handleOutsideClick);
    }
}

// Clear search suggestions
function clearSearchSuggestions() {
    const suggestionsContainer = document.getElementById('search-suggestions');
    if (suggestionsContainer) {
        suggestionsContainer.classList.remove('show');
        suggestionsContainer.innerHTML = '';
    }
}

// Select suggestion
function selectSuggestion(text, type) {
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.value = text;
    }
    
    if (type === 'category') {
        const category = text.replace('All ', '');
        filterByCategory(category);
    } else {
        // Search for the product
        filteredProducts = allProducts.filter(p => 
            p.name.toLowerCase().includes(text.toLowerCase())
        );
        currentPage = 1;
        renderProducts();
        updateResultsCount();
    }
    
    clearSearchSuggestions();
    const searchOverlay = document.getElementById('search-overlay');
    if (searchOverlay) {
        searchOverlay.classList.remove('active');
    }
}

// Apply filters
function applyFilters() {
    const categoryFilter = document.getElementById('category-filter');
    const priceFilter = document.getElementById('price-filter');
    const productSearch = document.getElementById('product-search');
    
    const selectedCategory = categoryFilter ? categoryFilter.value : '';
    const selectedPriceRange = priceFilter ? priceFilter.value : '';
    const searchQuery = productSearch ? productSearch.value.toLowerCase() : '';
    
    filteredProducts = allProducts.filter(product => {
        // Category filter
        if (selectedCategory && product.category !== selectedCategory) {
            return false;
        }
        
        // Price filter
        if (selectedPriceRange) {
            const [min, max] = selectedPriceRange.split('-').map(Number);
            if (product.price < min || (max && product.price > max)) {
                return false;
            }
        }
        
        // Search filter
        if (searchQuery) {
            const searchFields = [
                product.name.toLowerCase(),
                product.category.toLowerCase(),
                product.description.toLowerCase()
            ];
            
            if (!searchFields.some(field => field.includes(searchQuery))) {
                return false;
            }
        }
        
        return true;
    });
    
    currentPage = 1;
    applySorting();
    renderProducts();
    updateResultsCount();
}

// Apply sorting
function applySorting() {
    const sortFilter = document.getElementById('sort-filter');
    const sortBy = sortFilter ? sortFilter.value : 'newest';
    
    switch (sortBy) {
        case 'price-low':
            filteredProducts.sort((a, b) => a.price - b.price);
            break;
        case 'price-high':
            filteredProducts.sort((a, b) => b.price - a.price);
            break;
        case 'name':
            filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
            break;
        case 'newest':
        default:
            filteredProducts.sort((a, b) => b.id - a.id);
            break;
    }
    
    renderProducts();
}

// Render products
function renderProducts() {
    const productsGrid = document.getElementById('products-grid');
    if (!productsGrid) return;
    
    const startIndex = (currentPage - 1) * productsPerPage;
    const endIndex = startIndex + productsPerPage;
    const productsToShow = filteredProducts.slice(startIndex, endIndex);
    
    // Update grid class based on view
    productsGrid.className = `products-grid ${currentView}-view`;
    
    if (productsToShow.length === 0) {
        productsGrid.innerHTML = `
            <div class="no-products">
                <i class="fas fa-search"></i>
                <h3>No Products Found</h3>
                <p>Try adjusting your filters or search terms</p>
            </div>
        `;
        return;
    }
    
    productsGrid.innerHTML = productsToShow.map(product => `
        <div class="product-card fade-in" data-category="${product.category}">
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}" loading="lazy" 
                     onerror="this.src='https://via.placeholder.com/300x300/d4af37/000000?text=${encodeURIComponent(product.name)}'">
                ${product.badge ? `<div class="product-badge">${product.badge}</div>` : ''}
                ${product.featured ? `<div class="product-badge featured">Featured</div>` : ''}
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
    
    renderPagination();
}

// Render pagination
function renderPagination() {
    const pagination = document.getElementById('pagination');
    if (!pagination) return;
    
    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
    
    if (totalPages <= 1) {
        pagination.innerHTML = '';
        return;
    }
    
    let paginationHTML = '';
    
    // Previous button
    paginationHTML += `
        <button onclick="changePage(${currentPage - 1})" ${currentPage === 1 ? 'disabled' : ''}>
            <i class="fas fa-chevron-left"></i>
        </button>
    `;
    
    // Page numbers
    const startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(totalPages, currentPage + 2);
    
    if (startPage > 1) {
        paginationHTML += `<button onclick="changePage(1)">1</button>`;
        if (startPage > 2) {
            paginationHTML += `<span>...</span>`;
        }
    }
    
    for (let i = startPage; i <= endPage; i++) {
        paginationHTML += `
            <button onclick="changePage(${i})" ${i === currentPage ? 'class="active"' : ''}>
                ${i}
            </button>
        `;
    }
    
    if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
            paginationHTML += `<span>...</span>`;
        }
        paginationHTML += `<button onclick="changePage(${totalPages})">${totalPages}</button>`;
    }
    
    // Next button
    paginationHTML += `
        <button onclick="changePage(${currentPage + 1})" ${currentPage === totalPages ? 'disabled' : ''}>
            <i class="fas fa-chevron-right"></i>
        </button>
    `;
    
    pagination.innerHTML = paginationHTML;
}

// Change page
function changePage(page) {
    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
    
    if (page < 1 || page > totalPages) return;
    
    currentPage = page;
    renderProducts();
    
    // Scroll to top of products
    document.getElementById('products-grid').scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
    });
}

// Update results count
function updateResultsCount() {
    const resultsCount = document.getElementById('results-count');
    if (resultsCount) {
        const count = filteredProducts.length;
        const productText = count === 1 ? 'product' : 'products';
        resultsCount.textContent = `${count} ${productText} found`;
    }
}

// Filter by category (for category buttons)
function filterByCategory(category) {
    const categoryFilter = document.getElementById('category-filter');
    if (categoryFilter) {
        categoryFilter.value = category;
    }
    applyFilters();
}

// Apply promo code
function applyPromoCode() {
    const promoInput = document.getElementById('promo-code');
    const promoStatus = document.getElementById('promo-status');
    
    if (!promoInput || !promoStatus) return;
    
    const code = promoInput.value.trim().toUpperCase();
    
    if (!code) {
        showPromoStatus('Please enter a promo code', 'error');
        return;
    }
    
    // Check if promo code exists and is valid
    if (!promoCodes[code] || !promoCodes[code].active) {
        showPromoStatus('Invalid or expired promo code', 'error');
        return;
    }
    
    const promo = promoCodes[code];
    
    // Check minimum order requirement
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    if (promo.min_order && subtotal < promo.min_order) {
        showPromoStatus(`Minimum order of ৳${promo.min_order} required`, 'error');
        return;
    }
    
    // Check expiry date
    if (promo.expiry) {
        const expiryDate = new Date(promo.expiry);
        const now = new Date();
        if (now > expiryDate) {
            showPromoStatus('This promo code has expired', 'error');
            return;
        }
    }
    
    // Apply the promo code
    cart.promoCode = {
        code: code,
        discount: promo.discount,
        type: promo.type,
        description: promo.description
    };
    
    showPromoStatus(`✅ Promo applied: ${promo.description}`, 'success');
    updateCartUI();
    saveCartToStorage();
    
    // Clear the input
    promoInput.value = '';
}

// Initialize promo codes if not loaded
if (!window.cart) {
    window.cart = [];
}
if (!window.cart.promoCode) {
    window.cart.promoCode = null;
}

// Show promo status
function showPromoStatus(message, type) {
    const promoStatus = document.getElementById('promo-status');
    if (promoStatus) {
        promoStatus.textContent = message;
        promoStatus.className = `promo-status ${type}`;
        
        setTimeout(() => {
            promoStatus.textContent = '';
            promoStatus.className = 'promo-status';
        }, 3000);
    }
}

// Calculate delivery fee based on location
function calculateDeliveryFee() {
    const district = document.getElementById('customer-district');
    const thana = document.getElementById('customer-thana');
    const deliveryFeeElements = document.querySelectorAll('#delivery-fee, #checkout-delivery-fee');
    
    if (!district || !thana) return 80; // Default fee
    
    let fee = 80; // Default for Dhaka metro
    
    const districtValue = district.value;
    const thanaValue = thana.value;
    
    // Dhaka metro areas (lower fee)
    const dhakaMetroThanas = [
        'Dhanmondi', 'Gulshan', 'Banani', 'Uttara', 'Mirpur', 
        'Mohammadpur', 'Old Dhaka', 'Wari', 'Ramna', 'Tejgaon'
    ];
    
    if (districtValue === 'Dhaka' && dhakaMetroThanas.includes(thanaValue)) {
        fee = 80;
    } else if (districtValue === 'Dhaka') {
        fee = 120; // Dhaka but outside metro
    } else {
        fee = 150; // Outside Dhaka
    }
    
    // Update delivery fee display
    deliveryFeeElements.forEach(element => {
        if (element) element.textContent = fee;
    });
    
    // Update cart total
    updateCartUI();
    
    return fee;
}

// Export functions for global access
window.changePage = changePage;
window.selectSuggestion = selectSuggestion;
window.applyPromoCode = applyPromoCode;
window.calculateDeliveryFee = calculateDeliveryFee;
