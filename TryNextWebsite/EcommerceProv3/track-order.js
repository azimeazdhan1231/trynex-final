
// Track Order JavaScript
let orders = {};

// Initialize Track Order Page
document.addEventListener('DOMContentLoaded', function() {
    if (window.location.pathname.includes('track-order.html')) {
        initializeTrackOrderPage();
    }
});

function initializeTrackOrderPage() {
    loadOrdersFromStorage();
    setupTrackOrderEventListeners();
    
    // Check if there's an order ID in URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const orderId = urlParams.get('orderId');
    if (orderId) {
        document.getElementById('order-id-input').value = orderId;
        trackOrder();
    }
}

// Setup event listeners
function setupTrackOrderEventListeners() {
    const orderInput = document.getElementById('order-id-input');
    if (orderInput) {
        orderInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                trackOrder();
            }
        });
    }
}

// Track order function
function trackOrder() {
    const orderInput = document.getElementById('order-id-input');
    const orderId = orderInput.value.trim().toUpperCase();
    
    if (!orderId) {
        showErrorMessage('Please enter an order ID');
        return;
    }
    
    showLoading();
    
    // Simulate API call delay
    setTimeout(() => {
        hideLoading();
        
        const order = getOrderById(orderId);
        
        if (order) {
            displayOrderStatus(order);
        } else {
            showOrderNotFound();
        }
    }, 1500);
}

// Get order by ID
function getOrderById(orderId) {
    // Check local storage orders array
    const localOrders = JSON.parse(localStorage.getItem('trynex_orders') || '[]');
    
    // Find order by order_id field
    const order = localOrders.find(o => o.order_id === orderId);
    
    if (order) {
        return order;
    }
    
    // If no order found, generate demo order for testing
    if (orderId.startsWith('TRX-')) {
        return generateDemoOrder(orderId);
    }
    
    return null;
}

// Generate demo order for testing
function generateDemoOrder(orderId) {
    const statuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered'];
    const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
    
    return {
        order_id: orderId,
        customer_name: 'Demo Customer',
        customer_phone: '01712345678',
        customer_address: 'House 123, Road 456, Dhanmondi',
        district: 'Dhaka',
        thana: 'Dhanmondi',
        items: JSON.stringify([
            { name: 'Classic Ceramic Mug', quantity: 2, price: 550 },
            { name: 'Premium T-Shirt', quantity: 1, price: 600 }
        ]),
        total: 1780,
        subtotal: 1700,
        discount: 0,
        delivery_fee: 80,
        payment_method: 'bkash',
        transaction_id: 'BKS123456789',
        status: randomStatus,
        payment_status: randomStatus === 'delivered' ? 'paid' : 'partial',
        date: new Date().toISOString(),
        special_instructions: 'Please handle with care'
    };
}

// Generate demo order for testing
function generateDemoOrder(orderId) {
    const statuses = ['placed', 'confirmed', 'processing', 'shipped', 'delivered'];
    const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
    
    return {
        id: orderId,
        status: randomStatus,
        customer: {
            name: 'Demo Customer',
            phone: '01712345678',
            district: 'Dhaka',
            thana: 'Dhanmondi',
            address: 'House 123, Road 456, Dhanmondi'
        },
        items: [
            { name: 'Classic Ceramic Mug', quantity: 2, price: 550 },
            { name: 'Premium T-Shirt', quantity: 1, price: 600 }
        ],
        totals: {
            subtotal: 1700,
            deliveryFee: 80,
            discount: 0,
            total: 1780
        },
        payment: {
            method: 'bKash',
            status: 'paid',
            transactionId: 'BKS123456789',
            advancePaid: 100,
            remaining: 1680
        },
        timestamps: {
            placed: new Date(Date.now() - 86400000 * 2).toLocaleString(),
            confirmed: randomStatus !== 'placed' ? new Date(Date.now() - 86400000 * 1.5).toLocaleString() : null,
            processing: ['processing', 'shipped', 'delivered'].includes(randomStatus) ? new Date(Date.now() - 86400000).toLocaleString() : null,
            shipped: ['shipped', 'delivered'].includes(randomStatus) ? new Date(Date.now() - 43200000).toLocaleString() : null,
            delivered: randomStatus === 'delivered' ? new Date().toLocaleString() : null
        },
        specialInstructions: 'Please handle with care'
    };
}

