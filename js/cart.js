// ==========================================
// CART.JS - Shopping Cart Functionality
// ==========================================

// Cart array - stores all cart items
let cart = [];

// Load cart from localStorage on page load
function loadCart() {
  try {
    const savedCart = localStorage.getItem('crispyKitchenCart');
    if (savedCart) {
      cart = JSON.parse(savedCart);
      updateCartUI();
      updateCartCount();
    }
  } catch (error) {
    console.error('Error loading cart:', error);
    cart = [];
  }
}

// Save cart to localStorage
function saveCart() {
  localStorage.setItem('crispyKitchenCart', JSON.stringify(cart));
}

// Add item to cart
function addToCart(id, name, price, image = '') {
  // Check if item already exists in cart
  const existingItem = cart.find(item => item.id === id);
  
  if (existingItem) {
    // Item exists, increase quantity
    existingItem.quantity++;
  } else {
    // New item, add to cart
    cart.push({
      id: id,
      name: name,
      price: parseFloat(price),
      quantity: 1,
      image: image
    });
  }
  
  saveCart();
  updateCartUI();
  updateCartCount();
  showNotification(`${name} added to cart!`);
}

// Remove item from cart
function removeFromCart(id) {
  const item = cart.find(item => item.id === id);
  const itemName = item ? item.name : 'Item';
  
  cart = cart.filter(item => item.id !== id);
  
  saveCart();
  updateCartUI();
  updateCartCount();
  showNotification(`${itemName} removed from cart`);
}

// Update item quantity
function updateQuantity(id, change) {
  const item = cart.find(item => item.id === id);
  
  if (item) {
    item.quantity += change;
    
    // Remove item if quantity is 0 or less
    if (item.quantity <= 0) {
      removeFromCart(id);
      return;
    }
    
    saveCart();
    updateCartUI();
    updateCartCount();
  }
}

// Calculate total price
function calculateTotal() {
  return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

// Update cart count badge
function updateCartCount() {
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartCountElement = document.getElementById('cartCount');
  
  if (cartCountElement) {
    cartCountElement.textContent = totalItems;
    
    // Add animation when count changes
    cartCountElement.style.transform = 'scale(1.3)';
    setTimeout(() => {
      cartCountElement.style.transform = 'scale(1)';
    }, 200);
  }
}

// Update cart UI (sidebar content)
function updateCartUI() {
  const cartItemsContainer = document.getElementById('cartItems');
  const totalPriceElement = document.getElementById('totalPrice');
  
  if (!cartItemsContainer) return;
  
  // Clear existing content
  cartItemsContainer.innerHTML = '';
  
  if (cart.length === 0) {
    // Show empty cart message
    cartItemsContainer.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
    if (totalPriceElement) {
      totalPriceElement.textContent = '$0.00';
    }
    return;
  }
  
  // Generate cart items HTML
  cart.forEach(item => {
    const cartItemHTML = `
      <div class="cart-item" data-id="${item.id}">
        ${item.image ? `<img src="${item.image}" alt="${item.name}" class="cart-item-image">` : ''}
        <div class="cart-item-info">
          <h4 class="cart-item-name">${item.name}</h4>
          <p class="cart-item-price">$${item.price.toFixed(2)} × ${item.quantity}</p>
          <p class="cart-item-subtotal">$${(item.price * item.quantity).toFixed(2)}</p>
          <div class="cart-item-quantity">
            <button class="quantity-btn decrease-btn" onclick="updateQuantity('${item.id}', -1)">
              <i class="fa-solid fa-minus"></i>
            </button>
            <span class="quantity">${item.quantity}</span>
            <button class="quantity-btn increase-btn" onclick="updateQuantity('${item.id}', 1)">
              <i class="fa-solid fa-plus"></i>
            </button>
          </div>
        </div>
        <button class="remove-item" onclick="removeFromCart('${item.id}')" aria-label="Remove item">
          <i class="fa-solid fa-trash"></i>
        </button>
      </div>
    `;
    
    cartItemsContainer.innerHTML += cartItemHTML;
  });
  
  // Update total price
  const total = calculateTotal();
  if (totalPriceElement) {
    totalPriceElement.textContent = `$${total.toFixed(2)}`;
  }
}

// Show notification (toast message)
function showNotification(message) {
  // Remove existing notification if any
  const existingNotification = document.querySelector('.notification');
  if (existingNotification) {
    existingNotification.remove();
  }
  
  // Create notification element
  const notification = document.createElement('div');
  notification.className = 'notification';
  notification.innerHTML = `
    <i class="fa-solid fa-check-circle"></i>
    <span>${message}</span>
  `;
  
  document.body.appendChild(notification);
  
  // Show notification
  setTimeout(() => {
    notification.classList.add('show');
  }, 100);
  
  // Hide and remove notification after 3 seconds
  setTimeout(() => {
    notification.classList.remove('show');
    setTimeout(() => {
      notification.remove();
    }, 300);
  }, 3000);
}

// Clear entire cart
function clearCart() {
  if (confirm('Are you sure you want to clear your cart?')) {
    cart = [];
    saveCart();
    updateCartUI();
    updateCartCount();
    showNotification('Cart cleared');
  }
}

// Checkout function (placeholder)
function checkout() {
  if (cart.length === 0) {
    showNotification('Your cart is empty! Add some items first.', 'warning');
    return;
  }
  
  const checkoutBtn = document.querySelector('.btn-checkout');
  const originalText = checkoutBtn.innerHTML;
  
  // Show loading state
  checkoutBtn.disabled = true;
  checkoutBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Processing...';
  
  // Track analytics
  if (window.gtag) {
    gtag('event', 'begin_checkout', {
      currency: 'USD',
      value: calculateTotal(),
      items: cart.map(item => ({
        item_id: item.id,
        item_name: item.name,
        price: item.price,
        quantity: item.quantity
      }))
    });
  }
  
  // Simulate checkout (in real app, this would be an API call)
  setTimeout(() => {
    // Success
    showNotification('Order placed successfully! 🎉', 'success');
    
    // Clear cart
    cart = [];
    saveCart();
    updateCartUI();
    updateCartCount();
    closeCart();
    
    // Reset button
    checkoutBtn.disabled = false;
    checkoutBtn.innerHTML = originalText;
    
    // In real app: redirect to order confirmation page
    // window.location.href = '/order-confirmation?id=12345';
    
  }, 1500);
}
  
  // In a real app, you would:
  // 1. Send cart data to backend
  // 2. Process payment
  // 3. Clear cart after successful payment
  
  // For demo, we'll just clear the cart
  // cart = [];
  // saveCart();
  // updateCartUI();
  // updateCartCount();
  // closeCart();


// Initialize cart on page load
document.addEventListener('DOMContentLoaded', () => {
  loadCart();
  
  // Add click handler to checkout button
  const checkoutBtn = document.querySelector('.btn-checkout');
  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', checkout);
  }
});