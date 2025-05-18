// import { saveSubscription, getAllSubscriptions, deleteSubscription } from '../../../db.js';
// import { subscribePush, unsubscribePush } from '../presenters/push-presenter.js';

// export function renderSubscriptionUI() {
//   return `
//     <section class="subscription-section">
//       <h2>Push Notifications</h2>
//       <button id="push-toggle-btn">Loading...</button>

//       <h3>Subscription List</h3>
//       <div id="subscriptionList">Loading subscriptions...</div>
//     </section>
//   `;
// }

// export async function setupPushToggle(token) {
//   const btn = document.getElementById("push-toggle-btn");
//   if (!btn) return;

//   // Current subscription (will be refreshed after every toggle)
//   let subscription = null;

//   try {
//     const reg = await navigator.serviceWorker.ready;
//     subscription = await reg.pushManager.getSubscription();
//     updateBtn();

//     btn.disabled = false;
//     btn.addEventListener("click", handleToggle);
//   } catch (err) {
//     console.error("Service Worker not ready:", err);
//     btn.textContent = "Push Not Supported";
//   }

//   async function handleToggle() {
//     btn.disabled = true;

//     try {
//       if (subscription) {
//         await unsubscribePush();     
//         await deleteSubscription(subscription.endpoint);
//         alert("Unsubscribed from notifications");
//         subscription = null;
//       } else {
        
//         const res = await subscribePush();  
//         if (res.error) throw new Error("Subscribe failed");
//         subscription = res.data;
//         await saveSubscription(subscription);
//         alert("Subscribed to notifications");
//       }
//       updateBtn();
//     } catch (e) {
//       console.error(e);
//       alert(e.message || "Push action failed");
//     } finally {
//       btn.disabled = false;
//     }
//   }

//   function updateBtn() {
//     btn.textContent = subscription
//       ? "Unsubscribe from Notifications"
//       : "Subscribe to Notifications";
//     renderSubscriptionList(); 
//   }
// }

// export async function renderSubscriptionList() {
//   const container = document.getElementById("subscriptionList");
//   if (!container) return;

//   const subs = await getAllSubscriptions();
//   if (subs.length === 0) {
//     container.textContent = "No active subscriptions.";
//     return;
//   }

//   container.innerHTML = subs
//     .map(
//       (s) => `
//       <div class="subscription-item">
//         <code style="word-break: break-all">${s.endpoint}</code>
//       </div>`
//     )
//     .join("");
// }