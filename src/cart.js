// === Shopify Config ===
const client = ShopifyBuy.buildClient({
  domain: "TU_TIENDA.myshopify.com",        // 🔧 tu dominio
  storefrontAccessToken: "TU_ACCESS_TOKEN", // 🔧 tu token
});

// === Variables globales ===
let checkoutId;
const cartBtn = document.querySelector(".cart");
const cartPanel = document.getElementById("cart-panel");
const cartOverlay = document.getElementById("cart-overlay");
const closeCartBtn = document.getElementById("close-cart");
const cartItemsContainer = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const checkoutBtn = document.getElementById("checkout-btn");
const cartCount = document.querySelector(".cart sup");

// === Inicializar checkout con persistencia ===
async function initCheckout() {
  try {
    const storedCheckoutId = localStorage.getItem("checkoutId");

    if (storedCheckoutId) {
      console.log("🛒 Encontrado checkoutId en localStorage:", storedCheckoutId);

      const checkout = await client.checkout.fetch(storedCheckoutId);

      if (checkout && !checkout.completedAt) {
        checkoutId = checkout.id;
        console.log("✅ Usando checkout existente:", checkoutId);
        renderCart(checkout);
        return;
      } else {
        console.log("⚠️ Checkout inválido o completado. Creando uno nuevo...");
      }
    }
  } catch (error) {
    console.warn("❌ Error al recuperar checkout. Creando uno nuevo:", error);
  }

  const newCheckout = await client.checkout.create();
  checkoutId = newCheckout.id;
  localStorage.setItem("checkoutId", checkoutId);
  console.log("✨ Nuevo checkout creado:", checkoutId);
}

initCheckout();

// === Abrir carrito ===
if (cartBtn) {
  cartBtn.addEventListener("click", () => {
    cartPanel.classList.add("open");
    cartOverlay.classList.add("active");
  });
}

// === Cerrar carrito ===
function closeCart() {
  cartPanel.classList.remove("open");
  cartOverlay.classList.remove("active");
}

if (closeCartBtn) closeCartBtn.addEventListener("click", closeCart);
if (cartOverlay) cartOverlay.addEventListener("click", closeCart);

// === Añadir producto al carrito ===
async function addToCart(variantId, quantity = 1) {
  try {
    const lineItemsToAdd = [{ variantId, quantity }];
    const checkout = await client.checkout.addLineItems(checkoutId, lineItemsToAdd);
    console.log(`➕ Añadido producto ${variantId} x${quantity}`);
    renderCart(checkout);
  } catch (err) {
    console.error("❌ Error al añadir al carrito:", err);
  }
}

// === Renderizar carrito ===
function renderCart(checkout) {
  if (!checkout.lineItems || checkout.lineItems.length === 0) {
    cartItemsContainer.innerHTML = "<p>Tu carrito está vacío</p>";
    cartTotal.textContent = "0 €";
    cartCount.textContent = "0";
    return;
  }

  cartItemsContainer.innerHTML = "";
  checkout.lineItems.forEach((item) => {
    const itemHTML = `
      <div class="cart-item">
        <img src="${item.variant.image?.src}" width="50">
        <div>
          <p>${item.title}</p>
          <p>${item.variant.title} - ${item.quantity} x ${item.variant.price.amount} €</p>
        </div>
      </div>
    `;
    cartItemsContainer.innerHTML += itemHTML;
  });

  cartTotal.textContent = checkout.totalPrice.amount + " €";
  cartCount.textContent = checkout.lineItems.length;
  console.log("🛒 Carrito actualizado:", checkout.lineItems.length, "productos");
}

// === Ir al checkout de Shopify ===
if (checkoutBtn) {
  checkoutBtn.addEventListener("click", async () => {
    try {
      const checkout = await client.checkout.fetch(checkoutId);
      console.log("➡️ Redirigiendo al checkout:", checkout.webUrl);
      window.location.href = checkout.webUrl;
    } catch (err) {
      console.error("❌ Error al redirigir al checkout:", err);
    }
  });
}

// === Exponer función global para usar desde productpage.html ===
window.addToCart = addToCart;

// === Limpiar carrito si el checkout ya fue completado ===
window.addEventListener("load", async () => {
  const storedCheckoutId = localStorage.getItem("checkoutId");
  if (storedCheckoutId) {
    try {
      const checkout = await client.checkout.fetch(storedCheckoutId);
      if (checkout.completedAt) {
        console.log("✅ Checkout completado. Vaciando carrito.");
        localStorage.removeItem("checkoutId");
        cartItemsContainer.innerHTML = "<p>Tu carrito está vacío</p>";
        cartTotal.textContent = "0 €";
        cartCount.textContent = "0";
      }
    } catch (err) {
      console.warn("⚠️ No se pudo verificar el checkout:", err);
    }
  }
});
