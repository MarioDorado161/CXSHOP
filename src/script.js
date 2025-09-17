<script>
document.addEventListener("DOMContentLoaded", function() {
  // Archivos que NO queremos tocar
  const excludeFiles = ['cart.js', 'cookies.js', '2.jpg', 'script.js'];

  // Base del proyecto (raíz) para GitHub Pages o subcarpetas
  const basePath = (() => {
    const segments = location.pathname.split('/').filter(Boolean);
    if (location.hostname.includes('github.io') && segments.length > 0) {
      return '/' + segments[0] + '/';
    }
    return '/';
  })();

  // Función para normalizar rutas
  function fixPath(path) {
    if (!path || path.startsWith('http') || path.startsWith('#')) return path;

    // Excluir archivos específicos
    for (const file of excludeFiles) {
      if (path.endsWith(file)) return path;
    }

    return new URL(path, window.location.origin + basePath).pathname;
  }

  // Seleccionamos solo los enlaces dentro del menú
  const menuLinks = document.querySelectorAll('.menu a[href]');

  menuLinks.forEach(link => {
    link.href = fixPath(link.getAttribute('href'));
  });
});
</script>





















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







