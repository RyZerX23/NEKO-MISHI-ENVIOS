/* app.js - Toma de pedidos */

/* ===== Datos del menú ===== */
const MENU = [
  /* ===== SALADO ===== */
  { id: 's1', cat: 'Salado', name: 'Dorilocos', price: 55 },
  { id: 's2', cat: 'Salado', name: 'Fruta loca', price: 75 },
  { id: 's3', cat: 'Salado', name: 'Boing congelado', price: 50 },
  { id: 's4', cat: 'Salado', name: 'Gomilocas', price: 35 },
  { id: 's5', cat: 'Salado', name: 'Vaso de Cacahuates', price: 25 },
  { id: 's6', cat: 'Salado', name: 'Vaso de Cueritos', price: 20 },
  { id: 's7', cat: 'Salado', name: 'Chicharron preparado (mitad)', price: 35 },
  { id: 's8', cat: 'Salado', name: 'Chicharron preparado (completo)', price: 55 },


  /* ===== FREIDORA ===== */
  { id: 'f1', cat: 'Freidora', name: 'Papas a la francesa', price: 45 },
  { id: 'f2', cat: 'Freidora', name: 'Aros de cebolla', price: 45 },
  { id: 'f3', cat: 'Freidora', name: 'Papas gajo', price: 45 },
  { id: 'f4', cat: 'Freidora', name: 'Mix de papas (Francesa, aros y gajo)', price: 55 },
  { id: 'f5', cat: 'Freidora', name: 'Boneless con papas a la francesa', price: 85 },

  /* ===== PLANCHA ===== */
  { id: 'p1', cat: 'Plancha', name: 'Hamburguesa sencilla', price: 75 },
  { id: 'p3', cat: 'Plancha', name: 'Hamburguesa hawaiana', price: 95 },
  { id: 'p5', cat: 'Plancha', name: 'Hamburguesa doble', price: 125 },
  { id: 'p7', cat: 'Plancha', name: 'Maruchan con Suadero', price: 60 },
  { id: 'p8', cat: 'Plancha', name: 'Tostitos con Suadero', price: 60 },
  { id: 'p9', cat: 'Plancha', name: 'Hot dog gigante', price: 45 },
  { id: 'p10', cat: 'Plancha', name: 'Orden de hot dogs', price: 80 },

  /* ===== ELOTES ===== */
  { id: 'e1', cat: 'Elotes', name: 'Elote', price: 30 },
  { id: 'e2', cat: 'Elotes', name: 'Esquite chico', price: 35 },
  { id: 'e3', cat: 'Elotes', name: 'Esquite grande', price: 50 },
  { id: 'e4', cat: 'Elotes', name: 'Dorito esquites', price: 60 },
  { id: 'e5', cat: 'Elotes', name: 'Maruchan con esquites', price: 60 },
  { id: 'e6', cat: 'Elotes', name: 'Chicharron preparado con esquites', price: 40 },

  /* ===== POSTRES ===== */
  { id: 'd1', cat: 'Postres', name: 'Fruta con crema', price: 75 },
  { id: 'd2', cat: 'Postres', name: 'Fresas con crema', price: 95 },
  { id: 'd3', cat: 'Postres', name: 'Donitas', price: 45 },
  { id: 'd4', cat: 'Postres', name: 'Donitas con fruta', price: 70 },
  { id: 'd5', cat: 'Postres', name: 'Pastel Bruce de chocolate', price: 70 },
  { id: 'd6', cat: 'Postres', name: 'Pay', price: 45 },
  { id: 'd7', cat: 'Postres', name: 'Pastel', price: 55 },
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
const ACCOUNT_NUMBER = "4027 6657 7906 5946";
const SHIPPING_FEE = 15;

/* ===== Carrito ===== */
const STORAGE_KEY = 'pedido_cart_v1';
let cart = loadCart();

let extras = {};   // Frutas extra (postres)
let complementos = {}; // ← NUEVO: complementos hamburguesas



/* =======================================================
   ========== AQUI EMPIEZA TU CÓDIGO ORIGINAL ===========
   ======================================================= */

renderCategories();
renderMenu();
updateCartCount();

/* ============================
   ALERTA PERSONALIZADA
============================ */
function customAlert(message) {
  return new Promise(resolve => {
    const overlay = document.createElement("div");
    overlay.className = "custom-alert-overlay";

    overlay.innerHTML = `
            <div class="custom-alert-box">
                <div class="custom-alert-title">Aviso</div>
                <div class="custom-alert-message">${message}</div>
                <button class="custom-btn ok">Aceptar</button>
            </div>
        `;

    document.body.appendChild(overlay);

    overlay.querySelector(".ok").onclick = () => {
      overlay.remove();
      resolve();
    };
  });
}

/* ============================
   CONFIRM PERSONALIZADO
============================ */
function customConfirm(message) {
  return new Promise(resolve => {
    const overlay = document.createElement("div");
    overlay.className = "custom-confirm-overlay";

    overlay.innerHTML = `
            <div class="custom-confirm-box">
                <div class="custom-alert-title">Confirmación</div>
                <div class="custom-alert-message">${message}</div>

                <button class="custom-btn ok">Sí</button>
                <button class="custom-btn cancel">No</button>
            </div>
        `;

    document.body.appendChild(overlay);

    overlay.querySelector(".ok").onclick = () => {
      overlay.remove();
      resolve(true);
    };

    overlay.querySelector(".cancel").onclick = () => {
      overlay.remove();
      resolve(false);
    };
  });
}


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

    card.querySelector('.btn.primary').addEventListener('click', () => handleAdd(it));
  });
}


