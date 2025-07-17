
// Track Order Page Functionality
let currentOrder = null;

document.addEventListener('DOMContentLoaded', function() {
    initializeTrackOrder();
});

function initializeTrackOrder() {
    const trackBtn = document.getElementById('track-btn');
    const orderIdInput = document.getElementById('order-id-input');
    
    // Setup event listeners
    if (trackBtn) {
        trackBtn.addEventListener('click', trackOrder);
    }
    
    if (orderIdInput) {
        orderIdInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                trackOrder();
            }
        });
        
        // Format input as user types
        orderIdInput.addEventListener('input', function() {
            this.value = this.value.toUpperCase();
        });
    }
    
    // Check for order ID in URL
    const urlParams = new URLSearchParams(window.location.search);
    const orderId = urlParams.get('id');
    if (orderId) {
        orderIdInput.value = orderId;
        trackOrder();
    }
    
    // Load recent orders
    loadRecentOrders();
    
    // Auto-refresh order status every 30 seconds if order is active
    setInterval(() => {
        if (currentOrder && ['pending', 'confirmed', 'processing', 'shipped'].includes(currentOrder.status)) {
            refreshOrderStatus();
        }
    }, 30000);
}

function trackOrder() {
    const orderIdInput = document.getElementById('order-id-input');
    const orderId = orderIdInput.value.trim();
    
    if (!orderId) {
        showError('Please enter an Order ID');
        return;
    }
    
    if (!isValidOrderId(orderId)) {
        showError('Invalid Order ID format. Please check and try again.');
        return;
    }
    
    // Show loading
    showLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
        const order = findOrder(orderId);
        showLoading(false);
        
        if (order) {
            displayOrder(order);
            currentOrder = order;
            
            // Update URL
            const url = new URL(window.location);
            url.searchParams.set('id', orderId);
            window.history.replaceState({}, '', url);
        } else {
            showNoOrder();
        }
    }, 1000);
}

function isValidOrderId(orderId) {
    // TryneX order ID format: TRX + 6 digits + 5 letters
    const pattern = /^TRX\d{6}[A-Z]{5}$/;
    return pattern.test(orderId);
}

function findOrder(orderId) {
    // First check localStorage for orders
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    let order = orders.find(o => o.id === orderId);
    
    if (order) {
        return order;
    }
    
    // Demo orders for testing
    const demoOrders = {
        'TRX123456ABCDE': {
            id: 'TRX123456ABCDE',
            status: 'shipped',
            paymentStatus: 'paid',
            total: 1250,
            items: [
                {
                    id: 1,
                    name: 'Premium Ceramic Mug',
                    quantity: 2,
                    price: 550,
                    image: 'https://images.unsplash.com/photo-1514228742587-6b1558fcf93a?w=100&h=100&fit=crop'
                },
                {
                    id: 2,
                    name: 'Comfort T-Shirt',
                    quantity: 1,
                    price: 550,
                    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=100&h=100&fit=crop'
                }
            ],
            createdAt: '2025-01-15T10:30:00Z',
            estimatedDelivery: '2025-01-18T18:00:00Z',
            specialInstructions: 'Please wrap as a gift',
            timeline: {
                placed: '2025-01-15T10:30:00Z',
                confirmed: '2025-01-15T11:00:00Z',
                processing: '2025-01-15T14:00:00Z',
                shipped: '2025-01-16T09:00:00Z',
                delivered: null
            }
        },
        'TRX789012FGHIJ': {
            id: 'TRX789012FGHIJ',
            status: 'processing',
            paymentStatus: 'paid',
            total: 850,
            items: [
                {
                    id: 3,
                    name: 'Luxury Gift Hamper',
                    quantity: 1,
                    price: 1200,
                    image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=100&h=100&fit=crop'
                }
            ],
            createdAt: '2025-01-16T09:15:00Z',
            estimatedDelivery: '2025-01-19T18:00:00Z',
            specialInstructions: '',
            timeline: {
                placed: '2025-01-16T09:15:00Z',
                confirmed: '2025-01-16T09:45:00Z',
                processing: '2025-01-16T12:00:00Z',
                shipped: null,
                delivered: null
            }
        }
    };
    
    return demoOrders[orderId] || null;
}

