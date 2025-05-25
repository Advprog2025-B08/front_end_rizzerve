import axios from 'axios';

class MenuRepository {
  constructor(
    baseURL = process.env.API_BASE_URL || 'http://localhost:8080/api'
  ) {
    this.client = axios.create({
      baseURL,
      timeout: 10000,
      headers: { 'Content-Type': 'application/json' },
    });

    // attach token automatically
    this.client.interceptors.request.use(
      config => {
        const token = localStorage.getItem('authToken');
        if (token) config.headers.Authorization = `Bearer ${token}`;
        return config;
      },
      error => Promise.reject(error)
    );

    // unwrap data & handle 401 globally
    this.client.interceptors.response.use(
      response => response.data,
      error => {
        if (error.response?.status === 401) {
          localStorage.removeItem('authToken');
          localStorage.removeItem('userData');
          window.location.reload();
        }
        const msg =
          error.response?.data?.message ||
          error.message ||
          'An unexpected error occurred';
        return Promise.reject(new Error(msg));
      }
    );
  }

  async getActiveMenus() {
    return this.client.get('/menus/active');
  }

  async getAllMenus() {
    return this.client.get('/menus/all');
  }

  async getMenuById(id) {
    return this.client.get(`/menus/${id}`);
  }

  async createMenu(menuData) {
    return this.client.post('/menus', menuData);
  }

  async updateMenu(id, menuData) {
    return this.client.put(`/menus/${id}`, menuData);
  }

  async deleteMenu(id) {
    return this.client.delete(`/menus/${id}`);
  }
}

export default MenuRepository;