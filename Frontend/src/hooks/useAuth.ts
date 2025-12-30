import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import { login, register, logout, getCurrentUser, verifyEmail, resendVerificationCode } from '../services/auth.service';
import { updateProfile, changePassword, deleteAccount, type UpdateProfileDto, type ChangePasswordDto } from '../services/user.service';
import { User } from '../types';
import type { LoginDto, RegisterDto } from '../services/auth.service';

export const useCurrentUser = () =>
  useQuery<User | null>({
    queryKey: ['me'],
    queryFn: async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return null;
        return await getCurrentUser();
      } catch {
        return null;
      }
    },
    retry: false,
    staleTime: 1000 * 60 * 5, // 5 minutos - evitar refetch constante
    gcTime: 1000 * 60 * 10, // 10 minutos (antes cacheTime)
  });

export const useLogin = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: login,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['me'] });
    },
  });
};

export const useRegister = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: register,
    onSuccess: (data) => {
      // Actualizar el cache con el usuario
      queryClient.setQueryData(['me'], data.user);
      queryClient.invalidateQueries({ queryKey: ['me'] });
      
      // Si requiere verificación, redirigir a la página de verificación
      if (data.requiresVerification) {
        router.push('/verify-email');
      }
    },
    onError: (error: any) => {
      // El error se manejará en el componente
      console.error('Registration error:', error);
    },
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      queryClient.setQueryData(['me'], null);
      router.push('/login');
    },
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateProfile,
    onSuccess: (data) => {
      queryClient.setQueryData(['me'], data);
      queryClient.invalidateQueries({ queryKey: ['me'] });
    },
  });
};

export const useChangePassword = () => {
  return useMutation({
    mutationFn: changePassword,
  });
};

export const useDeleteAccount = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (password: string) => deleteAccount(password),
    onSuccess: () => {
      // Limpiar cache y token
      queryClient.setQueryData(['me'], null);
      localStorage.removeItem('token');
      // Redirigir al login
      router.push('/login');
    },
  });
};

export const useVerifyEmail = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: verifyEmail,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['me'] });
    },
  });
};

export const useResendVerificationCode = () => {
  return useMutation({
    mutationFn: resendVerificationCode,
  });
};