// Display order status
function displayOrderStatus(order) {
    const orderStatus = document.getElementById('order-status');
    const orderNotFound = document.getElementById('order-not-found');
    
    if (orderStatus) orderStatus.style.display = 'block';
    if (orderNotFound) orderNotFound.style.display = 'none';
    
    // Update order ID display
    const orderIdDisplay = document.getElementById('display-order-id');
    if (orderIdDisplay) orderIdDisplay.textContent = order.id;
    
    // Update customer details
    updateCustomerDetails(order.customer);
    
    // Update order items
    updateOrderItems(order.items);
    
    // Update order summary
    updateOrderSummary(order.totals);
    
    // Update timeline
    updateTimeline(order.status, order.timestamps);
    
    // Update additional info
    updateDeliveryInfo(order.customer);
    updatePaymentInfo(order.payment);
}

// Update customer details
function updateCustomerDetails(customer) {
    const customerDetails = document.getElementById('customer-details');
    if (!customerDetails) return;
    
    customerDetails.innerHTML = `
        <div class="detail-row">
            <strong>Name:</strong> ${customer.name}
        </div>
        <div class="detail-row">
            <strong>Phone:</strong> ${customer.phone}
        </div>
        <div class="detail-row">
            <strong>Address:</strong> ${customer.address}, ${customer.thana}, ${customer.district}
        </div>
    `;
}

// Update order items
function updateOrderItems(items) {
    const orderItemsList = document.getElementById('order-items-list');
    if (!orderItemsList) return;
    
    orderItemsList.innerHTML = items.map(item => `
        <div class="order-item">
            <div class="item-details">
                <span class="item-name">${item.name}</span>
                <span class="item-quantity">Qty: ${item.quantity}</span>
            </div>
            <div class="item-price">৳${item.price * item.quantity}</div>
        </div>
    `).join('');
}

// Update order summary
function updateOrderSummary(totals) {
    const orderTotalDetails = document.getElementById('order-total-details');
    if (!orderTotalDetails) return;
    
    orderTotalDetails.innerHTML = `
        <div class="summary-row">
            <span>Subtotal:</span>
            <span>৳${totals.subtotal}</span>
        </div>
        ${totals.discount > 0 ? `
        <div class="summary-row">
            <span>Discount:</span>
            <span class="discount">-৳${totals.discount}</span>
        </div>
        ` : ''}
        <div class="summary-row">
            <span>Delivery Fee:</span>
            <span>৳${totals.deliveryFee}</span>
        </div>
        <div class="summary-row total">
            <span><strong>Total:</strong></span>
            <span><strong>৳${totals.total}</strong></span>
        </div>
    `;
}

// Update timeline
function updateTimeline(currentStatus, timestamps) {
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    const statusOrder = ['placed', 'confirmed', 'processing', 'shipped', 'delivered'];
    const currentIndex = statusOrder.indexOf(currentStatus);
    
    timelineItems.forEach((item, index) => {
        const status = item.dataset.status;
        const statusIndex = statusOrder.indexOf(status);
        
        // Remove all status classes
        item.classList.remove('active', 'completed');
        
        if (statusIndex < currentIndex) {
            item.classList.add('completed');
        } else if (statusIndex === currentIndex) {
            item.classList.add('active');
        }
        
        // Update timestamp
        const timestampElement = item.querySelector('.timestamp');
        if (timestampElement && timestamps[status]) {
            timestampElement.textContent = timestamps[status];
        }
    });
}

// Update delivery info
function updateDeliveryInfo(customer) {
    const deliveryInfo = document.getElementById('delivery-info');
    if (!deliveryInfo) return;
    
    deliveryInfo.innerHTML = `
        <div class="info-row">
            <strong>Delivery Address:</strong><br>
            ${customer.address}<br>
            ${customer.thana}, ${customer.district}
        </div>
        <div class="info-row">
            <strong>Contact Number:</strong><br>
            ${customer.phone}
        </div>
        <div class="info-row">
            <strong>Estimated Delivery:</strong><br>
            2-3 business days
        </div>
    `;
}

// Update payment info
function updatePaymentInfo(payment) {
    const paymentInfo = document.getElementById('payment-info');
    if (!paymentInfo) return;
    
    paymentInfo.innerHTML = `
        <div class="info-row">
            <strong>Payment Method:</strong><br>
            ${payment.method}
        </div>
        <div class="info-row">
            <strong>Payment Status:</strong><br>
            <span class="status-badge ${payment.status}">${payment.status.toUpperCase()}</span>
        </div>
        ${payment.transactionId ? `
        <div class="info-row">
            <strong>Transaction ID:</strong><br>
            ${payment.transactionId}
        </div>
        ` : ''}
        <div class="info-row">
            <strong>Advance Paid:</strong><br>
            ৳${payment.advancePaid}
        </div>
        <div class="info-row">
            <strong>Remaining:</strong><br>
            ৳${payment.remaining}
        </div>
    `;
}