function displayOrder(order) {
    const orderResult = document.getElementById('order-result');
    const noOrder = document.getElementById('no-order');
    
    if (orderResult) orderResult.classList.add('show');
    if (noOrder) noOrder.style.display = 'none';
    
    // Update order header
    const displayOrderId = document.getElementById('display-order-id');
    const orderDate = document.getElementById('order-date');
    const orderStatus = document.getElementById('order-status');
    
    if (displayOrderId) displayOrderId.textContent = `Order #${order.id}`;
    if (orderDate) orderDate.textContent = `Placed on ${formatDate(order.createdAt)}`;
    if (orderStatus) {
        orderStatus.textContent = getStatusText(order.status);
        orderStatus.className = `order-status status-${order.status}`;
    }
    
    // Update summary
    const orderTotal = document.getElementById('order-total');
    const paymentStatus = document.getElementById('payment-status');
    const estimatedDelivery = document.getElementById('estimated-delivery');
    const itemsCount = document.getElementById('items-count');
    
    if (orderTotal) orderTotal.textContent = `৳${order.total}`;
    if (paymentStatus) paymentStatus.textContent = order.paymentStatus === 'paid' ? 'Paid' : 'Pending';
    if (estimatedDelivery) estimatedDelivery.textContent = formatDate(order.estimatedDelivery, true);
    if (itemsCount) itemsCount.textContent = order.items.reduce((sum, item) => sum + item.quantity, 0);
    
    // Update timeline
    updateTimeline(order);
    
    // Update order items
    displayOrderItems(order.items);
    
    // Show special instructions if available
    if (order.specialInstructions) {
        const specialInstructions = document.getElementById('special-instructions');
        const instructionsText = document.getElementById('instructions-text');
        
        if (specialInstructions && instructionsText) {
            instructionsText.textContent = order.specialInstructions;
            specialInstructions.style.display = 'block';
        }
    }
}

function updateTimeline(order) {
    const timelineItems = document.querySelectorAll('.timeline-item');
    const statuses = ['placed', 'confirmed', 'processing', 'shipped', 'delivered'];
    
    timelineItems.forEach((item, index) => {
        const status = statuses[index];
        const timestamp = order.timeline[status];
        
        // Remove all classes
        item.classList.remove('completed', 'active');
        
        if (timestamp) {
            // Completed step
            item.classList.add('completed');
            const timestampElement = document.getElementById(`timestamp-${status}`);
            if (timestampElement) {
                timestampElement.textContent = formatDateTime(timestamp);
            }
        } else if (status === order.status) {
            // Current active step
            item.classList.add('active');
        }
    });
}

function displayOrderItems(items) {
    const itemsList = document.getElementById('order-items-list');
    if (!itemsList) return;
    
    itemsList.innerHTML = items.map(item => `
        <div class="order-item">
            <img src="${item.image}" alt="${item.name}" class="item-image">
            <div class="item-details">
                <div class="item-name">${item.name}</div>
                <div class="item-quantity">Quantity: ${item.quantity}</div>
            </div>
            <div class="item-price">৳${item.price * item.quantity}</div>
        </div>
    `).join('');
}

function showNoOrder() {
    const orderResult = document.getElementById('order-result');
    const noOrder = document.getElementById('no-order');
    
    if (orderResult) orderResult.classList.remove('show');
    if (noOrder) noOrder.style.display = 'block';
}

