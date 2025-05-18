import "../styles/styles.css";
import App from "./pages/app";
import { StoryAPI } from "../api/story-api.js";
import { VAPID_PUBLIC_KEY, urlBase64ToUint8Array } from "../scripts/utils/index.js";

let token = localStorage.getItem("authToken");

// Helper to render push button
async function renderPushButton(isLoggedIn) {
  const container = document.getElementById("push-btn-container");
  if (!container) return;
  container.innerHTML = "";

  if (isLoggedIn) {
    // Check subscription status
    let isSubscribed = false;
    let subscription = null;
    if ("serviceWorker" in navigator) {
      const registration = await navigator.serviceWorker.ready;
      subscription = await registration.pushManager.getSubscription();
      isSubscribed = !!subscription;
    }

    const btn = document.createElement("button");
    btn.id = "push-toggle-btn";
    btn.textContent = isSubscribed ? "Disable Notifications" : "Enable Notifications";
    container.appendChild(btn);

    btn.addEventListener("click", async () => {
      if (isSubscribed) {
        await unsubscribeUser(subscription);
      } else {
        const permission = await Notification.requestPermission();
        if (permission === "granted") {
          await subscribeUser();
        } else {
          alert("Notification permission denied.");
          return;
        }
      }
      // Re-render button after action
      renderPushButton(isLoggedIn);
    });
  }
}

// Subscription logic using StoryAPI
async function subscribeUser() {
  if (!("serviceWorker" in navigator)) return;
  const registration = await navigator.serviceWorker.ready;
  const subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
  });

  // Use StoryAPI to subscribe
  try {
    await StoryAPI.subscribeNotification({
      endpoint: subscription.endpoint,
      keys: subscription.toJSON().keys,
    });
    alert("Subscribed to notifications!");
  } catch (err) {
    alert("Failed to subscribe: " + err.message);
  }
}

// Unsubscription logic using StoryAPI
async function unsubscribeUser(subscription) {
  if (!subscription) {
    if (!("serviceWorker" in navigator)) return;
    const registration = await navigator.serviceWorker.ready;
    subscription = await registration.pushManager.getSubscription();
    if (!subscription) return;
  }
  try {
    await StoryAPI.unsubscribeNotification(subscription.endpoint);
    await subscription.unsubscribe();
    alert("Unsubscribed from notifications!");
  } catch (err) {
    alert("Failed to unsubscribe: " + err.message);
  }
}

// Register service worker
if ("serviceWorker" in navigator) {
  window.addEventListener("load", async () => {
    await navigator.serviceWorker.register("/sw.js");
  });
}

document.addEventListener("DOMContentLoaded", async () => {
  const app = new App({
    content: document.querySelector("#main-content"),
    drawerButton: document.querySelector("#drawer-button"),
    navigationDrawer: document.querySelector("#navigation-drawer"),
  });
  await app.renderPage();

  // Render push buttons based on login state
  renderPushButton(!!token);

  window.addEventListener("hashchange", async () => {
    const validRoutes = ["#/", "#/login", "#/register", "#/add-story", "#/detail"];
    const currentHash = window.location.hash;
    const isValidRoute = validRoutes.some((route) => currentHash.startsWith(route));
    if (isValidRoute) {
      await app.renderPage();
      // Update token and re-render buttons in case of login/logout
      token = localStorage.getItem("authToken");
      await renderPushButton(!!token);
    }
  });
});

// document.addEventListener("submit", async (e) => {
//   if (e.target && e.target.id === "subscribeForm") {
//     e.preventDefault();
//     const payload = {
//       endpoint: e.target.elements.endpoint.value,
//       keys: {
//         p256dh: e.target.elements.p256dh.value,
//         auth: e.target.elements.auth.value,
//       },
//     };

//     try {
//       const res = await subscribePush(token, payload);
//       if (!res.error) {
//         await saveSubscription(res.data);
//         await renderSubscriptionList(token);
//       } else {
//         alert("Subscribe failed: " + res.message);
//       }
//     } catch (err) {
//       console.error(err);
//       alert("Network error—unable to subscribe.");
//     }
//   }
// });
