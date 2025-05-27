import axios from 'axios';

class AuthRepository {

    constructor(baseURL = `${process.env.REACT_APP_API_URL}/api` || 'http://localhost:8080/api') {
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
            const token = localStorage.getItem('authToken');
            if (token) {
              config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
          },
          (error) => {
            return Promise.reject(error);
          }
        );
    
        this.client.interceptors.response.use(
          (response) => {
            return response.data;
          },
          (error) => {
            if (error.response?.status === 401) {
              localStorage.removeItem('authToken'); 
              localStorage.removeItem('userData');  
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
}
export default AuthRepository;