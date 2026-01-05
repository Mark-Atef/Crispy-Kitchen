// ==========================================
// MOBILE.JS - Mobile Menu & Additional Features
// Create this as: js/mobile.js
// ==========================================

// ==========================================
// MOBILE HAMBURGER MENU
// ==========================================

function initMobileMenu() {
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileOverlay = document.getElementById('mobileOverlay');
  const mobileMenuLinks = document.querySelectorAll('.mobile-menu-overlay a');

  if (!hamburger || !mobileMenu) return;

  // Open/close menu when hamburger clicked
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    mobileMenu.classList.toggle('active');
    if (mobileOverlay) {
      mobileOverlay.classList.toggle('active');
    }
    
    // Prevent body scroll when menu is open
    if (mobileMenu.classList.contains('active')) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  });

  // Close menu when clicking a link
  mobileMenuLinks.forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      mobileMenu.classList.remove('active');
      if (mobileOverlay) {
        mobileOverlay.classList.remove('active');
      }
      document.body.style.overflow = '';
    });
  });

  // Close menu when clicking overlay
  if (mobileOverlay) {
    mobileOverlay.addEventListener('click', () => {
      hamburger.classList.remove('active');
      mobileMenu.classList.remove('active');
      mobileOverlay.classList.remove('active');
      document.body.style.overflow = '';
    });
  }

  // Close menu with ESC key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
      hamburger.classList.remove('active');
      mobileMenu.classList.remove('active');
      if (mobileOverlay) {
        mobileOverlay.classList.remove('active');
      }
      document.body.style.overflow = '';
    }
  });

  console.log('📱 Mobile menu initialized');
}

// ==========================================
// SCROLL TO TOP BUTTON
// ==========================================

function initScrollToTop() {
  const scrollBtn = document.getElementById('scrollToTop');
  
  if (!scrollBtn) return;

  // Show/hide button based on scroll position
  window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
      scrollBtn.classList.add('show');
    } else {
      scrollBtn.classList.remove('show');
    }
  });

  // Scroll to top when clicked
  scrollBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  console.log('⬆️ Scroll to top button initialized');
}

// ==========================================
// PAGE LOADER
// ==========================================

function initPageLoader() {
  const loader = document.getElementById('pageLoader');
  
  if (!loader) return;

  // Hide loader when page is fully loaded
  window.addEventListener('load', () => {
    setTimeout(() => {
      loader.classList.add('loaded');
      
      // Remove from DOM after animation
      setTimeout(() => {
        loader.style.display = 'none';
      }, 500);
    }, 300); // Small delay for better UX
  });

  console.log('⏳ Page loader initialized');
}

// ==========================================
// SMOOTH SCROLL FOR ANCHOR LINKS
// Already in index.js, but adding fallback
// ==========================================

function initSmoothScroll() {
  const anchorLinks = document.querySelectorAll('a[href^="#"]');
  
  anchorLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      
      if (href === '#' || href === '#!') return;
      
      const target = document.querySelector(href);
      
      if (target) {
        e.preventDefault();
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
}

// ==========================================
// LAZY LOADING IMAGES
// Improves performance by loading images only when visible
// ==========================================

function initLazyLoading() {
  const images = document.querySelectorAll('img[data-src]');
  
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
          observer.unobserve(img);
        }
      });
    });

    images.forEach(img => imageObserver.observe(img));
    
    console.log(`🖼️ Lazy loading ${images.length} images`);
  } else {
    // Fallback for older browsers
    images.forEach(img => {
      img.src = img.dataset.src;
    });
  }
}

// ==========================================
// KEYBOARD NAVIGATION IMPROVEMENTS
// ==========================================

function initKeyboardNavigation() {
  // Trap focus in mobile menu when open
  const mobileMenu = document.getElementById('mobileMenu');
  
  if (!mobileMenu) return;

  const focusableElements = mobileMenu.querySelectorAll(
    'a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );

  if (focusableElements.length === 0) return;

  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];

  mobileMenu.addEventListener('keydown', (e) => {
    if (!mobileMenu.classList.contains('active')) return;

    if (e.key === 'Tab') {
      if (e.shiftKey) {
        // Shift + Tab (going backwards)
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        // Tab (going forwards)
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    }
  });

  console.log('⌨️ Keyboard navigation improved');
}

// ==========================================
// PREVENT LAYOUT SHIFT
// Calculates and sets heights to prevent content jumping
// ==========================================

function preventLayoutShift() {
  const images = document.querySelectorAll('img');
  
  images.forEach(img => {
    if (!img.complete) {
      // Set aspect ratio to prevent layout shift
      img.style.aspectRatio = `${img.width} / ${img.height}`;
    }
  });
}

// ==========================================
// DETECT TOUCH DEVICE
// Adds class to body for touch-specific styles
// ==========================================

function detectTouchDevice() {
  if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
    document.body.classList.add('touch-device');
    console.log('📱 Touch device detected');
  } else {
    document.body.classList.add('no-touch');
    console.log('🖱️ Mouse device detected');
  }
}

// ==========================================
// PERFORMANCE MONITORING
// Logs page load performance (for development)
// ==========================================

function logPerformance() {
  if ('performance' in window) {
    window.addEventListener('load', () => {
      const perfData = performance.timing;
      const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
      
      console.log(`⚡ Page loaded in ${pageLoadTime}ms`);
    });
  }
}

// ==========================================
// INITIALIZE ALL FEATURES
// Called when DOM is ready
// ==========================================

function initAllFeatures() {
  initMobileMenu();
  initScrollToTop();
  initPageLoader();
  initSmoothScroll();
  initLazyLoading();
  initKeyboardNavigation();
  preventLayoutShift();
  detectTouchDevice();
  logPerformance();
  
  console.log('✅ All features initialized successfully!');
}

// Run when DOM is loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAllFeatures);
} else {
  initAllFeatures();
}

// ==========================================
// UTILITY: Debounce function
// Prevents functions from running too frequently
// ==========================================

function debounce(func, wait = 100) {
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

// ==========================================
// UTILITY: Throttle function
// Limits function execution to once per interval
// ==========================================

function throttle(func, limit = 100) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// Export for use in other files (if using modules)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    initMobileMenu,
    initScrollToTop,
    debounce,
    throttle
  };
}

// Prevent rubber band scrolling on iOS
document.body.addEventListener('touchmove', (e) => {
  if (document.querySelector('.cart-sidebar.active')) {
    e.preventDefault();
  }
}, { passive: false });

// Handle orientation change
window.addEventListener('orientationchange', () => {
  setTimeout(() => {
    window.scrollTo(0, 0);
  }, 100);
});

// Add vibration feedback on button clicks (mobile)
if ('vibrate' in navigator) {
  document.querySelectorAll('button, .btn').forEach(btn => {
    btn.addEventListener('click', () => {
      navigator.vibrate(10);
    });
  });
}