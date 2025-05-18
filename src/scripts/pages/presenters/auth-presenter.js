import AuthModel from '../../models/auth-model.js';
import LoginView from '../about/login-page.js';
import RegisterView from '../about/register-page.js';
import { updateNavBar } from '../component/navbar.js'; 


export default class AuthPresenter {
  constructor(mode = 'login') {
    this.model = new AuthModel();
    this.mode  = mode;  
    this.view  = null;
  }

  async render() {
    if (this.mode === 'login') {
      this.view = new LoginView({
        onLogin:      creds => this.handleLogin(creds),
        onToRegister: ()    => this.switchTo('register'),
      });
    } else {
      this.view = new RegisterView({
        onRegister: data => this.handleRegister(data),
        onToLogin:  ()   => this.switchTo('login'),
      });
    }
    this.view.render();
  }

  async handleLogin({ email, password }) {
    try {
      await this.model.login({ email, password });
      updateNavBar;
      // document.startViewTransition(() => {
         location.hash = '/';
      // });
    } catch (err) {
      alert(err.message);
    }
  }
  

  async handleRegister(data) {
    try {
      await this.model.register(data);
      alert('Registrasi sukses! Silakan login.');
      this.switchTo('login');
    } catch (err) {
      alert(err.message);
    }
  }

  switchTo(mode) {
    this.mode = mode;
    this.render();
  }
}
