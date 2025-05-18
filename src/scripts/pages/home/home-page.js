import { saveStories, getAllStories, deleteStory } from "../../../db.js";
import { StoryAPI } from "../../../api/story-api.js";

export default class HomePage {
  constructor() {
    this.mainContent = document.getElementById("main-content");
    this.token = localStorage.getItem("authToken");
  }

  async render() {
    let stories = [];
    try {
      stories = await StoryAPI.getStories();
      await saveStories(stories);
    } catch (err) {
      stories = await getAllStories();
      if (stories.length === 0) {
        this.mainContent.innerHTML = "<p>Tidak ada data story.</p>";
        return;
      }
    }

    this.mainContent.innerHTML = `
      <section class="story-section">
        <h1>Semua Story</h1>
        <div id="story-list">
          ${stories
            .map(
              (story) => `
            <article class="story-item" data-id="${story.id}">
              <img src="${story.photoUrl}" alt="${story.name}" />
              <h2>${story.name}</h2>
              <p>${story.description}</p>
              <small>${new Date(story.createdAt).toLocaleString()}</small>
            <div class="story-actions">
              <button class="view-story-btn" data-id="${story.id}">View</button>
              <button class="delete-story-btn" data-id="${story.id}">Hapus</button>
            </div>
            </article>
          `
            )
            .join("")}
        </div>
      </section>
    `;

    // Event listener untuk tombol View
    this.mainContent.querySelectorAll(".view-story-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const id = btn.dataset.id;
        window.location.hash = `/detail/${id}`;
      });
    });

    // Event listener untuk tombol Hapus
    this.mainContent.querySelectorAll(".delete-story-btn").forEach((btn) => {
      btn.addEventListener("click", async (e) => {
        const id = btn.dataset.id;
        await deleteStory(id);
        btn.closest("article").remove();
      });
    });
  }
}

const logoutBtn = document.getElementById("logoutBtn");
if (logoutBtn) {
  logoutBtn.addEventListener("click", () => {
    StoryAPI.logout();
    window.location.href = "/#/login";
  });
}
