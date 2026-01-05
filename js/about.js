// ==========================================
// ABOUT.JS - About Page Functionality
// Create this as: js/about.js
// ==========================================

// Animated Counter Function
function animateCounter(element, target, duration = 2000) {
  const start = 0;
  const increment = target / (duration / 16); // 60fps
  let current = start;
  
  const timer = setInterval(() => {
    current += increment;
    
    if (current >= target) {
      element.textContent = Math.floor(target);
      clearInterval(timer);
    } else {
      element.textContent = Math.floor(current);
    }
  }, 16);
}

// Intersection Observer for animations
function setupScrollAnimations() {
  const observerOptions = {
    threshold: 0.3,
    rootMargin: '0px 0px -100px 0px'
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate');
        
        // If it's a stat card, animate the counter
        if (entry.target.classList.contains('stat-card')) {
          const numberElement = entry.target.querySelector('.stat-number');
          const target = parseInt(numberElement.getAttribute('data-target'));
          animateCounter(numberElement, target);
        }
        
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);
  
  // Observe all animated elements
  const animatedElements = document.querySelectorAll(
    '.feature-card, .value-card, .stat-card, .story-image'
  );
  
  animatedElements.forEach(element => {
    observer.observe(element);
  });
}

// Parallax effect for hero section
function setupParallax() {
  const hero = document.querySelector('.about-hero');
  
  if (!hero) return;
  
  window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const parallaxSpeed = 0.5;
    
    if (scrolled < window.innerHeight) {
      hero.style.backgroundPositionY = `${scrolled * parallaxSpeed}px`;
    }
  });
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  setupScrollAnimations();
  setupParallax();
  
  console.log('📖 About page loaded successfully!');
});