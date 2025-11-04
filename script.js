/* app.js - Toma de pedidos */

/* ===== Datos del menú ===== */
const MENU = [
  { id: 's1', cat: 'Salado', name: 'Dorilocos', price: 55 },
  { id: 's2', cat: 'Salado', name: 'Chicharrón preparado entero', price: 55 },
  { id: 's3', cat: 'Salado', name: 'Chicharrón preparado mitad', price: 35 },
  { id: 's4', cat: 'Salado', name: 'Nachos con Suadero', price: 65 },
  { id: 's5', cat: 'Salado', name: 'Gomitas locas', price: 35 },
  { id: 's6', cat: 'Salado', name: 'Fruta loca', price: 75 },

  { id: 'd1', cat: 'Dulce', name: 'Fruta con crema', price: 75 },
  { id: 'd2', cat: 'Dulce', name: 'Fresas con crema', price: 95 },
  { id: 'd3', cat: 'Dulce', name: 'Donitas solas', price: 45 },
  { id: 'd4', cat: 'Dulce', name: 'Pan de dulce relleno', price: 50 },
  { id: 'd5', cat: 'Dulce', name: 'Rebanada de pastel', price: 50 },
  { id: 'd6', cat: 'Dulce', name: 'Rebanada de pastel preparada', price: 85 },

  { id: 'p1', cat: 'Plancha', name: 'Hamburguesa sencilla', price: 75 },
  { id: 'p2', cat: 'Plancha', name: 'Hamburguesa hawaiana', price: 95 },
  { id: 'p3', cat: 'Plancha', name: 'Hamburguesa doble', price: 120 },
  { id: 'p4', cat: 'Plancha', name: 'Hot dog gigante', price: 45 },
  { id: 'p5', cat: 'Plancha', name: 'Orden de hotdogs', price: 80 },
  { id: 'p6', cat: 'Plancha', name: 'Acompañamiento papas/aros/combinado +', price: 25 },

  { id: 'f1', cat: 'Fritos freidora', name: 'Papas a la francesa', price: 45 },
  { id: 'f2', cat: 'Fritos freidora', name: 'Salchipulpos grandes', price: 70 },
  { id: 'f3', cat: 'Fritos freidora', name: 'Salchipulpos chicos', price: 50 },
  { id: 'f4', cat: 'Fritos freidora', name: 'Aros de cebolla', price: 45 },
  { id: 'f5', cat: 'Fritos freidora', name: 'Papas gajo', price: 45 },
  { id: 'f6', cat: 'Fritos freidora', name: 'Boneless', price: 85 },

  { id: 'e1', cat: 'Elotes', name: 'Elotes tradicionales o empanizado', price: 30 },
  { id: 'e2', cat: 'Elotes', name: 'Esquite chico', price: 35 },
  { id: 'e3', cat: 'Elotes', name: 'Esquite grabde', price: 50 },
  { id: 'e4', cat: 'Elotes', name: 'Doriesquites', price: 60 },
  { id: 'e5', cat: 'Elotes', name: 'Maruchan con esquites', price: 60 },
  { id: 'e6', cat: 'Elotes', name: 'Esquites con suadero', price: 60 }
];

/* ===== Variables ===== */
const categoriesEl = document.getElementById('categories');
const menuEl = document.getElementById('menu');
const cartCountEl = document.getElementById('cart-count');

const cartModal = document.getElementById('cart-modal');
const cartItemsEl = document.getElementById('cart-items');
const subtotalEl = document.getElementById('subtotal');
const taxEl = document.getElementById('tax');
const totalEl = document.getElementById('total');

const btnCart = document.getElementById('btn-cart');
const btnCloseCart = document.getElementById('close-cart');
const btnClearCart = document.getElementById('clear-cart');
const btnSendWhatsapp = document.getElementById('send-whatsapp');

let customerName = "";
let paymentMethod = "efectivo";
let cashAmount = "";
const ACCOUNT_NUMBER = "1234 5678 9012"; // ✅ Tu número de cuenta
const SHIPPING_FEE = 15;

