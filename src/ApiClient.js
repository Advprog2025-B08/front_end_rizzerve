class ApiClient {
  constructor(baseURL = 'http://localhost:8080/api') {
    this.baseURL = baseURL;
  }

  async makeRequest(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const token = localStorage.getItem('token');
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `HTTP error! status: ${response.status}`);
      }

      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return await response.json();
      }
      
      return await response.text();
    } catch (error) {
      console.error('API Request failed:', error);
      throw error;
    }
  }

  // Auth endpoints
  async login(credentials) {
    return this.makeRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async register(userData) {
    return this.makeRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  // Menu endpoints
  async getActiveMenus() {
    return this.makeRequest('/menus');
  }

  async getAllMenus() {
    return this.makeRequest('/menus/admin');
  }

  async getMenuById(id) {
    return this.makeRequest(`/menus/admin/${id}`);
  }

  async createMenu(menuData) {
    return this.makeRequest('/menus/admin', {
      method: 'POST',
      body: JSON.stringify(menuData),
    });
  }

  async updateMenu(id, menuData) {
    return this.makeRequest(`/menus/admin/${id}`, {
      method: 'PUT',
      body: JSON.stringify(menuData),
    });
  }

  async deleteMenu(id) {
    return this.makeRequest(`/menus/admin/${id}`, {
      method: 'DELETE',
    });
  }
}
export default ApiClient;
