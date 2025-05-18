import { renderNavBar } from "../pages/component/navbar.js";

export const VAPID_PUBLIC_KEY = "BCCs2eonMI-6H2ctvFaWg-UYdDv387Vno_bzUzALpB442r2lCnsHmtrx8biyPi_E-1fSGABK_Qs_GlvPoJJqxbk";

export function showFormattedDate(date, locale = "en-US", options = {}) {
  return new Date(date).toLocaleDateString(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
    ...options,
  });
}

export function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");

  const rawData = atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export function sleep(time = 1000) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

export function renderHeader() {
  const header = document.querySelector("header");
  if (!header) return;

  header.innerHTML = `
    <div class="main-header container">
      <a class="brand-name" href="#/">Dicoding Story</a>
      ${renderNavBar()}
      <button id="drawer-button" class="drawer-button">☰</button>
    </div>
  `;

  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem("token");
      window.location.href = "/#/login";
    });
  }
}
