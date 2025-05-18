import routes from "../routes/routes.js";
import { getActiveRoute, parseActivePathname } from "../routes/url-parser";

import { updateNavBar } from '../pages/component/navbar.js';


window.addEventListener('DOMContentLoaded', () => {
  updateNavBar();
});
window.addEventListener('hashchange', () => {
  updateNavBar();
});


class App {
  #content = null;
  #drawerButton = null;
  #navigationDrawer = null;

  constructor({ navigationDrawer, drawerButton, content }) {
    this.#content = content;
    this.#drawerButton = drawerButton;
    this.#navigationDrawer = navigationDrawer;

    this._setupDrawer();
  }

  _setupDrawer() {
    this.#drawerButton.addEventListener("click", () => {
      this.#navigationDrawer.classList.toggle("open");
    });

    document.body.addEventListener("click", (event) => {
      if (!this.#navigationDrawer.contains(event.target) && !this.#drawerButton.contains(event.target)) {
        this.#navigationDrawer.classList.remove("open");
      }

      this.#navigationDrawer.querySelectorAll("a").forEach((link) => {
        if (link.contains(event.target)) {
          this.#navigationDrawer.classList.remove("open");
        }
      });
    });
  }


  async renderPage() {
    const appContainer = document.getElementById('app');
    appContainer.classList.remove('show');
      if (!document.startViewTransition) {
        await this._renderContentWithoutTransition();
        requestAnimationFrame(() => {
          appContainer.classList.add('show');
        });
        return;
      }

      document.startViewTransition(async () => {
        await this._renderContentWithoutTransition(); 
      }).finished.then(() => {
        appContainer.classList.add('show');
      });
  }

  async _renderContentWithoutTransition() {
    const url = getActiveRoute();
    const route = routes[url];
    const params = parseActivePathname();
    const page = typeof route === "function" ? route(params) : route;
  
    this.#content.innerHTML = await page.render?.();
    await page.afterRender?.();
  }
  
  
}


export default App;