function showLoading(show) {
    const trackBtn = document.getElementById('track-btn');
    if (!trackBtn) return;
    
    if (show) {
        trackBtn.disabled = true;
        trackBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Tracking...';
    } else {
        trackBtn.disabled = false;
        trackBtn.innerHTML = '<i class="fas fa-search"></i> Track Order';
    }
}

function showError(message) {
    // Create error notification
    const notification = document.createElement('div');
    notification.className = 'error-notification';
    notification.innerHTML = `
        <i class="fas fa-exclamation-circle"></i>
        <span>${message}</span>
    `;
    
    notification.style.cssText = `
        position: fixed;
        top: 120px;
        right: 20px;
        background: #dc3545;
        color: white;
        padding: 1rem 1.5rem;
        border-radius: var(--radius-lg);
        box-shadow: var(--shadow-lg);
        z-index: var(--z-tooltip);
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-weight: 600;
        transform: translateX(100%);
        transition: var(--transition);
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => notification.remove(), 300);
    }, 4000);
}

function loadRecentOrders() {
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    const recentOrders = document.getElementById('recent-orders');
    const recentList = document.getElementById('recent-list');
    
    if (orders.length === 0) {
        if (recentOrders) recentOrders.style.display = 'none';
        return;
    }
    
    if (recentList) {
        const sortedOrders = orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5);
        
        recentList.innerHTML = sortedOrders.map(order => `
            <div class="recent-item" onclick="loadOrder('${order.id}')">
                <div class="recent-info">
                    <div class="recent-id">${order.id}</div>
                    <div class="recent-date">${formatDate(order.createdAt)}</div>
                </div>
                <div class="order-status status-${order.status}">
                    ${getStatusText(order.status)}
                </div>
            </div>
        `).join('');
    }
}

function loadOrder(orderId) {
    const orderIdInput = document.getElementById('order-id-input');
    if (orderIdInput) {
        orderIdInput.value = orderId;
        trackOrder();
    }
}

function refreshOrderStatus() {
    if (!currentOrder) return;
    
    // In a real application, this would make an API call
    // For demo, we'll simulate status updates
    const updatedOrder = findOrder(currentOrder.id);
    if (updatedOrder && updatedOrder.status !== currentOrder.status) {
        displayOrder(updatedOrder);
        currentOrder = updatedOrder;
        
        // Show notification of status change
        showStatusUpdateNotification(updatedOrder.status);
    }
}

function showStatusUpdateNotification(status) {
    const notification = document.createElement('div');
    notification.className = 'status-notification';
    notification.innerHTML = `
        <i class="fas fa-info-circle"></i>
        <span>Order status updated: ${getStatusText(status)}</span>
    `;
    
    notification.style.cssText = `
        position: fixed;
        top: 120px;
        right: 20px;
        background: var(--primary-gold);
        color: var(--primary-black);
        padding: 1rem 1.5rem;
        border-radius: var(--radius-lg);
        box-shadow: var(--shadow-lg);
        z-index: var(--z-tooltip);
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-weight: 600;
        transform: translateX(100%);
        transition: var(--transition);
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => notification.remove(), 300);
    }, 5000);
}

function contactSupport() {
    const whatsappNumber = '01747292277';
    let message = 'Hi! I need support regarding my order';
    
    if (currentOrder) {
        message = `Hi! I need support regarding my order ${currentOrder.id}. Current status: ${getStatusText(currentOrder.status)}`;
    }
    
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
}

