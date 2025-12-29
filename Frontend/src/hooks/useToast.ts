import { showToast, removeToast } from '../components/ui/ToastContainer';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export function useToast() {
  return {
    showToast,
    removeToast,
    success: (message: string) => showToast(message, 'success'),
    error: (message: string) => showToast(message, 'error'),
    info: (message: string) => showToast(message, 'info'),
    warning: (message: string) => showToast(message, 'warning'),
  };
}
