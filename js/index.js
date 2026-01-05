// ==========================================
// MAIN.JS - UI Interactions & Event Handlers
// ==========================================

// Open cart sidebar
function openCart() {
  const cartSidebar = document.getElementById('cartSidebar');
  const overlay = document.getElementById('overlay');
  
  if (cartSidebar && overlay) {
    cartSidebar.classList.add('active');
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevent scrolling
  }
}

// Close cart sidebar
function closeCart() {
  const cartSidebar = document.getElementById('cartSidebar');
  const overlay = document.getElementById('overlay');
  
  if (cartSidebar && overlay) {
    cartSidebar.classList.remove('active');
    overlay.classList.remove('active');
    document.body.style.overflow = ''; // Restore scrolling
  }
}

// Toggle cart (open if closed, close if open)
function toggleCart() {
  const cartSidebar = document.getElementById('cartSidebar');
  
  if (cartSidebar && cartSidebar.classList.contains('active')) {
    closeCart();
  } else {
    openCart();
  }
}

// Initialize event listeners when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  
  // ==========================================
  // CART BUTTON - Open cart sidebar
  // ==========================================
  const cartBtn = document.getElementById('cartBtn');
  if (cartBtn) {
    cartBtn.addEventListener('click', openCart);
  }
  
  // ==========================================
  // CLOSE CART BUTTON
  // ==========================================
  const closeCartBtn = document.getElementById('closeCart');
  if (closeCartBtn) {
    closeCartBtn.addEventListener('click', closeCart);
  }
  
  // ==========================================
  // OVERLAY - Close cart when clicking outside
  // ==========================================
  const overlay = document.getElementById('overlay');
  if (overlay) {
    overlay.addEventListener('click', closeCart);
  }
  
  // ==========================================
  // ADD TO CART BUTTONS - Using Event Delegation
  // This prevents duplicate listeners on menu page
  // ==========================================
  document.body.addEventListener('click', (e) => {
    // Check if clicked element is an "add to cart" button
    const button = e.target.closest('.add-to-cart');
    
    if (button) {
      // Get product data from button attributes
      const id = button.getAttribute('data-id');
      const name = button.getAttribute('data-name');
      const price = button.getAttribute('data-price');
      
      // Get image from parent card
      const card = button.closest('.menu-card, .menu-item');
      const image = card ? card.querySelector('img')?.src : '';
      
      // Add to cart
      addToCart(id, name, price, image);
      
      // Add button animation
      button.style.transform = 'scale(0.9)';
      setTimeout(() => {
        button.style.transform = 'scale(1)';
      }, 200);
    }
  });
  
  // ==========================================
  // SMOOTH SCROLL for anchor links
  // ==========================================
  const anchorLinks = document.querySelectorAll('a[href^="#"]');
  
  anchorLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      
      // Skip if href is just "#"
      if (href === '#') return;
      
      e.preventDefault();
      
      const targetId = href.substring(1);
      const targetElement = document.getElementById(targetId);
      
      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
  
  // ==========================================
  // NAVBAR - Add shadow on scroll
  // ==========================================
  const navbar = document.querySelector('header');
  
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar?.classList.add('scrolled');
    } else {
      navbar?.classList.remove('scrolled');
    }
  });
  
  // ==========================================
  // CLOSE CART with ESC key
  // ==========================================
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const cartSidebar = document.getElementById('cartSidebar');
      if (cartSidebar && cartSidebar.classList.contains('active')) {
        closeCart();
      }
    }
  });
  
  // ==========================================
  // ANIMATION - Fade in elements on scroll
  // ==========================================
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('fade-in');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);
  
  // Observe all menu cards
  const menuCards = document.querySelectorAll('.menu-card');
  menuCards.forEach(card => {
    observer.observe(card);
  });
  
  // ==========================================
  // LOG: Ready message
  // ==========================================
  console.log('🍴 Crispy Kitchen - Website loaded successfully!');
  console.log('Cart system initialized ✓');
});

// ==========================================
// UTILITY FUNCTIONS
// ==========================================

// Format price
function formatPrice(price) {
  return `$${parseFloat(price).toFixed(2)}`;
}

// Debounce function (useful for search, resize events)
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}