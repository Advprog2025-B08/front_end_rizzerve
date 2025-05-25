import axios from 'axios';

class ApiClient {
  constructor(baseURL = 'http://localhost:8080/api') {
    this.client = axios.create({
      baseURL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor to add auth token
    this.client.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => {
        return response.data;
      },
      (error) => {
        if (error.response?.status === 401) {
          // Handle unauthorized - could trigger logout
          localStorage.removeItem('token');
          localStorage.removeItem('username');
          localStorage.removeItem('role');
          localStorage.removeItem('userId');
          window.location.reload();
        }
        
        const errorMessage = error.response?.data?.message || 
                           error.response?.data || 
                           error.message || 
                           'An unexpected error occurred';
        
        throw new Error(errorMessage);
      }
    );
  }

  // Auth endpoints
  async login(credentials) {
    try {
      return await this.client.post('/auth/login', credentials);
    } catch (error) {
      throw new Error(`Login failed: ${error.message}`);
    }
  }

  async register(userData) {
    try {
      return await this.client.post('/auth/register', userData);
    } catch (error) {
      throw new Error(`Registration failed: ${error.message}`);
    }
  }

  // Menu endpoints
  async getActiveMenus() {
    try {
      return await this.client.get('/menus');
    } catch (error) {
      throw new Error(`Failed to fetch active menus: ${error.message}`);
    }
  }

  async getAllMenus() {
    try {
      return await this.client.get('/menus/admin');
    } catch (error) {
      throw new Error(`Failed to fetch all menus: ${error.message}`);
    }
  }

  async getMenuById(id) {
    try {
      return await this.client.get(`/menus/admin/${id}`);
    } catch (error) {
      throw new Error(`Failed to fetch menu: ${error.message}`);
    }
  }

  async createMenu(menuData) {
    try {
      return await this.client.post('/menus/admin', menuData);
    } catch (error) {
      throw new Error(`Failed to create menu: ${error.message}`);
    }
  }

  async updateMenu(id, menuData) {
    try {
      return await this.client.put(`/menus/admin/${id}`, menuData);
    } catch (error) {
      throw new Error(`Failed to update menu: ${error.message}`);
    }
  }

  async deleteMenu(id) {
    try {
      return await this.client.delete(`/menus/admin/${id}`);
    } catch (error) {
      throw new Error(`Failed to delete menu: ${error.message}`);
    }
  }
}

export default ApiClient;