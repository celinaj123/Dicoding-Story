import PostModel from '../../models/post-model.js';
import HomeView from '../home/home-page.js';

export default class HomePresenter {
  constructor() {
    this.model = new PostModel();
    this.view = new HomeView();
  }

  async init() {
    try {
      const stories = await this.model.getAll(); 
      this.view.render(stories); 
    } catch (err) {
      console.error('Gagal memuat story:', err.message);
      this.view.render();
    }
  }
}