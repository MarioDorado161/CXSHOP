// 🔥 MENU MENU MENU MENU MENU MENU
document.getElementById("hamburger").addEventListener("click", function() {
  document.getElementById("menu-links").classList.toggle("active");
});



// 🔥 Ajusta automáticamente la altura de la top-bar
function fixTopbarHeight() {
  const tb = document.querySelector('.top-bar');
  if (tb) {
    document.documentElement.style.setProperty('--topbar-h', tb.offsetHeight + 'px');
  }
}
window.addEventListener('load', fixTopbarHeight);
window.addEventListener('resize', fixTopbarHeight);

// 🔥 Toggle menú hamburguesa
document.addEventListener("DOMContentLoaded", () => {
  const burger = document.querySelector(".hamburger");
  const menu = document.querySelector(".menu-links");
  const closeBtn = document.querySelector(".menu-close");

  if (burger && menu) {
    burger.addEventListener("click", () => menu.classList.add("active"));
  }
  if (closeBtn && menu) {
    closeBtn.addEventListener("click", () => menu.classList.remove("active"));
  }
});




document.addEventListener("DOMContentLoaded", () => {
  const burger = document.querySelector(".hamburger");
  const menu = document.querySelector(".menu-links");
  const closeBtn = document.querySelector(".menu-close");

  if (burger && menu) {
    burger.addEventListener("click", () => {
      menu.classList.add("active");
      document.body.style.overflow = "hidden"; // evita scroll del body
    });
  }

  if (closeBtn && menu) {
    closeBtn.addEventListener("click", () => {
      menu.classList.remove("active");
      document.body.style.overflow = ""; // reactiva scroll
    });
  }
});




// CAMBIO DE ICONOS EN EL SEPARADOR

const symbols = ["∎", "⌗", "⌘", "∆", "∇", "☺", "☻", "◐", "◓", "◑", "◒"];
  let currentIndex = 0;
  const icono = document.getElementById("icono-separador");
  function changeSymbol() {
    currentIndex = (currentIndex + 1) % symbols.length;
    icono.innerHTML = symbols[currentIndex] + " LOS MAS VENDIDOS";
  }
  setInterval(changeSymbol, 200);





// SLIDER PRODUCTOS

const slider = document.getElementById('slider');
const products = slider.querySelectorAll('.product');
const productWidth = products[0].offsetWidth; // ancho de un producto
let index = 0;

// Duplicamos los productos dinámicamente para el loop
slider.innerHTML += slider.innerHTML;

function moveSlider(direction = 1) {
  index += direction;
  slider.style.transition = 'transform 0.5s ease';
  slider.style.transform = `translateX(${-index * productWidth}px)`;

  // Si llegamos al final del primer bloque → reset al inicio
  if (index >= products.length) {
    setTimeout(() => {
      slider.style.transition = 'none';
      index = 0;
      slider.style.transform = `translateX(0px)`;
    }, 500);
  }

  // Si vamos demasiado hacia atrás → reset al final del primer bloque
  if (index < 0) {
    setTimeout(() => {
      slider.style.transition = 'none';
      index = products.length - 1;
      slider.style.transform = `translateX(${-index * productWidth}px)`;
    }, 500);
  }
}

// Botones
document.querySelector('.next').addEventListener('click', () => moveSlider(1));
document.querySelector('.prev').addEventListener('click', () => moveSlider(-1));

// Autoplay infinito
setInterval(() => moveSlider(1), 3000);





// CARRITO CARRITO CARRITO CARRITO

const addToCartBtn = document.querySelector('.add-to-cart');
const cartBtn = document.querySelector('.cart');
const cartPanel = document.getElementById('cart-panel');
const cartOverlay = document.getElementById('cart-overlay');
const closeCartBtn = document.getElementById('close-cart');
const cartItemsContainer = document.getElementById('cart-items');
const cartTotal = document.getElementById('cart-total');
const cartCount = document.querySelector('.cart sup');

let total = 0;
let itemsInCart = 0;

// --- Funciones de carrito ---
function openCart() {
  cartPanel.classList.add('open');
  cartOverlay.classList.add('active');
}

