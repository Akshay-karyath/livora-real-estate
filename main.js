// === main.js — FINAL STABLE VERSION ===

// ---------- PROPERTY DATA ----------
const PROPS = [
  {id:'p1', title:'Modern Family House', location:'Bengaluru, Indiranagar', price:8500000, type:'sale', beds:4, baths:3, area:'3200 sqft', image:'images/home1.jpg'},
  {id:'p2', title:'Luxury Apartment with Sea View', location:'Mumbai, Bandra', price:65000, type:'rent', beds:2, baths:2, area:'1200 sqft', image:'images/home2.jpg'},
  {id:'p3', title:'Cozy Studio Near Metro', location:'Chennai, T. Nagar', price:3800000, type:'sale', beds:1, baths:1, area:'600 sqft', image:'images/home3.jpg'},
  {id:'p4', title:'Designer Villa with Garden', location:'Pune, Kalyani Nagar', price:12500000, type:'sale', beds:5, baths:4, area:'4500 sqft', image:'images/home4.jpg'}
];

// ---------- HELPERS ----------
function escapeHtml(str){
  return String(str).replace(/[&<>"']/g, c => ({
    '&':'&amp;',
    '<':'&lt;',
    '>':'&gt;',
    '"':'&quot;',
    "'":"&#39;"
  }[c]));
}

function formatPrice(price, type){
  if(type === 'rent') return '₹' + price.toLocaleString() + ' / mo';
  if(price >= 10000000) return '₹' + (price / 10000000).toFixed(2) + ' Cr';
  if(price >= 100000) return '₹' + (price / 100000).toFixed(2) + ' L';
  return '₹' + price.toLocaleString();
}

// ---------- PROPERTY PAGE ----------
function renderPropertyDetails(){
  const container = document.getElementById('propContainer');
  if(!container) return;

  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');
  const p = PROPS.find(x => x.id === id) || PROPS[0];

  container.innerHTML = `
    <section class="property-wrapper">

      <div class="property-main">
        <img src="${p.image}" class="property-image" alt="${escapeHtml(p.title)}">

        <h2 class="property-title">${escapeHtml(p.title)}</h2>
        <p class="property-location">${escapeHtml(p.location)}</p>

        <div class="property-price">
          ${formatPrice(p.price, p.type)}
        </div>

        <h4>Description</h4>
        <p class="property-desc">
          Beautiful property in ${escapeHtml(p.location)} with
          ${p.beds} bedrooms, ${p.baths} bathrooms and ${p.area}.
        </p>
      </div>

      <aside class="property-agent">
        <h4>Contact Agent</h4>
        <p class="muted">Agent will contact you after request.</p>

        <p><strong>Agent:</strong> Livora Agent</p>
        <p><strong>Phone:</strong> +91 123456789</p>

        <a href="#" class="btn request-btn">Request Visit</a>
      </aside>

    </section>
  `;
}

// ---------- AUTH ----------
function doLogin(email, password, remember){
  if(!email || !password) return false;

  const user = {
    email,
    name: email.split('@')[0],
    ttl: Date.now() + (remember ? 30 : 1) * 24 * 60 * 60 * 1000
  };

  localStorage.setItem('livoraUser', JSON.stringify(user));
  return true;
}

function getCurrentUser(){
  const raw = localStorage.getItem('livoraUser');
  if(!raw) return null;

  const user = JSON.parse(raw);
  if(Date.now() > user.ttl){
    localStorage.removeItem('livoraUser');
    return null;
  }
  return user;
}

function doLogout(){
  localStorage.removeItem('livoraUser');
  window.location.href = 'index.html';
}

// ---------- DOM READY ----------
document.addEventListener('DOMContentLoaded', () => {

  // Property page
  renderPropertyDetails();

  // LOGIN PAGE
  const loginForm = document.getElementById('loginForm');
  if(loginForm){
    loginForm.addEventListener('submit', e => {
      e.preventDefault();

      const email = document.getElementById('loginEmail').value.trim();
      const password = document.getElementById('loginPassword').value.trim();
      const remember = document.getElementById('rememberMe').checked;
      const errorBox = document.getElementById('loginError');

      const success = doLogin(email, password, remember);

      if(!success){
        errorBox.style.display = 'block';
        errorBox.textContent = 'Invalid login credentials';
        return;
      }

      window.location.href = 'dashboard.html';
    });
  }

  // DASHBOARD GUARD
  if(window.location.pathname.includes('dashboard.html')){
    const user = getCurrentUser();
    if(!user){
      window.location.href = 'login.html';
    }
  }

  // LOGOUT
  const logoutBtn = document.getElementById('logoutBtn');
  logoutBtn && logoutBtn.addEventListener('click', doLogout);

});
