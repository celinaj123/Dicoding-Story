export function renderNavBar() {
    const token = localStorage.getItem('authToken');
    return `
      <ul class="nav-list" id="nav-list">
        ${!token ? `<li><a href="#/login">Login</a></li>` : ''}
        <li><a href="#/add-story">Buat Cerita</a></li>
        ${token ? `<li><button id="logoutBtn">Logout</button></li>` : ''}
      </ul>
    `;
  }
  
  export function updateNavBar() {
    const navContainer = document.getElementById('nav-list');
    if (!navContainer) return;
    navContainer.innerHTML = renderNavBar();
    renderHeaderEvents();
  }
  
  export function renderHeaderEvents() {
    const logoutBtn = document.getElementById("logoutBtn");
    if (logoutBtn) {
      logoutBtn.addEventListener("click", () => {
        localStorage.removeItem("authToken");
        updateNavBar();
        window.location.hash = "/login";
      });
    }
  }
  