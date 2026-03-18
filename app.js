// ===== CART STATE =====
let cart = [];

function addToCart(name, price) {
  const existing = cart.find(item => item.name === name);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ name, price, qty: 1 });
  }
  updateCartUI();
  openCart();
  showToast(`Added "${name}" to cart!`);
}

function removeFromCart(index) {
  cart.splice(index, 1);
  updateCartUI();
}

function updateCartUI() {
  const itemsEl = document.getElementById('cart-items');
  const totalEl = document.getElementById('cart-total');
  const countEl = document.getElementById('cart-count');

  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const count = cart.reduce((sum, item) => sum + item.qty, 0);

  countEl.textContent = count;

  if (cart.length === 0) {
    itemsEl.innerHTML = '<p class="cart-empty">Your cart is empty.</p>';
    totalEl.textContent = '$0.00';
    return;
  }

  itemsEl.innerHTML = cart.map((item, i) => `
    <div class="cart-item">
      <span class="cart-item-name">${item.name}${item.qty > 1 ? ` ×${item.qty}` : ''}</span>
      <span class="cart-item-price">$${(item.price * item.qty).toFixed(2)}</span>
      <button class="cart-item-remove" onclick="removeFromCart(${i})" title="Remove">✕</button>
    </div>
  `).join('');

  totalEl.textContent = '$' + total.toFixed(2);
}

function openCart() {
  document.getElementById('cart-sidebar').classList.add('open');
  document.getElementById('cart-overlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeCart() {
  document.getElementById('cart-sidebar').classList.remove('open');
  document.getElementById('cart-overlay').classList.remove('open');
  document.body.style.overflow = '';
}

// ===== TOAST NOTIFICATION =====
function showToast(msg) {
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = msg;
  toast.style.cssText = `
    position: fixed; bottom: 90px; left: 50%; transform: translateX(-50%);
    background: #333; color: #fff; padding: 12px 24px;
    border-radius: 30px; font-size: 0.9rem; font-weight: 600;
    z-index: 500; animation: fadeInUp .3s ease;
    box-shadow: 0 4px 16px rgba(0,0,0,0.2);
  `;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 2500);
}

// ===== CONTACT FORM =====
function handleSubmit(e) {
  e.preventDefault();
  showToast('Message sent! We\'ll be in touch soon.');
  e.target.reset();
}

// ===== SCROLL ANIMATIONS =====
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.tip-card, .stage-card, .product-card, .mini-card').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(24px)';
  el.style.transition = 'opacity .5s ease, transform .5s ease';
  observer.observe(el);
});

// ===== TOAST KEYFRAME INJECTION =====
const style = document.createElement('style');
style.textContent = `
  @keyframes fadeInUp {
    from { opacity: 0; transform: translate(-50%, 12px); }
    to { opacity: 1; transform: translate(-50%, 0); }
  }
`;
document.head.appendChild(style);

// ===== FOOD BENEFITS =====
const foodBenefits = {
  carrot:      { name: 'Carrot',       emoji: '🥕', color: '#ff7043', benefits: ['Rich in beta-carotene, which converts to Vitamin A for healthy eyesight', 'Supports immune function and skin development', 'Naturally sweet — great first purée for 6+ month babies', 'High in fiber to support healthy digestion'] },
  blueberry:   { name: 'Blueberry',    emoji: '🫐', color: '#7c4dff', benefits: ['Packed with antioxidants that protect developing brain cells', 'High in Vitamin C to boost the immune system', 'Contains manganese for healthy bone development', 'Soft and easy to mash or cut for finger foods at 9+ months'] },
  avocado:     { name: 'Avocado',      emoji: '🥑', color: '#4caf50', benefits: ['Loaded with healthy monounsaturated fats essential for brain growth', 'Excellent source of folate for neural development', 'Creamy texture makes it ideal as a first finger food', 'Contains potassium to support heart health'] },
  sweetpotato: { name: 'Sweet Potato', emoji: '🍠', color: '#ff8f00', benefits: ['One of the best sources of Vitamin A for vision and immunity', 'Naturally sweet flavor is widely accepted by babies', 'Rich in fiber and complex carbohydrates for steady energy', 'Contains Vitamin B6 for brain and nervous system development'] },
  broccoli:    { name: 'Broccoli',     emoji: '🥦', color: '#388e3c', benefits: ['High in Vitamin C — more per gram than oranges', 'Contains calcium and Vitamin K for strong bone formation', 'Rich in folate to support cell growth', 'Early exposure helps toddlers accept bitter flavors'] },
  banana:      { name: 'Banana',       emoji: '🍌', color: '#f9a825', benefits: ['Provides quick energy from natural sugars and carbohydrates', 'High in potassium for heart health and muscle function', 'Soft texture perfect for babies learning to self-feed', 'Contains Vitamin B6 for healthy brain development'] },
  egg:         { name: 'Egg',          emoji: '🍳', color: '#ffa726', benefits: ['Complete protein containing all essential amino acids for growth', 'Choline in yolks is critical for brain and memory development', 'Iron-rich to help prevent anemia in infants', 'Early introduction (from 6 months) helps reduce allergy risk'] },
  peas:        { name: 'Peas',         emoji: '🫛', color: '#66bb6a', benefits: ['Plant-based protein and iron to support healthy growth', 'High in Vitamin K for bone strength and blood clotting', 'Rich in fiber to keep little tummies feeling full', 'Thiamine (B1) supports healthy energy metabolism'] },
  strawberry:  { name: 'Strawberry',   emoji: '🍓', color: '#e53935', benefits: ['Exceptional source of Vitamin C — one cup provides more than an orange', 'Contains folate important for cell repair and growth', 'Antioxidants support long-term heart and brain health', 'Bright color and sweet taste encourages adventurous eating'] },
};

function showFoodInfo(key) {
  const food = foodBenefits[key];
  if (!food) return;
  document.getElementById('food-modal-body').innerHTML = `
    <div class="fmi-header" style="background:${food.color}">
      <span class="fmi-emoji">${food.emoji}</span>
      <h2>${food.name}</h2>
      <p>Health benefits for babies &amp; toddlers</p>
    </div>
    <ul class="fmi-list">
      ${food.benefits.map(b => `<li>${b}</li>`).join('')}
    </ul>
  `;
  document.getElementById('food-modal').classList.add('open');
  document.getElementById('food-modal-overlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeFoodModal() {
  document.getElementById('food-modal').classList.remove('open');
  document.getElementById('food-modal-overlay').classList.remove('open');
  document.body.style.overflow = '';
}
