const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

class ApiService {
  async makeRequest(url, options = {}) {
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    if (options.token) {
      config.headers.Authorization = `Bearer ${options.token}`;
    }

    try {
      const response = await fetch(`${API_BASE_URL}${url}`, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.message || `HTTP error! status: ${response.status}`;
        throw new Error(errorMessage);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Meja Management Methods
  async getAllMeja(token) {
    const response = await this.makeRequest('/meja/admin/read', {
      method: 'GET',
      token,
    });
    return response.meja || [];
  }

  async getMejaByNomor(token, nomor) {
    const response = await this.makeRequest(`/meja/admin/read/${nomor}`, {
      method: 'GET',
      token,
    });
    return response.meja;
  }

  async createMeja(token, mejaData) {
    const response = await this.makeRequest('/meja/admin/create', {
      method: 'POST',
      token,
      body: JSON.stringify(mejaData),
    });
    return response;
  }

  async updateMeja(token, mejaId, mejaData) {
    const response = await this.makeRequest(`/meja/admin/update/${mejaId}`, {
      method: 'POST',
      token,
      body: JSON.stringify(mejaData),
    });
    return response;
  }

  async deleteMeja(token, mejaId) {
    const response = await this.makeRequest(`/meja/admin/delete/${mejaId}`, {
      method: 'DELETE',
      token,
    });
    return response;
  }

  async setUserToMeja(token, mejaId, username) {
    const response = await this.makeRequest(`/meja/user/set/${mejaId}`, {
      method: 'POST',
      token,
      body: JSON.stringify({ username }),
    });
    return response;
  }

  async completeOrder(token, mejaId) {
    const response = await this.makeRequest(`/meja/user/complete_order/${mejaId}`, {
      method: 'POST',
      token,
    });
    return response;
  }

  // SSE Connection Helper (optional - for manual connection management)
  createMejaEventSource(onMessage, onError, onOpen) {
    const eventSource = new EventSource(`${API_BASE_URL}/meja/admin/stream`);
    
    eventSource.onopen = onOpen || (() => {
      console.log('SSE connection opened');
    });
    
    eventSource.addEventListener('meja-update', onMessage || ((event) => {
      console.log('Meja update received:', JSON.parse(event.data));
    }));
    
    eventSource.onerror = onError || ((error) => {
      console.error('SSE error:', error);
    });
    
    return eventSource;
  }

  // User Management Methods (if needed)
  async login(credentials) {
    const response = await this.makeRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    return response;
  }

  async register(userData) {
    const response = await this.makeRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    return response;
  }

  async getAllMenus(token) {
    const response = await this.makeRequest('/menu/read', {
      method: 'GET',
      token,
    });
    return response.menus || [];
  }
}

export default new ApiService();