/* ===== Carrito ===== */
const STORAGE_KEY = 'pedido_cart_v1';
let cart = loadCart();

/* ===== Inicialización ===== */
renderCategories();
renderMenu();
updateCartCount();

/* ===== Funciones ===== */

function uniqueCategories() {
  return [...new Set(MENU.map(i => i.cat))];
}

function renderCategories() {
  const cats = uniqueCategories();
  categoriesEl.innerHTML = '';
  cats.forEach((c, i) => {
    const btn = document.createElement('button');
    btn.className = 'category-btn' + (i === 0 ? ' active' : '');
    btn.textContent = c;
    btn.onclick = () => {
      document.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderMenu(c);
    };
    categoriesEl.appendChild(btn);
  });
}

function renderMenu(category = null) {
  if (!category) {
    const active = document.querySelector('.category-btn.active');
    category = active ? active.textContent : uniqueCategories()[0];
  }

  const items = MENU.filter(i => i.cat === category);
  menuEl.innerHTML = '';
  items.forEach(it => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <div style="display:flex;align-items:center;gap:10px">
        <h3>${escapeHtml(it.name)}</h3>
        <div class="price">$${formatPrice(it.price)}</div>
      </div>
      <div class="meta">${escapeHtml(it.cat)}</div>
      <div class="actions">
        <button class="btn primary" data-id="${it.id}">Agregar</button>
      </div>
    `;
    menuEl.appendChild(card);

    card.querySelector('.btn.primary').addEventListener('click', () => addToCart(it.id));
  });
}

/* ===== Carrito ===== */
function loadCart() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
  } catch {
    return {};
  }
}

function saveCart() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
}

function addToCart(id, qty = 1) {
  cart[id] = (cart[id] || 0) + qty;
  saveCart();
  updateCartCount();
}

function updateCartCount() {
  const count = Object.values(cart).reduce((s, q) => s + q, 0);
  cartCountEl.textContent = count;
}

/* ===== Modal ===== */
btnCart.addEventListener('click', openCart);
btnCloseCart.addEventListener('click', closeCart);

btnClearCart.addEventListener('click', () => {
  if (confirm("¿Seguro que quieres vaciar el pedido?")) {
    cart = {};
    saveCart();
    renderCart();
    updateCartCount();
  }
});

btnSendWhatsapp.addEventListener('click', sendToWhatsapp);

cartModal.addEventListener('click', (e) => {
  if (e.target === cartModal) closeCart();
});

function openCart() {
  renderCart();
  cartModal.classList.remove('hidden');
}

function closeCart() {
  cartModal.classList.add('hidden');
}

function renderCart() {
  cartItemsEl.innerHTML = '';

  const entries = Object.entries(cart);
  if (entries.length === 0) {
    cartItemsEl.innerHTML = '<p>El carrito está vacío</p>';
    subtotalEl.textContent = '$0.00';
    taxEl.textContent = '$0.00';
    totalEl.textContent = '$0.00';
    return;
  }

  /* ===== CAMPOS DE CLIENTE Y MÉTODO DE PAGO ===== */
  cartItemsEl.innerHTML = `
    <input id="customer-name" placeholder="Nombre del cliente..." value="${customerName}">
    
    <label>Método de pago:</label>
    <select id="payment-method">
      <option value="efectivo" ${paymentMethod === "efectivo" ? "selected" : ""}>Efectivo</option>
      <option value="transferencia" ${paymentMethod === "transferencia" ? "selected" : ""}>Transferencia</option>
    </select>

    <div id="payment-extra"></div>
  `;

  /* Eventos */
  document.getElementById("customer-name").addEventListener("input", e => {
    customerName = e.target.value;
  });

  const paymentSelect = document.getElementById("payment-method");
  const extraDiv = document.getElementById("payment-extra");

  paymentSelect.addEventListener("change", () => {
    paymentMethod = paymentSelect.value;
    renderPaymentExtra();
  });

  function renderPaymentExtra() {
    if (paymentMethod === "efectivo") {
      extraDiv.innerHTML = `
        <input id="cash-input" placeholder="¿Con cuánto paga?" value="${cashAmount}">
      `;
      document.getElementById("cash-input").addEventListener("input", e => {
        cashAmount = e.target.value;
      });
    } else {
      extraDiv.innerHTML = `
        <p><strong>Número de cuenta para transferencia:</strong><br>${ACCOUNT_NUMBER}</p>
      `;
    }
  }

  renderPaymentExtra();

  /* ===== ITEMS ===== */
  let subtotal = 0;

  entries.forEach(([id, qty]) => {
    const item = MENU.find(m => m.id === id);
    if (!item) return;
    const lineTotal = item.price * qty;
    subtotal += lineTotal;

    const row = document.createElement('div');
    row.className = 'cart-row';

    row.innerHTML = `
      <div class="name">
        <strong>${item.name}</strong><br>
        <small>$${formatPrice(item.price)} c/u</small>
      </div>
      <div class="qty-controls">
        <button class="dec">−</button>
        <div>${qty}</div>
        <button class="inc">+</button>
        <div><strong>$${formatPrice(lineTotal)}</strong></div>
        <button class="remove">🗑</button>
      </div>
    `;
    cartItemsEl.appendChild(row);

    row.querySelector('.inc').onclick = () => {
      cart[id]++;
      saveCart();
      renderCart();
      updateCartCount();
    };

    row.querySelector('.dec').onclick = () => {
      cart[id]--;
      if (cart[id] <= 0) delete cart[id];
      saveCart();
      renderCart();
      updateCartCount();
    };

    row.querySelector('.remove').onclick = () => {
      delete cart[id];
      saveCart();
      renderCart();
      updateCartCount();
    };
  });

  const envio = SHIPPING_FEE;
  const total = subtotal + envio;

  subtotalEl.textContent = `$${formatPrice(subtotal)}`;
  taxEl.textContent = `$${formatPrice(envio)}`;
  totalEl.textContent = `$${formatPrice(total)}`;
}

/* ===== WhatsApp ===== */
function sendToWhatsapp() {
  if (Object.keys(cart).length === 0) {
    alert("El carrito está vacío");
    return;
  }

  const cliente = customerName.trim();
  if (cliente.length < 1) {
    alert("Escribe el nombre del cliente");
    return;
  }

  let subtotal = 0;
  const lines = [];

  lines.push('🛒 *Nuevo pedido*');
  lines.push(`Cliente: ${cliente}`);
  lines.push('');

  Object.entries(cart).forEach(([id, qty]) => {
    const item = MENU.find(i => i.id === id);
    const lineTotal = item.price * qty;
    subtotal += lineTotal;
    lines.push(`${qty} x ${item.name} - $${formatPrice(lineTotal)}`);
  });

  const envio = SHIPPING_FEE;
  const total = subtotal + envio;

  lines.push('');
  lines.push(`Subtotal: $${formatPrice(subtotal)}`);
  lines.push(`Envío: $${formatPrice(envio)}`);
  lines.push(`*Total: $${formatPrice(total)}*`);
  lines.push('');

  /* ===== MÉTODO DE PAGO ===== */
  if (paymentMethod === "efectivo") {
    lines.push(`Pago: Efectivo`);
    lines.push(`Paga con: ${cashAmount ? `$${cashAmount}` : "No especificado"}`);
  } else {
    lines.push(`Pago: Transferencia`);
    lines.push(`Cuenta: ${ACCOUNT_NUMBER}`);
  }

  const message = lines.join('\n');
  const phone = '5511819149';
  const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

  window.open(url, '_blank');

  if (confirm("¿Vaciar pedido?")) {
    cart = {};
    saveCart();
    renderCart();
    updateCartCount();
    closeCart();
  }
}

/* ===== Utils ===== */
function formatPrice(n) {
  return Number(n).toFixed(2);
}

function escapeHtml(str) {
  return str.replace(/[&<>"']/g, s => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[s]);
}

/* ===== Abrir primera categoría ===== */
(function openDefault() {
  const first = document.querySelector('.category-btn');
  if (first) first.click();
})();

