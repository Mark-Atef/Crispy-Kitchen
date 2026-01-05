// ==========================================
// MENU.JS - Hybrid: API + Static Fallback
// ==========================================

// STATIC MENU (Preserved!)
const STATIC_MENU = [
  // Breakfast
  {
    id: 'b1',
    name: 'Morning Special',
    category: 'breakfast',
    price: 10.00,
    description: 'Fresh breakfast plate with eggs, toast, and crispy bacon',
    image: './images/breakfast 1.jpg'
  },
  {
    id: 'b2',
    name: 'Pancake Stack',
    category: 'breakfast',
    price: 12.00,
    description: 'Fluffy pancakes with maple syrup and fresh berries',
    image: './images/breakfast 2.jpg'
  },
  {
    id: 'b3',
    name: 'Avocado Toast',
    category: 'breakfast',
    price: 11.00,
    description: 'Sourdough toast with smashed avocado and poached eggs',
    image: './images/breakfast 3.jpg'
  },

  // Lunch
  {
    id: 'l1',
    name: 'Lunch Combo',
    category: 'lunch',
    price: 15.00,
    description: 'Gourmet burger with crispy fries and coleslaw',
    image: './images/lunch 1.jpg'
  },
  {
    id: 'l2',
    name: 'Caesar Salad',
    category: 'lunch',
    price: 13.00,
    description: 'Fresh romaine lettuce with parmesan and grilled chicken',
    image: './images/lunch 2.jpg'
  },
  {
    id: 'l3',
    name: 'Club Sandwich',
    category: 'lunch',
    price: 14.00,
    description: 'Triple-decker sandwich with turkey, bacon, and veggies',
    image: './images/lunch 3.jpg'
  },

  // Dinner
  {
    id: 'd1',
    name: 'Steak Dinner',
    category: 'dinner',
    price: 22.00,
    description: 'Premium grilled steak with roasted vegetables and potatoes',
    image: './images/dinner 1.jpg'
  },
  {
    id: 'd2',
    name: 'Grilled Salmon',
    category: 'dinner',
    price: 24.00,
    description: 'Fresh Atlantic salmon with lemon butter sauce',
    image: './images/dinner 2.jpg'
  },
  {
    id: 'd3',
    name: 'BBQ Ribs',
    category: 'dinner',
    price: 26.00,
    description: 'Slow-cooked ribs with homemade BBQ sauce',
    image: './images/dinner 3.jpg'
  },

  // Desserts
  {
    id: 'ds1',
    name: 'Chocolate Cake',
    category: 'dessert',
    price: 8.00,
    description: 'Rich chocolate cake with vanilla ice cream',
    image: './images/flourless-chocolate-cake-4.jpg'
  },
  {
    id: 'ds2',
    name: 'Cheesecake',
    category: 'dessert',
    price: 9.00,
    description: 'New York style cheesecake with berry compote',
    image: './images/Berry-cheesecakel-558243b3-cc64-45ad-b13e-3bae304f8893-0-1400x919.jpg'
  },
  {
    id: 'ds3',
    name: 'Tiramisu',
    category: 'dessert',
    price: 10.00,
    description: 'Classic Italian tiramisu with coffee and mascarpone',
    image: './images/Classic Italian tiramisu with coffee and mascarpone.jpg'
  },

  // Drinks
  {
    id: 'dr1',
    name: 'Fresh Orange Juice',
    category: 'drinks',
    price: 5.00,
    description: 'Freshly squeezed orange juice',
    image: './images/fresh-squeezed-orange-juice-2.jpg'
  },
  {
    id: 'dr2',
    name: 'Iced Coffee',
    category: 'drinks',
    price: 6.00,
    description: 'Cold brew coffee with ice and milk',
    image: './images/ice coffee.jpg'
  },
  {
    id: 'dr3',
    name: 'Smoothie Bowl',
    category: 'drinks',
    price: 7.00,
    description: 'Blended fruits with granola and honey',
    image: './images/honey-nut-air-fryer-granola-easy-breakfast-recipe-1-of-18.jpg'
  }
];

// Configuration: Show both API + Static data
const SHOW_BOTH = true; // Set to true to show BOTH API + Static, false for one or the other
const USE_API = true; // Only used if SHOW_BOTH is false
const API_URL = 'https://dummyjson.com/recipes';

// Current filter state
let currentCategory = 'all';
let searchQuery = '';
let menuItems = [];

// ==========================================
// INITIALIZE MENU DATA
// ==========================================

async function initializeMenu() {
  if (SHOW_BOTH) {
    console.log('🔥 Loading BOTH API + Static data...');
    
    // First, show static items immediately
    menuItems = [...STATIC_MENU];
    displayMenuItems(menuItems);
    console.log(`✅ Displayed ${STATIC_MENU.length} static items`);
    
    // Then fetch and ADD API items
    await fetchAndMergeAPI();
  } else if (USE_API) {
    console.log('📡 Using API data only...');
    await fetchFromAPI();
  } else {
    console.log('📁 Using static local data only...');
    menuItems = [...STATIC_MENU];
    displayMenuItems(menuItems);
  }
}