function closeCart() {
  cartPanel.classList.remove('open');
  cartOverlay.classList.remove('active');
}

closeCartBtn.addEventListener('click', closeCart);
cartOverlay.addEventListener('click', closeCart);
cartBtn.addEventListener('click', openCart);

// --- Guardar y cargar en LocalStorage ---
function saveCart() {
  localStorage.setItem('myCart', cartItemsContainer.innerHTML);
  localStorage.setItem('cartTotal', total);
  localStorage.setItem('cartCount', itemsInCart);
}

function loadCart() {
  const savedItems = localStorage.getItem('myCart');
  const savedTotal = localStorage.getItem('cartTotal');
  const savedCount = localStorage.getItem('cartCount');

  if (savedItems) {
    cartItemsContainer.innerHTML = savedItems;
    total = parseFloat(savedTotal);
    itemsInCart = parseInt(savedCount);
    cartTotal.textContent = total + " USD";
    cartCount.textContent = itemsInCart;

    // Volver a asignar eventos a botones + y 🗑
    cartItemsContainer.querySelectorAll('.add-one').forEach(btn => {
      btn.addEventListener('click', addOne);
    });
    cartItemsContainer.querySelectorAll('.remove-one').forEach(btn => {
      btn.addEventListener('click', removeOne);
    });
  }
}

// --- Funciones de botones + y 🗑 ---
function addOne(e) {
  const price = parseFloat(e.target.parentElement.parentElement.querySelector('p:nth-child(2)').textContent.replace(/[^0-9.]/g, ''));
  total += price;
  itemsInCart++;
  cartTotal.textContent = total + " USD";
  cartCount.textContent = itemsInCart;
  saveCart();
}

function removeOne(e) {
  const itemDiv = e.target.parentElement.parentElement;
  const price = parseFloat(itemDiv.querySelector('p:nth-child(2)').textContent.replace(/[^0-9.]/g, ''));
  total -= price;
  itemsInCart--;
  cartTotal.textContent = total + " USD";
  cartCount.textContent = itemsInCart;
  itemDiv.remove();
  saveCart();
}

// --- Añadir producto al carrito ---
addToCartBtn.addEventListener('click', () => {
  const productName = document.querySelector('.title').textContent;
  const productPriceText = document.querySelector('.price').textContent;
  const productPrice = parseFloat(productPriceText.replace(/[^0-9.]/g, ''));
  const productImage = document.querySelector('.main-image').src;

  // Obtener talla seleccionada
  const selectedSize = document.querySelector('.size-option.selected')?.textContent || '';

  const itemHTML = `
    <div class="cart-item" style="display:flex; align-items:center; justify-content:space-between; margin-bottom:10px;">
      <div style="display:flex; align-items:center;">
        <img src="${productImage}" width="50" style="margin-right:10px;">
        <div>
          <p style="margin:0;">${productName}</p>
          <p style="margin:0;">${selectedSize} - 1 x ${productPrice} USD</p>
        </div>
      </div>
      <div style="display:flex; flex-direction:column; gap:5px;">
        <button class="add-one" style="cursor:pointer; width:30px; height:30px; border:none; border-radius:50%; background-color:#000; color:#fff; font-size:18px; display:flex; justify-content:center; align-items:center;">+</button>
        <button class="remove-one" style="cursor:pointer; width:30px; height:30px; border:none; border-radius:50%; background-color:#000; color:#fff; font-size:18px; display:flex; justify-content:center; align-items:center;">🗑</button>
      </div>
    </div>
  `;

  cartItemsContainer.innerHTML += itemHTML;
  total += productPrice;
  itemsInCart++;
  cartTotal.textContent = total + " USD";
  cartCount.textContent = itemsInCart;

  // Asignar eventos a los botones recién creados
  const newItem = cartItemsContainer.lastElementChild;
  newItem.querySelector('.add-one').addEventListener('click', addOne);
  newItem.querySelector('.remove-one').addEventListener('click', removeOne);

  saveCart();
  openCart();
});

// --- Cargar carrito al iniciar ---
loadCart();
