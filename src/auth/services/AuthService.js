import AuthRepository from '../repositories/AuthRepository';

class AuthService {
  constructor() {
    this.authRepository = new AuthRepository();
  }

  async login(credentials) {
    try {
      const response = await this.authRepository.login(credentials);
      
      return {
        token: response.token,
        user: {
          id: response.id,
          username: response.username,
          role: response.role,
        }
      };
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  async register(userData) {
    try {
      const response = await this.authRepository.register(userData);
      return response;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  getCurrentUser() {
    try {
      const userData = localStorage.getItem('userData');
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  }

  isAuthenticated() {
    try {
      const token = localStorage.getItem('authToken');
      return !!token;
    } catch (error) {
      console.error('Error checking authentication:', error);
      return false;
    }
  }

  isAdmin() {
    try {
      const user = this.getCurrentUser();
      return user?.role === 'ADMIN';
    } catch (error) {
      console.error('Error checking admin status:', error);
      return false;
    }
  }

  getToken() {
    try {
      return localStorage.getItem('authToken');
    } catch (error) {
      console.error('Error getting token:', error);
      return null;
    }
  }
}

const authServiceInstance = new AuthService();
export default authServiceInstance;