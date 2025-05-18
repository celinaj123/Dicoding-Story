export default class LoginView {
    constructor({ onLogin, onToRegister }) {
      this.onLogin      = onLogin;
      this.onToRegister = onToRegister;
      this.app = document.getElementById('app');
    }
  
    render() {
      this.app.innerHTML = `
        <main tabindex="-1" id="main-content">
          <h1>Login</h1>
          <form id="form-login">
            <label>
              Email
              <input type="email" name="email" required />
            </label>
            <label>
              Password
              <input type="password" name="password" required />
            </label>
            <button type="submit">Masuk</button>
          </form>
          <p>Belum punya akun? <a href="#" id="to-register">Register di sini</a></p>
        </main>
      `;
      this._bindEvents();
    }
  
    _bindEvents() {
      this.app.querySelector('#form-login')
        .addEventListener('submit', evt => {
          evt.preventDefault();
          const f = evt.target;
          this.onLogin({
            email:    f.email.value.trim(),
            password: f.password.value.trim(),
          });
        });
      this.app.querySelector('#to-register')
        .addEventListener('click', evt => {
          evt.preventDefault();
          this.onToRegister();
        });
    }
  }
  