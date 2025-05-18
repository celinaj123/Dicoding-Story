import PostModel from "../../models/post-model.js";
import PostFormView from "../../pages/about/post-form.js";

export default class PostPresenter {
  constructor() {
    this.model = new PostModel();
  }

  init() {
    const view = new PostFormView({
      onSubmit: (data) => this.handleSubmit(data),
    });

    window.postFormView = view;
    view.render();
  }
  async handleSubmit({ formData, canvas, latlng }) {
    try {
      const blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/jpeg"));
      const title = formData.get("title");
      const description = formData.get("description");
      const { lat, lng } = latlng || {};

      await this.model.create({ imageBlob: blob, title, description, lat, lng });

      location.hash = "/";
    } catch (err) {
      console.error(err);
      alert("Gagal membuat post: " + err.message);
    }
  }
}
