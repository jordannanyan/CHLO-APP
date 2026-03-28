import { apiClient } from './api';
import type { User } from '../types';

export const authService = {
  async login(email: string, password: string): Promise<User> {
    const response = await apiClient.get(`/users?email=${email}&password=${password}`);
    if (response.data.length === 0) {
      throw new Error('Email atau password salah');
    }
    return response.data[0];
  },
};
