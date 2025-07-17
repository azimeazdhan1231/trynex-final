
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
    // First check local storage
    const localOrders = JSON.parse(localStorage.getItem('trynex_orders') || '{}');
    
    if (localOrders[orderId]) {
        return localOrders[orderId];
    }
    
    // If not found locally, generate a demo order for testing
    if (orderId.startsWith('TRX2025')) {
        return generateDemoOrder(orderId);
    }
    
    return null;
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