// Show order not found
function showOrderNotFound() {
    const orderStatus = document.getElementById('order-status');
    const orderNotFound = document.getElementById('order-not-found');
    
    if (orderStatus) orderStatus.style.display = 'none';
    if (orderNotFound) orderNotFound.style.display = 'block';
}

// Clear tracking form
function clearTrackingForm() {
    const orderInput = document.getElementById('order-id-input');
    const orderStatus = document.getElementById('order-status');
    const orderNotFound = document.getElementById('order-not-found');
    
    if (orderInput) orderInput.value = '';
    if (orderStatus) orderStatus.style.display = 'none';
    if (orderNotFound) orderNotFound.style.display = 'none';
    
    orderInput.focus();
}

// Load orders from storage
function loadOrdersFromStorage() {
    try {
        const storedOrders = localStorage.getItem('trynex_orders');
        if (storedOrders) {
            orders = JSON.parse(storedOrders);
        }
    } catch (error) {
        console.error('Error loading orders from storage:', error);
        orders = {};
    }
}

// Export functions for global access
window.trackOrder = trackOrder;
window.clearTrackingForm = clearTrackingForm;
// Track Order JavaScript
document.addEventListener('DOMContentLoaded', function() {
    setupTrackingEventListeners();
    loadCartFromStorage();
    updateCartUI();
});

function setupTrackingEventListeners() {
    const orderInput = document.getElementById('order-id-input');
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');

    // Enter key support for tracking
    if (orderInput) {
        orderInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                trackOrder();
            }
        });
    }

    // Mobile menu toggle
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', (e) => {
            e.stopPropagation();
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!navMenu.contains(e.target) && !hamburger.contains(e.target)) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    }

    // Cart functionality
    const cartBtn = document.getElementById('cart-btn');
    if (cartBtn) {
        cartBtn.addEventListener('click', () => {
            // Redirect to products page for cart functionality
            window.location.href = 'products.html';
        });
    }
}

// Track order function
function trackOrder() {
    const orderIdInput = document.getElementById('order-id-input');
    const orderId = orderIdInput.value.trim().toUpperCase();

    if (!orderId) {
        showErrorMessage('Please enter an order ID');
        return;
    }

    if (!isValidOrderId(orderId)) {
        showErrorMessage('Please enter a valid order ID (e.g., TRX-ABC123-XYZ)');
        return;
    }

    showLoading();

    // Simulate loading time
    setTimeout(() => {
        hideLoading();
        searchOrder(orderId);
    }, 1500);
}

// Validate order ID format
function isValidOrderId(orderId) {
    const pattern = /^TRX-[A-Z0-9]+-[A-Z0-9]+$/;
    return pattern.test(orderId);
}

// Search for order
function searchOrder(orderId) {
    const orders = JSON.parse(localStorage.getItem('trynex_orders') || '[]');
    const order = orders.find(o => o.order_id === orderId);

    if (order) {
        displayOrderStatus(order);
    } else {
        showOrderNotFound();
    }
}

// Display order status
function displayOrderStatus(order) {
    const orderStatus = document.getElementById('order-status');
    const orderNotFound = document.getElementById('order-not-found');

    if (orderNotFound) orderNotFound.style.display = 'none';

    // Populate order details safely
    const displayOrderId = document.getElementById('display-order-id');
    const displayOrderDate = document.getElementById('display-order-date');
    const displayTotalAmount = document.getElementById('display-total-amount');
    const displayPaymentMethod = document.getElementById('display-payment-method');
    const displayCustomerName = document.getElementById('display-customer-name');
    const displayCustomerPhone = document.getElementById('display-customer-phone');
    const displayCustomerAddress = document.getElementById('display-customer-address');

    if (displayOrderId) displayOrderId.textContent = order.order_id || 'N/A';
    if (displayOrderDate) displayOrderDate.textContent = formatDate(order.date);
    if (displayTotalAmount) displayTotalAmount.textContent = `৳${order.total || 0}`;
    if (displayPaymentMethod) displayPaymentMethod.textContent = formatPaymentMethod(order.payment_method);
    if (displayCustomerName) displayCustomerName.textContent = order.customer_name || 'N/A';
    if (displayCustomerPhone) displayCustomerPhone.textContent = order.customer_phone || 'N/A';
    if (displayCustomerAddress) {
        displayCustomerAddress.textContent = `${order.customer_address || ''}, ${order.thana || ''}, ${order.district || ''}`;
    }

    // Update status badge
    const statusBadge = document.getElementById('order-status-badge');
    if (statusBadge) {
        statusBadge.textContent = formatStatus(order.status || 'pending');
        statusBadge.className = `order-status-badge status-${order.status || 'pending'}`;
    }

    // Update timeline
    updateTimeline(order);

    // Display order items
    displayOrderItems(order.items);

    // Show order status section
    if (orderStatus) orderStatus.style.display = 'block';
}