/* =======================================================
   ========== NUEVA LÓGICA ESPECIAL PARA PASTELES ==========
   ======================================================= */

function handleAdd(item) {

  /* ==== POSTRES ==== */
  if (item.id === "d5" || item.id === "d6" || item.id === "d7") {
    if (confirm("¿Deseas agregar fruta y crema extra (+$25)?")) {
      openFruitPopup(item);
    } else {
      addToCart(item.id);
    }
    return;
  }

  /* ==== HAMBURGUESAS ==== */
  if (item.id === "p1" || item.id === "p3" || item.id === "p5") {
    if (confirm("¿Deseas agregar complementos?")) {
      openComplementPopup(item);
    } else {
      addToCart(item.id);
    }
    return;
  }

  addToCart(item.id);
}



/* =======================================================
   ========== POPUP COMPLEMENTOS HAMBURGUESAS ==========
   ======================================================= */

function openComplementPopup(item) {
  const popup = document.createElement("div");
  popup.className = "popup-frutas";
  popup.innerHTML = `
    <div class="popup-inner animate-popup">
      <h3 class="popup-title">Selecciona complementos (+$25)</h3>

      <div class="popup-options">
          <label class="option">
              <input type="radio" name="comp" value="Papas"> 🍟 Papas
          </label>

          <label class="option">
              <input type="radio" name="comp" value="Aros de cebolla"> 🧅 Aros
          </label>

          <label class="option">
              <input type="radio" name="comp" value="Ambos"> 🍟🧅 Ambos
          </label>
      </div>

      <div class="popup-buttons">
          <button id="confirm-complement" class="btn primary">✔ Aceptar</button>
          <button id="cancel-complement" class="btn danger">✖ Cancelar</button>
      </div>
    </div>
  `;
  document.body.appendChild(popup);

  document.getElementById("cancel-complement").onclick = () => popup.remove();

  document.getElementById("confirm-complement").onclick = () => {
    const selected = popup.querySelector("input[name='comp']:checked");

    if (!selected) {
      alert("Selecciona un complemento.");
      return;
    }

    complementos[item.id] = selected.value;
    addToCart(item.id);

    popup.remove();
  };
}

