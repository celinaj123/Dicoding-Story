import { StoryAPI } from '../../api/story-api.js';

export default class AuthModel {
  async login(credentials) {
    const data = await StoryAPI.login(credentials);

    const token = data.loginResult?.token;
    const user = data.loginResult?.user;
  
    if (token) localStorage.setItem("authToken", token);
    if (user) localStorage.setItem("user", JSON.stringify(user));
  
    return user;
  }

  async register(data) {
    return StoryAPI.register(data);
  }

  isLoggedIn() {
    return !!localStorage.getItem('authToken');
  }

  logout() {
    localStorage.clear();
  }
}