// Format date
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Format payment method
function formatPaymentMethod(method) {
    const methods = {
        'bkash': 'bKash',
        'nagad': 'Nagad',
        'rocket': 'Rocket',
        'cash': 'Cash on Delivery'
    };
    return methods[method] || method;
}

// Format status
function formatStatus(status) {
    const statuses = {
        'pending': 'Pending',
        'confirmed': 'Confirmed',
        'processing': 'Processing',
        'shipped': 'Shipped',
        'delivered': 'Delivered',
        'cancelled': 'Cancelled'
    };
    return statuses[status] || status;
}

// Update timeline based on order status
function updateTimeline(order) {
    const timelineItems = document.querySelectorAll('.timeline-item');
    const statusOrder = ['pending', 'confirmed', 'processing', 'shipped', 'delivered'];
    const currentStatusIndex = statusOrder.indexOf(order.status);

    timelineItems.forEach((item, index) => {
        if (index <= currentStatusIndex) {
            item.classList.add('completed');
        } else if (index === currentStatusIndex + 1) {
            item.classList.add('active');
        } else {
            item.classList.remove('completed', 'active');
        }
    });

    // Update timestamps (in a real application, these would come from the backend)
    const orderDate = new Date(order.date);
    document.getElementById('timestamp-placed').textContent = formatDate(orderDate);

    if (order.status !== 'pending') {
        const confirmDate = new Date(orderDate.getTime() + 24 * 60 * 60 * 1000); // +1 day
        document.getElementById('timestamp-payment').textContent = formatDate(confirmDate);
    }

    if (currentStatusIndex >= 2) {
        const processingDate = new Date(orderDate.getTime() + 2 * 24 * 60 * 60 * 1000); // +2 days
        document.getElementById('timestamp-processing').textContent = formatDate(processingDate);
    }

    if (currentStatusIndex >= 3) {
        const shippedDate = new Date(orderDate.getTime() + 3 * 24 * 60 * 60 * 1000); // +3 days
        document.getElementById('timestamp-shipped').textContent = formatDate(shippedDate);
    }

    if (currentStatusIndex >= 4) {
        const deliveredDate = new Date(orderDate.getTime() + 5 * 24 * 60 * 60 * 1000); // +5 days
        document.getElementById('timestamp-delivered').textContent = formatDate(deliveredDate);
    }
}

// Display order items
function displayOrderItems(itemsJson) {
    const itemsList = document.getElementById('order-items-list');
    
    try {
        const items = JSON.parse(itemsJson);
        
        itemsList.innerHTML = items.map(item => `
            <div class="order-item">
                <div class="item-info">
                    <h5>${item.name}</h5>
                    <p>Quantity: ${item.quantity}</p>
                    <p>Price: ৳${item.price} each</p>
                </div>
                <div class="item-total">
                    <strong>৳${item.price * item.quantity}</strong>
                </div>
            </div>
        `).join('');
    } catch (error) {
        itemsList.innerHTML = '<p>Error loading order items</p>';
    }
}

// Show order not found
function showOrderNotFound() {
    const orderStatus = document.getElementById('order-status');
    const orderNotFound = document.getElementById('order-not-found');

    orderStatus.style.display = 'none';
    orderNotFound.style.display = 'block';
}

// Retry tracking
function retryTracking() {
    const orderNotFound = document.getElementById('order-not-found');
    const orderInput = document.getElementById('order-id-input');

    orderNotFound.style.display = 'none';
    orderInput.value = '';
    orderInput.focus();
}

// Loading and error message functions
function showLoading() {
    const loadingOverlay = document.getElementById('loading-overlay');
    if (loadingOverlay) {
        loadingOverlay.classList.add('active');
    }
}

function hideLoading() {
    const loadingOverlay = document.getElementById('loading-overlay');
    if (loadingOverlay) {
        loadingOverlay.classList.remove('active');
    }
}

function showErrorMessage(message) {
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

// Export functions for global access
window.trackOrder = trackOrder;
window.retryTracking = retryTracking;
