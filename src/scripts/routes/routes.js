import DetailPage from '../pages/about/detail-page.js';
import AuthPresenter from '../pages/presenters/auth-presenter.js';
import HomePresenter from '../pages/presenters/home-presenter.js';
import PostPresenter from '../pages/presenters/post-presenter.js';

const routes = {
  '/': {
  async render() { return ''; },
  async afterRender() {
    new HomePresenter().init();
  },
},
  '/login': new AuthPresenter('login'),
  '/register': new AuthPresenter('register'),
  '/add-story': {
    async render() { return ''; }, 
    async afterRender() {
      new PostPresenter().init();
    },
  },
  '/detail/:id': (params) => new DetailPage(params.id)
};

window.addEventListener("hashchange", () => {
  if (window.PostFormView) {
    window.PostFormView.stopCamera();
  }
});


export default routes;