function openFruitPopup(item) {
  const popup = document.createElement("div");
  popup.className = "popup-frutas";
  popup.innerHTML = `
      <div class="popup-inner animate-popup">
    <h3 class="popup-title">Selecciona las frutas 🍓🍇🍑</h3>

    <div class="popup-options">
        <label class="option">
            <input type="checkbox" value="Fresa"> 🍓 Fresa
        </label>

        <label class="option">
            <input type="checkbox" value="Uva"> 🍇 Uva
        </label>

        <label class="option">
            <input type="checkbox" value="Durazno"> 🍑 Durazno
        </label>
    </div>

    <div class="popup-buttons">
        <button id="confirm-fruits" class="btn primary">✔ Agregar</button>
        <button id="cancel-fruits" class="btn danger">✖ Cancelar</button>
    </div>
</div>

  `;
  document.body.appendChild(popup);

  document.getElementById("cancel-fruits").onclick = () => popup.remove();

  document.getElementById("confirm-fruits").onclick = () => {
    const selected = [...popup.querySelectorAll("input:checked")].map(f => f.value);

    if (selected.length === 0) {
      alert("Selecciona al menos una fruta.");
      return;
    }

    extras[item.id] = selected;
    addToCart(item.id);

    popup.remove();
  };
}


/* =======================================================
   ========== TU CÓDIGO ORIGINAL DEL CARRITO  ===========
   ======================================================= */

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
    extras = {};
    complementos = {};
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

  cartItemsEl.innerHTML = `
    <input id="customer-name" placeholder="Nombre del cliente..." value="${customerName}">
    
    <label>Método de pago:</label>
    <select id="payment-method">
      <option value="efectivo" ${paymentMethod === "efectivo" ? "selected" : ""}>Efectivo</option>
      <option value="transferencia" ${paymentMethod === "transferencia" ? "selected" : ""}>Transferencia</option>
    </select>

    <div id="payment-extra"></div>
  `;

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

  let subtotal = 0;

  entries.forEach(([id, qty]) => {
    const item = MENU.find(m => m.id === id);
    if (!item) return;

    let linePrice = item.price;

    /* ===== EXTRA PASTELES ===== */
    let extrasText = "";
    if (extras[id]) {
      linePrice += 25;
      extrasText = `<br><small>Extra: ${extras[id].join(", ")}</small>`;
    }

    /* ===== COMPLEMENTOS HAMBURGUESAS ===== */
    let compText = "";
    if (complementos[id]) {
      linePrice += 25;
      compText = `<br><small>Complemento: ${complementos[id]}</small>`;
    }

    const lineTotal = linePrice * qty;
    subtotal += lineTotal;

    const row = document.createElement('div');
    row.className = 'cart-row';

    row.innerHTML = `
      <div class="name">
        <strong>${item.name}</strong>
        ${extrasText}
        ${compText}
        <br>
        <small>$${formatPrice(linePrice)} c/u</small>
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
      if (cart[id] <= 0) {
        delete cart[id];
        delete extras[id];
        delete complementos[id];
      }
      saveCart();
      renderCart();
      updateCartCount();
    };

    row.querySelector('.remove').onclick = () => {
      delete cart[id];
      delete extras[id];
      delete complementos[id];
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

    let price = item.price;
    let txt = `${qty} x ${item.name}`;

    if (extras[id]) {
      price += 25;
      txt += ` (extra: ${extras[id].join(", ")})`;
    }

    if (complementos[id]) {
      price += 25;
      txt += ` (complemento: ${complementos[id]})`;
    }

    lines.push(`${txt} - $${formatPrice(price * qty)}`);
    subtotal += price * qty;
  });

  const envio = SHIPPING_FEE;
  const total = subtotal + envio;

  lines.push('');
  lines.push(`Subtotal: $${formatPrice(subtotal)}`);
  lines.push(`Envío: $${formatPrice(envio)}`);
  lines.push(`*Total: $${formatPrice(total)}*`);
  lines.push('');

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

  /* === LIMPIAR TODO === */
  cart = {};
  extras = {};
  complementos = {};
  customerName = "";
  cashAmount = "";
  paymentMethod = "efectivo";

  saveCart();
  renderCart();
  updateCartCount();
  closeCart();
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

