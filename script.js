const EBMarketiza = {
  products: [
    {
      id: 1,
      name: "Classic Cotton T-Shirt",
      category: "Clothing",
      price: 199,
      oldPrice: 249,
      rating: 4.7,
      stock: 8,
      image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=700&q=80",
      newArrival: true
    },
    {
      id: 2,
      name: "Everyday Sneakers",
      category: "Shoes",
      price: 499,
      rating: 4.6,
      stock: 3,
      image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=700&q=80",
      newArrival: true
    },
    {
      id: 3,
      name: "Wireless Headphones",
      category: "Electronics",
      price: 699,
      oldPrice: 799,
      rating: 4.8,
      stock: 2,
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=700&q=80",
      newArrival: true
    },
    {
      id: 4,
      name: "Minimal Table Lamp",
      category: "Home",
      price: 299,
      rating: 4.4,
      stock: 12,
      image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=700&q=80",
      newArrival: false
    },
    {
      id: 5,
      name: "Beauty Care Set",
      category: "Beauty",
      price: 349,
      oldPrice: 399,
      rating: 4.5,
      stock: 6,
      image: "https://images.unsplash.com/photo-1556228578-8c89e6adf883?auto=format&fit=crop&w=700&q=80",
      newArrival: true
    },
    {
      id: 6,
      name: "Everyday Shoulder Bag",
      category: "Accessories",
      price: 399,
      rating: 4.3,
      stock: 9,
      image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=700&q=80",
      newArrival: false
    },
    {
      id: 7,
      name: "Oversized Hoodie",
      category: "Clothing",
      price: 449,
      rating: 4.7,
      stock: 1,
      image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=700&q=80",
      newArrival: false
    },
    {
      id: 8,
      name: "Smart Watch",
      category: "Electronics",
      price: 899,
      oldPrice: 999,
      rating: 4.6,
      stock: 15,
      image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=700&q=80",
      newArrival: true
    }
  ],

  currencyRates: {
    SEK: 1,
    EUR: 0.092,
    USD: 0.108
  },

  currencySymbols: {
    SEK: "kr",
    EUR: "€",
    USD: "$"
  }
};

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];

function getStorage(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value === null ? fallback : JSON.parse(value);
  } catch {
    return fallback;
  }
}

function setStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage can be unavailable in some browser/privacy modes.
  }
}

function getFavorites() {
  return getStorage("ebmarketizaFavorites", []);
}

function getCart() {
  return getStorage("ebmarketizaCart", []);
}

function getCurrency() {
  return getStorage("ebmarketizaCurrency", "SEK");
}

function formatMoney(sekAmount) {
  const currency = getCurrency();
  const rate = EBMarketiza.currencyRates[currency] || 1;
  const converted = sekAmount * rate;

  if (currency === "SEK") {
    return `${Math.round(converted)} kr`;
  }

  return `${EBMarketiza.currencySymbols[currency]}${converted.toFixed(2)}`;
}

function getDiscountPercent(product) {
  if (!product.oldPrice || product.oldPrice <= product.price) return 0;
  return Math.round((1 - product.price / product.oldPrice) * 100);
}

function getStockMessage(stock) {
  if (stock <= 0) return `<span class="low-stock">Out of Stock</span>`;
  if (stock <= 5) return `<span class="low-stock">Only ${stock} left</span>`;
  return `<span class="stock-ok">In Stock</span>`;
}

function renderProduct(product) {
  const favorites = getFavorites();
  const isFavorite = favorites.includes(product.id);
  const discount = getDiscountPercent(product);
  const disabled = product.stock <= 0 ? "disabled" : "";

  return `
    <article class="product-card" data-product-id="${product.id}">
      <div class="product-image-wrap">
        <a href="product.html?id=${product.id}" aria-label="${product.name}">
          <img class="product-image" src="${product.image}" alt="${product.name}" loading="lazy">
        </a>
        ${discount ? `<span class="discount-badge">-${discount}%</span>` : ""}
        <button
          class="favorite-btn ${isFavorite ? "active" : ""}"
          type="button"
          data-favorite-id="${product.id}"
          aria-label="Add to Favorite"
          title="Favorite"
        >${isFavorite ? "♥" : "♡"}</button>
      </div>

      <div class="product-info">
        <span class="product-category">${product.category}</span>
        <a class="product-name" href="product.html?id=${product.id}">${product.name}</a>
        <div class="product-rating">⭐ ${product.rating.toFixed(1)} / 5</div>

        <div class="price-row">
          <span class="price">${formatMoney(product.price)}</span>
          ${product.oldPrice ? `<span class="old-price">${formatMoney(product.oldPrice)}</span>` : ""}
        </div>

        ${getStockMessage(product.stock)}

        <button
          class="add-cart-btn"
          type="button"
          data-cart-id="${product.id}"
          ${disabled}
        >${product.stock > 0 ? "Add to Cart" : "Out of Stock"}</button>
      </div>
    </article>
  `;
}

function renderProducts(products = EBMarketiza.products) {
  const productsGrid = $("#productsGrid");
  const emptyState = $("#emptyState");

  if (!productsGrid) return;

  productsGrid.innerHTML = products.map(renderProduct).join("");

  if (emptyState) {
    emptyState.hidden = products.length !== 0;
  }

  bindProductButtons();
}

function renderNewArrivals() {
  const grid = $("#newArrivalsGrid");
  if (!grid) return;

  const arrivals = EBMarketiza.products.filter(product => product.newArrival);
  grid.innerHTML = arrivals.map(renderProduct).join("");
  bindProductButtons();
}