function copyOrderId() {
    if (!currentOrder) return;
    
    navigator.clipboard.writeText(currentOrder.id).then(() => {
        // Show success notification
        const notification = document.createElement('div');
        notification.className = 'copy-notification';
        notification.innerHTML = `
            <i class="fas fa-check"></i>
            <span>Order ID copied to clipboard!</span>
        `;
        
        notification.style.cssText = `
            position: fixed;
            top: 120px;
            right: 20px;
            background: #28a745;
            color: white;
            padding: 1rem 1.5rem;
            border-radius: var(--radius-lg);
            box-shadow: var(--shadow-lg);
            z-index: var(--z-tooltip);
            display: flex;
            align-items: center;
            gap: 0.5rem;
            font-weight: 600;
            transform: translateX(100%);
            transition: var(--transition);
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    });
}

function printOrder() {
    if (!currentOrder) return;
    
    const printWindow = window.open('', '_blank');
    const printContent = generatePrintContent(currentOrder);
    
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.print();
}

function generatePrintContent(order) {
    return `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Order Details - ${order.id}</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 20px; }
                .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #d4af37; padding-bottom: 20px; }
                .order-info { margin-bottom: 20px; }
                .order-info table { width: 100%; border-collapse: collapse; }
                .order-info th, .order-info td { padding: 10px; border: 1px solid #ddd; text-align: left; }
                .order-info th { background-color: #f8f9fa; }
                .items-table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                .items-table th, .items-table td { padding: 12px; border: 1px solid #ddd; }
                .items-table th { background-color: #d4af37; color: white; }
                .total { text-align: right; font-weight: bold; font-size: 18px; margin-top: 20px; }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>TryneX</h1>
                <h2>Order Details</h2>
            </div>
            
            <div class="order-info">
                <table>
                    <tr><th>Order ID</th><td>${order.id}</td></tr>
                    <tr><th>Date</th><td>${formatDate(order.createdAt)}</td></tr>
                    <tr><th>Status</th><td>${getStatusText(order.status)}</td></tr>
                    <tr><th>Payment Status</th><td>${order.paymentStatus === 'paid' ? 'Paid' : 'Pending'}</td></tr>
                    <tr><th>Estimated Delivery</th><td>${formatDate(order.estimatedDelivery, true)}</td></tr>
                </table>
            </div>
            
            <table class="items-table">
                <thead>
                    <tr>
                        <th>Product</th>
                        <th>Quantity</th>
                        <th>Price</th>
                        <th>Total</th>
                    </tr>
                </thead>
                <tbody>
                    ${order.items.map(item => `
                        <tr>
                            <td>${item.name}</td>
                            <td>${item.quantity}</td>
                            <td>৳${item.price}</td>
                            <td>৳${item.price * item.quantity}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
            
            <div class="total">
                Total: ৳${order.total}
            </div>
            
            ${order.specialInstructions ? `
                <div style="margin-top: 20px;">
                    <strong>Special Instructions:</strong><br>
                    ${order.specialInstructions}
                </div>
            ` : ''}
            
            <div style="margin-top: 30px; text-align: center; color: #666;">
                <p>For support, contact us at 01747-292277</p>
                <p>Thank you for shopping with TryneX!</p>
            </div>
        </body>
        </html>
    `;
}

function clearSearch() {
    const orderIdInput = document.getElementById('order-id-input');
    const orderResult = document.getElementById('order-result');
    const noOrder = document.getElementById('no-order');
    
    if (orderIdInput) orderIdInput.value = '';
    if (orderResult) orderResult.classList.remove('show');
    if (noOrder) noOrder.style.display = 'none';
    
    currentOrder = null;
    
    // Clear URL parameters
    const url = new URL(window.location);
    url.search = '';
    window.history.replaceState({}, '', url);
}

// Utility functions
function getStatusText(status) {
    const statusTexts = {
        pending: 'Pending',
        confirmed: 'Confirmed',
        processing: 'Processing',
        shipped: 'Shipped',
        delivered: 'Delivered',
        cancelled: 'Cancelled'
    };
    return statusTexts[status] || status;
}

function formatDate(dateString, dateOnly = false) {
    const date = new Date(dateString);
    if (dateOnly) {
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

function formatDateTime(dateString) {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Make functions global
window.loadOrder = loadOrder;
window.contactSupport = contactSupport;
window.copyOrderId = copyOrderId;
window.printOrder = printOrder;
window.clearSearch = clearSearch;
