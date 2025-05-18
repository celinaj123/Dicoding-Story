const BASE_URL = "https://story-api.dicoding.dev/v1";

function getJsonHeaders(requireAuth = false) {
  const headers = { "Content-Type": "application/json" };
  if (requireAuth) {
    const token = localStorage.getItem('authToken');
    if (!token) {
      console.warn("No auth token found in localStorage.");
    } else {
      headers["Authorization"] = `Bearer ${token}`;
    }
  }  
  return headers;
}

function getAuthHeader() {
  const token = localStorage.getItem('authToken');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export class StoryAPI {
  /** REGISTER */
  static async register({ name, email, password }) {
    const res = await fetch(`${BASE_URL}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });
    const data = await res.json();

    if (!res.ok) throw new Error(data.message || "Registrasi gagal");

    return data;
  }

  /** LOGIN */
  static async login({ email, password }) {
    const res = await fetch(`${BASE_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error("Login gagal");

    localStorage.setItem('authToken', data.token);
    localStorage.setItem("user", JSON.stringify(data.loginResult?.user ?? {}));
    return data;
  }
  /** GET ALL STORIES */
  static async getStories({ page = 1, size = 20, location = 0 } = {}) {
    const params = new URLSearchParams({ page, size, location });
    const res = await fetch(`${BASE_URL}/stories?${params}`, {
      method: "GET",
      headers: getJsonHeaders(true),
    });
  
    const data = await res.json();
  
    if (data.error) throw new Error(data.message);
    return Array.isArray(data.listStory) ? data.listStory : [];
  }
  

  /** GET STORY DETAIL */
  static async getStoryById(storyId) {
    const res = await fetch(`${BASE_URL}/stories/${storyId}`, {
      method: "GET",
      headers: getJsonHeaders(true),
    });
    const data = await res.json();
    if (data.error) throw new Error(data.message);
    return data.story;
  }

  /** ADD NEW STORY (Authenticated) */
  static async addStory({ description, photoBlob, lat, lon }) {
    const form = new FormData();
    form.append("description", description);
    form.append("photo", photoBlob, "photo.jpg");
    if (lat != null) form.append("lat", lat);
    if (lon != null) form.append("lon", lon);

    const res = await fetch(`${BASE_URL}/stories`, {
      method: "POST",
      headers: getAuthHeader(),
      body: form,
    });
    const data = await res.json();
    if (data.error) throw new Error(data.message);
    return data; 
  }

  /** LOGOUT */
static logout() {
  console.log("Logging out...");
  localStorage.removeItem("authToken");
  localStorage.removeItem("user");
}

  /** SUBSCRIBE TO PUSH NOTIFICATIONS */
  static async subscribeNotification({ endpoint, keys }) {
    const res = await fetch(`${BASE_URL}/notifications/subscribe`, {
      method: "POST",
      headers: getJsonHeaders(true),
      body: JSON.stringify({ endpoint, keys }),
    });

    const data = await res.json();
    if (!res.ok || data.error) {
      throw new Error(data.message || "Failed to subscribe");
    }

    return data.data;
  }
  
  /** UNSUBSCRIBE FROM PUSH NOTIFICATIONS */
  static async unsubscribeNotification(endpoint) {
    const res = await fetch(`${BASE_URL}/notifications/subscribe`, {
      method: "DELETE",
      headers: getJsonHeaders(true),
      body: JSON.stringify({ endpoint }),
    });

    const data = await res.json();
    if (!res.ok || data.error) {
      throw new Error(data.message || "Failed to unsubscribe");
    }

    return data.message;
  }

}