function bindProductButtons() {
  $$("[data-favorite-id]").forEach(button => {
    button.addEventListener("click", () => {
      toggleFavorite(Number(button.dataset.favoriteId));
    });
  });

  $$("[data-cart-id]").forEach(button => {
    button.addEventListener("click", () => {
      addToCart(Number(button.dataset.cartId));
    });
  });
}

function toggleFavorite(productId) {
  const favorites = getFavorites();
  const index = favorites.indexOf(productId);

  if (index >= 0) {
    favorites.splice(index, 1);
  } else {
    favorites.push(productId);
  }

  setStorage("ebmarketizaFavorites", favorites);
  updateHeaderCounts();
  renderProducts(currentProducts);
  renderNewArrivals();
}

function addToCart(productId) {
  const product = EBMarketiza.products.find(item => item.id === productId);
  if (!product || product.stock <= 0) return;

  const cart = getCart();
  const existing = cart.find(item => item.productId === productId);

  if (existing) {
    if (existing.quantity < product.stock) existing.quantity += 1;
  } else {
    cart.push({
      productId,
      quantity: 1
    });
  }

  setStorage("ebmarketizaCart", cart);
  updateHeaderCounts();
}

function updateHeaderCounts() {
  const favoriteCount = $("#favoriteCount");
  const cartCount = $("#cartCount");

  if (favoriteCount) {
    favoriteCount.textContent = getFavorites().length;
  }

  if (cartCount) {
    const total = getCart().reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = total;
  }
}

let currentProducts = [...EBMarketiza.products];

function filterProducts(query) {
  const term = query.trim().toLowerCase();

  if (!term) {
    currentProducts = [...EBMarketiza.products];
  } else {
    currentProducts = EBMarketiza.products.filter(product =>
      product.name.toLowerCase().includes(term) ||
      product.category.toLowerCase().includes(term)
    );
  }

  renderProducts(currentProducts);
}

function showSuggestions(query) {
  const box = $("#searchSuggestions");
  if (!box) return;

  const term = query.trim().toLowerCase();

  if (!term) {
    box.classList.remove("show");
    box.innerHTML = "";
    return;
  }

  const matches = EBMarketiza.products
    .filter(product =>
      product.name.toLowerCase().includes(term) ||
      product.category.toLowerCase().includes(term)
    )
    .slice(0, 5);

  if (!matches.length) {
    box.classList.remove("show");
    box.innerHTML = "";
    return;
  }

  box.innerHTML = matches.map(product => `
    <button class="search-suggestion" type="button" data-suggestion-id="${product.id}">
      ${product.name}
    </button>
  `).join("");

  box.classList.add("show");

  $$("[data-suggestion-id]").forEach(button => {
    button.addEventListener("click", () => {
      const product = EBMarketiza.products.find(
        item => item.id === Number(button.dataset.suggestionId)
      );

      if ($("#searchInput")) {
        $("#searchInput").value = product ? product.name : "";
      }

      filterProducts(product ? product.name : "");
      box.classList.remove("show");
      document.querySelector("#products")?.scrollIntoView({ behavior: "smooth" });
    });
  });
}

function setupSearch() {
  const input = $("#searchInput");
  const button = $("#searchBtn");

  if (!input) return;

  input.addEventListener("input", () => {
    showSuggestions(input.value);
  });

  input.addEventListener("keydown", event => {
    if (event.key === "Enter") {
      filterProducts(input.value);
      $("#searchSuggestions")?.classList.remove("show");
      $("#products")?.scrollIntoView({ behavior: "smooth" });
    }
  });

  button?.addEventListener("click", () => {
    filterProducts(input.value);
    $("#searchSuggestions")?.classList.remove("show");
    $("#products")?.scrollIntoView({ behavior: "smooth" });
  });

  document.addEventListener("click", event => {
    if (!event.target.closest(".search-wrap")) {
      $("#searchSuggestions")?.classList.remove("show");
    }
  });
}

function setupCategoryMenu() {
  const toggle = $("#categoryToggle");
  const menu = $("#categoryMenu");

  toggle?.addEventListener("click", () => {
    menu?.classList.toggle("open");
  });

  $$("[data-category]").forEach(link => {
    link.addEventListener("click", event => {
      event.preventDefault();
      const category = link.dataset.category;
      currentProducts = EBMarketiza.products.filter(
        product => product.category === category
      );
      renderProducts(currentProducts);
      document.querySelector("#products")?.scrollIntoView({ behavior: "smooth" });
      menu?.classList.remove("open");
    });
  });
}

function setupCurrency() {
  const select = $("#currencySelect");
  if (!select) return;

  select.value = getCurrency();

  select.addEventListener("change", () => {
    setStorage("ebmarketizaCurrency", select.value);
    renderProducts(currentProducts);
    renderNewArrivals();
  });
}

function setupLanguage() {
  const select = $("#languageSelect");
  if (!select) return;

  const savedLanguage = getStorage("ebmarketizaLanguage", "en");
  select.value = savedLanguage;

  select.addEventListener("change", () => {
    setStorage("ebmarketizaLanguage", select.value);
    // Full translations will be connected to the multilingual system later.
  });
}

document.addEventListener("DOMContentLoaded", () => {
  renderNewArrivals();
  renderProducts();
  updateHeaderCounts();
  setupSearch();
  setupCategoryMenu();
  setupCurrency();
  setupLanguage();
});
