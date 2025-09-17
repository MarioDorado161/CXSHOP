/* ================== CONFIG ================== */
const cookieName = 'cxshop_cookie_consent';
const cookieExpiryDays = 365; 
const cookieBanner = document.getElementById('cookieBanner');
const cookieModal = document.getElementById('cookieModal');
const consentStateEl = document.getElementById('consent-state');

/* ================== COOKIE UTIL ================== */
function setCookie(name, value, days) {
  const d = new Date();
  d.setTime(d.getTime() + (days*24*60*60*1000));
  document.cookie = `${name}=${encodeURIComponent(value)};expires=${d.toUTCString()};path=/;SameSite=Lax`;
}

function getCookie(name) {
  const v = document.cookie.split('; ').find(row => row.startsWith(name + '='));
  return v ? decodeURIComponent(v.split('=')[1]) : null;
}

/* ================== CONSENT ================== */
function saveConsent(obj) {
  obj.timestamp = Date.now();
  setCookie(cookieName, JSON.stringify(obj), cookieExpiryDays);
}

function readConsent() {
  const raw = getCookie(cookieName);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

/* ================== UI ================== */
function updateConsentUI(consent) {
  if (!consent) return;
  if (consentStateEl) {
    const parts = ['necessary','preferences','analytics','marketing'].map(k =>
      `${k}:${consent[k] ? '✓' : '✕'}`
    );
    consentStateEl.textContent = parts.join(' · ') + ' · guardado: ' + new Date(consent.timestamp).toLocaleString();
  }
}

function showBanner() {
  if (cookieBanner) cookieBanner.style.display = 'block';
}

function hideBanner() {
  if (cookieBanner) cookieBanner.style.display = 'none';
}

function openModal() {
  if (!cookieModal) return;
  cookieModal.style.display = 'flex';
  const consent = readConsent();
  document.querySelectorAll('.toggle').forEach(t => {
    const key = t.dataset.key;
    const enabled = consent ? !!consent[key] : (key==='necessary');
    setToggleState(t, enabled);
  });
}

function closeModal() {
  if (cookieModal) cookieModal.style.display = 'none';
}

/* ================== TOGGLE HELPERS ================== */
function setToggleState(toggleEl, on) {
  if (!toggleEl) return;
  toggleEl.classList.toggle('on', on);
  toggleEl.setAttribute('aria-checked', on ? 'true' : 'false');
}

function toggleFlip(toggleEl) {
  if (!toggleEl) return;
  if (toggleEl.dataset.key === 'necessary') return;
  setToggleState(toggleEl, !toggleEl.classList.contains('on'));
}

/* ================== BOTONES ================== */
function addListenerSafe(id, event, fn) {
  const el = document.getElementById(id);
  if (el) el.addEventListener(event, fn);
}

addListenerSafe('openCookieSettings','click', e => { e.preventDefault(); openModal(); });

addListenerSafe('acceptAll','click', () => {
  const all = { necessary:true, preferences:true, analytics:true, marketing:true };
  saveConsent(all);
  applyConsentActions(all);
  hideBanner();
});

addListenerSafe('rejectAll','click', () => {
  const none = { necessary:true, preferences:false, analytics:false, marketing:false };
  saveConsent(none);
  applyConsentActions(none);
  hideBanner();
});

addListenerSafe('saveSettings','click', () => {
  const obj = {};
  document.querySelectorAll('.toggle').forEach(t => {
    obj[t.dataset.key] = t.dataset.key==='necessary' || t.classList.contains('on');
  });
  saveConsent(obj);
  applyConsentActions(obj);
  closeModal();
  hideBanner();
});

addListenerSafe('cancelSettings','click', closeModal);

/* ================== TOGGLES ================== */
document.querySelectorAll('.toggle').forEach(t => {
  t.addEventListener('click', () => toggleFlip(t));
  t.addEventListener('keydown', ev => {
    if (ev.key === 'Enter' || ev.key === ' ') {
      ev.preventDefault();
      toggleFlip(t);
    }
  });
});

/* ================== CONSENT ACTIONS ================== */
function applyConsentActions(consent) {
  updateConsentUI(consent);

  if (consent.analytics) loadGoogleAnalytics();
  if (consent.marketing) loadMarketingPixel();
}

/* ================== EXTERNAL SCRIPTS ================== */
function loadGoogleAnalytics() {
  if (window._ga_loaded) return;
  window._ga_loaded = true;
  const id = 'G-XXXXXXXXXX'; // reemplaza por tu ID
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${id}`;
  document.head.appendChild(script);
  window.dataLayer = window.dataLayer || [];
  window.gtag = function(){window.dataLayer.push(arguments);};
  window.gtag('js', new Date());
  window.gtag('config', id, { 'anonymize_ip': true, 'send_page_view': true });
}

function loadMarketingPixel() {
  if (window._mk_loaded) return;
  window._mk_loaded = true;
  // aquí carga tu pixel de marketing real
}

/* ================== INICIALIZACIÓN ================== */
(function initConsent() {
  const consent = readConsent();
  if (!consent) showBanner();
  else applyConsentActions(consent);
})();
