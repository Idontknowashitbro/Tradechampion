import api from './api';
import { User } from './api';

// Interface for login request
export interface LoginRequest {
  email: string;
  password: string;
}

// Interface for signup request
export interface SignupRequest {
  name: string;
  email: string;
  password: string;
  discordUsername?: string;
}

// Auth service functions
const authService = {
  // Login function
  async login(credentials: LoginRequest) {
    try {
      const response = await api.post('/auth/login', credentials);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Signup function
  async signup(userData: SignupRequest) {
    try {
      const response = await api.post('/auth/signup', userData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Logout function (client-side only)
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  // Get current user
  async getCurrentUser() {
    try {
      const response = await api.get('/auth/me');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update user profile
  async updateProfile(data: Partial<User>) {
    try {
      const response = await api.put('/auth/profile', data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update crypto address
  async updateCryptoAddress(cryptoAddress: string) {
    try {
      const response = await api.put('/auth/crypto-address', { cryptoAddress });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default authService;