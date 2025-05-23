class AuthService {
  constructor(apiClient) {
    this.api = apiClient;
  }

  async login(credentials) {
    try {
      const response = await this.api.login(credentials);
      if (response.token) {
        localStorage.setItem('token', response.token);
        localStorage.setItem('username', response.username);
        localStorage.setItem('role', response.role);
      }
      return response;
    } catch (error) {
      throw new Error('Login failed: ' + error.message);
    }
  }

  async register(userData) {
    try {
      return await this.api.register(userData);
    } catch (error) {
      throw new Error('Registration failed: ' + error.message);
    }
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('role');
  }

  getCurrentUser() {
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');
    const role = localStorage.getItem('role');
    
    if (token && username && role) {
      return { token, username, role };
    }
    return null;
  }

  isAuthenticated() {
    return !!localStorage.getItem('token');
  }

  isAdmin() {
    return localStorage.getItem('role') === 'ADMIN';
  }
}
export default AuthService;