// ==========================================
// FETCH AND MERGE API WITH STATIC
// ==========================================

async function fetchAndMergeAPI() {
  const menuGrid = document.getElementById('menuGrid');
  
  try {
    // Show loading message (but keep static items visible)
    const loadingDiv = document.createElement('div');
    loadingDiv.id = 'apiLoading';
    loadingDiv.style.cssText = 'grid-column: 1/-1; text-align: center; padding: 20px; background: var(--color-bg-light); border-radius: 12px; margin: 20px 0;';
    loadingDiv.innerHTML = `
      <div class="spinner" style="width: 40px; height: 40px; margin: 0 auto 10px;"></div>
      <p style="color: var(--color-text-gray); font-size: 14px;">Loading more recipes from API...</p>
    `;
    
    if (menuGrid) {
      menuGrid.appendChild(loadingDiv);
    }

    console.log('🔄 Fetching API recipes...');
    const response = await fetch(`${API_URL}?limit=30`);
    
    if (!response.ok) throw new Error('API request failed');

    const data = await response.json();
    
    // Transform API data
    const apiItems = data.recipes.map(recipe => ({
      id: `api-${recipe.id}`, // Prefix to avoid ID conflicts
      name: recipe.name,
      category: mapCategory(recipe.tags || [], recipe.mealType || []),
      price: calculatePrice(recipe.difficulty, recipe.prepTimeMinutes),
      description: recipe.tags?.slice(0, 3).join(' • ') || 'Delicious recipe',
      image: recipe.image,
      rating: recipe.rating,
      prepTime: recipe.prepTimeMinutes,
      source: 'api' // Tag to identify source
    }));

    // Remove loading div
    document.getElementById('apiLoading')?.remove();

    // MERGE: Add API items to existing static items
    menuItems = [...STATIC_MENU.map(item => ({...item, source: 'static'})), ...apiItems];
    
    console.log(`✅ Total items: ${menuItems.length} (${STATIC_MENU.length} static + ${apiItems.length} API)`);
    
    // Re-display all items
    displayMenuItems(menuItems);
    
    // Show success notification
    showSuccessNotification(`Added ${apiItems.length} recipes from API! Total: ${menuItems.length} items`);

  } catch (error) {
    console.error('❌ API Error:', error);
    console.log('⚠️ Continuing with static menu only...');
    
    // Remove loading div
    document.getElementById('apiLoading')?.remove();
    
  }
}

// ==========================================
// FETCH FROM API (Optional)
// ==========================================

