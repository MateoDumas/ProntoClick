import { api } from './api';
import type { User } from '../types';

export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  email: string;
  password: string;
  name: string;
  referralCode?: string;
}

export interface AuthResponse {
  user: User;
  token?: string;
  requiresVerification?: boolean;
  requiresTwoFactor?: boolean;
}

export const login = async (credentials: LoginDto): Promise<AuthResponse> => {
  const { data } = await api.post<AuthResponse>('/auth/login', credentials);
  // Guardar token si viene en la respuesta
  if (data.token) {
    localStorage.setItem('token', data.token);
  }
  return data;
};

export const register = async (userData: RegisterDto): Promise<AuthResponse> => {
  try {
    const { data } = await api.post<AuthResponse>('/auth/register', userData);
    // Guardar token si viene en la respuesta
    if (data.token) {
      localStorage.setItem('token', data.token);
    }
    return data;
  } catch (error: any) {
    // Mejorar el mensaje de error
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    if (error.message) {
      throw error;
    }
    throw new Error('Error al conectarse con el servidor. Verifica que el backend esté corriendo.');
  }
};

export const logout = async (): Promise<void> => {
  localStorage.removeItem('token');
  // Opcional: llamar al endpoint de logout del backend
  // await api.post('/auth/logout');
};

export const getCurrentUser = async (): Promise<User> => {
  const { data } = await api.get<User>('/auth/me');
  return data;
};

export const verifyEmail = async (code: string): Promise<{ success: boolean; message: string }> => {
  const { data } = await api.post<{ success: boolean; message: string }>('/auth/verify-email', { code });
  return data;
};

export const resendVerificationCode = async (): Promise<{ success: boolean; message: string }> => {
  const { data } = await api.post<{ success: boolean; message: string }>('/auth/resend-verification');
  return data;
};

export const verifyTwoFactorAndLogin = async (userId: string, code: string): Promise<AuthResponse> => {
  const { data } = await api.post<AuthResponse>('/auth/verify-two-factor', { userId, code });
  if (data.token) {
    localStorage.setItem('token', data.token);
  }
  return data;
};

