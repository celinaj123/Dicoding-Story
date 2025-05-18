export default class RegisterView {
    constructor({ onRegister, onToLogin }) {
      this.onRegister = onRegister;
      this.onToLogin  = onToLogin;
      this.app = document.getElementById('app');
    }
  
    render() {
      this.app.innerHTML = `
        <main tabindex="-1" id="main-content">
          <h1>Register</h1>
          <form id="form-register">
            <label>
              Name
              <input type="text" name="name" required />
            </label>
            <label>
              Email
              <input type="email" name="email" required />
            </label>
            <label>
              Password
              <input type="password" name="password" required minlength="6" />
            </label>
            <button type="submit">Daftar</button>
          </form>
          <p>Sudah punya akun? <a href="#" id="to-login">Login di sini</a></p>
        </main>
      `;
      this._bindEvents();
    }
  
    _bindEvents() {
      this.app.querySelector('#form-register')
        .addEventListener('submit', evt => {
          evt.preventDefault();
          const f = evt.target;
          this.onRegister({
            name:     f.name.value.trim(),
            email:    f.email.value.trim(),
            password: f.password.value.trim(),
          });
        });
      this.app.querySelector('#to-login')
        .addEventListener('click', evt => {
          evt.preventDefault();
          this.onToLogin();
        });
    }
  }
  