async function fetchFromAPI() {
  const menuGrid = document.getElementById('menuGrid');
  
  try {
    // Show loading
    if (menuGrid) {
      menuGrid.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 60px;">
          <div class="spinner" style="margin: 0 auto 20px;"></div>
          <p style="color: var(--color-text-gray);">Loading recipes from API...</p>
        </div>
      `;
    }

    console.log('🔄 Fetching from API...');
    const response = await fetch(`${API_URL}?limit=30`);
    
    if (!response.ok) throw new Error('API request failed');

    const data = await response.json();
    
    // Transform API data
    menuItems = data.recipes.map(recipe => ({
      id: `recipe-${recipe.id}`,
      name: recipe.name,
      category: mapCategory(recipe.tags || [], recipe.mealType || []),
      price: calculatePrice(recipe.difficulty, recipe.prepTimeMinutes),
      description: recipe.tags?.slice(0, 3).join(' • ') || 'Delicious recipe',
      image: recipe.image,
      rating: recipe.rating,
      prepTime: recipe.prepTimeMinutes
    }));

    console.log(`✅ Loaded ${menuItems.length} items from API`);
    displayMenuItems(menuItems);

  } catch (error) {
    console.error('❌ API Error:', error);
    console.log('⚠️ Falling back to static menu...');
    
    // Fallback to static data
    menuItems = [...STATIC_MENU];
    displayMenuItems(menuItems);
    
    showNotification('Using offline menu', 'warning');
  }
}

// Helper functions for API
function mapCategory(tags, mealTypes) {
  if (mealTypes.includes('Breakfast')) return 'breakfast';
  if (mealTypes.includes('Lunch')) return 'lunch';
  if (mealTypes.includes('Dinner')) return 'dinner';
  
  const tagStr = tags.join(' ').toLowerCase();
  if (tagStr.includes('breakfast')) return 'breakfast';
  if (tagStr.includes('lunch')) return 'lunch';
  if (tagStr.includes('dessert') || tagStr.includes('sweet')) return 'dessert';
  if (tagStr.includes('drink') || tagStr.includes('beverage')) return 'drinks';
  
  return 'dinner';
}

function calculatePrice(difficulty, prepTime) {
  let basePrice = 10;
  
  switch(difficulty?.toLowerCase()) {
    case 'easy': basePrice = 10; break;
    case 'medium': basePrice = 15; break;
    case 'hard': basePrice = 22; break;
    default: basePrice = 12;
  }
  
  if (prepTime > 45) basePrice += 5;
  else if (prepTime > 30) basePrice += 3;
  
  return Math.max(basePrice + Math.floor(Math.random() * 5), 8);
}

function showNotification(message, type = 'info') {
  console.log(`${type === 'warning' ? '⚠️' : 'ℹ️'} ${message}`);
}

// ==========================================
// DISPLAY MENU ITEMS (Enhanced with badges)
// ==========================================

function displayMenuItems(items) {
  const menuGrid = document.getElementById('menuGrid');
  const noResults = document.getElementById('noResults');

  if (!menuGrid) return;

  menuGrid.innerHTML = '';

  if (items.length === 0) {
    noResults.style.display = 'block';
    return;
  }

  noResults.style.display = 'none';

  items.forEach((item, index) => {
    // Add source badge for visual distinction
    const sourceBadge = item.source === 'api' 
      ? '<span style="position: absolute; top: 10px; left: 10px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 4px 10px; border-radius: 20px; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; box-shadow: 0 2px 8px rgba(0,0,0,0.2);"><i class="fa-solid fa-cloud"></i> API</span>'
      : '<span style="position: absolute; top: 10px; left: 10px; background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white; padding: 4px 10px; border-radius: 20px; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; box-shadow: 0 2px 8px rgba(0,0,0,0.2);"><i class="fa-solid fa-home"></i> Local</span>';
    
    const menuItemHTML = `
      <article class="menu-item" style="animation-delay: ${index * 0.05}s">
        <div style="position: relative;">
          ${SHOW_BOTH ? sourceBadge : ''}
          <img 
            src="${item.image}" 
            alt="${item.name}" 
            class="menu-item-image"
            loading="lazy"
          >
          <span class="category-badge" style="right: 10px; left: auto;">${item.category}</span>
          ${item.rating ? `
            <div style="position: absolute; bottom: 10px; right: 10px; background: rgba(0,0,0,0.7); color: white; padding: 5px 10px; border-radius: 20px; font-size: 14px;">
              <i class="fa-solid fa-star" style="color: gold;"></i> ${item.rating.toFixed(1)}
            </div>
          ` : ''}
        </div>
        <div class="menu-item-info">
          <h3 class="menu-item-name">${item.name}</h3>
          <p class="menu-item-description">${item.description}</p>
          ${item.prepTime ? `
            <p style="font-size: 14px; color: var(--color-text-gray); margin-top: 8px;">
              <i class="fa-solid fa-clock"></i> ${item.prepTime} min
            </p>
          ` : ''}
          <div class="menu-item-footer">
            <span class="menu-item-price">${item.price.toFixed(2)}</span>
            <button 
              class="menu-item-add-btn add-to-cart" 
              data-id="${item.id}" 
              data-name="${item.name}" 
              data-price="${item.price}"
              data-image="${item.image}"
            >
              <i class="fa-solid fa-plus"></i>
              Add
            </button>
          </div>
        </div>
      </article>
    `;

    menuGrid.innerHTML += menuItemHTML;
  });

  console.log(`✅ Displaying ${items.length} items`);
}

// ==========================================
// FILTER FUNCTIONS
// ==========================================

function filterByCategory(category) {
  currentCategory = category;
  applyFilters();
}

function filterBySearch(query) {
  searchQuery = query.toLowerCase();
  applyFilters();
}

function applyFilters() {
  let filteredItems = menuItems;

  if (currentCategory !== 'all') {
    filteredItems = filteredItems.filter(item => item.category === currentCategory);
  }

  if (searchQuery) {
    filteredItems = filteredItems.filter(item =>
      item.name.toLowerCase().includes(searchQuery) ||
      item.description.toLowerCase().includes(searchQuery) ||
      item.category.toLowerCase().includes(searchQuery)
    );
  }

  displayMenuItems(filteredItems);
}

// ==========================================
// INITIALIZE
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
  // Initialize menu (API or Static based on config)
  initializeMenu();

  // Category filters
  const filterButtons = document.querySelectorAll('.filter-btn');
  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      filterButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
      
      const category = button.getAttribute('data-category');
      filterByCategory(category);
    });
  });

  // Search input
  const searchInput = document.getElementById('searchInput');
  if (searchInput) {
    const debouncedSearch = debounce((value) => {
      filterBySearch(value);
    }, 300);
    
    searchInput.addEventListener('input', (e) => {
      debouncedSearch(e.target.value);
    });
  }

  console.log('🍽️ Menu page loaded!');
  console.log(`📊 Mode: ${SHOW_BOTH ? 'SHOWING BOTH API + STATIC' : USE_API ? 'API ONLY' : 'STATIC ONLY'}`);
  
  if (SHOW_BOTH) {
    console.log(`📈 Expected: ${STATIC_MENU.length} static items + ~30 API items = ~${STATIC_MENU.length + 30} total`);
  }
});