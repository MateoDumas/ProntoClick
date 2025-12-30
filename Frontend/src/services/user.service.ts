import { api } from './api';
import type { User } from '../types/user';

export interface UpdateProfileDto {
  name?: string;
  email?: string;
  avatar?: string;
}

export interface ChangePasswordDto {
  currentPassword: string;
  newPassword: string;
}

export const updateProfile = async (data: UpdateProfileDto): Promise<User> => {
  const { data: user } = await api.patch<User>('/users/me', data);
  return user;
};

export const changePassword = async (data: ChangePasswordDto): Promise<void> => {
  await api.patch('/users/me/password', data);
};

export const deleteAccount = async (password: string): Promise<void> => {
  await api.delete('/users/me', { data: { password } });
};


