import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import Toast, { ToastType } from './Toast';

interface ToastState {
  message: string;
  type: ToastType;
  id: string;
}

let toastId = 0;
let globalToasts: ToastState[] = [];
let listeners: Array<() => void> = [];

const notify = () => {
  listeners.forEach((listener) => listener());
};

export const showToast = (message: string, type: ToastType = 'info') => {
  const id = `toast-${++toastId}`;
  globalToasts = [...globalToasts, { message, type, id }];
  notify();
  
  // Auto-remove after 3 seconds
  setTimeout(() => {
    globalToasts = globalToasts.filter((t) => t.id !== id);
    notify();
  }, 3000);
};

export const removeToast = (id: string) => {
  globalToasts = globalToasts.filter((toast) => toast.id !== id);
  notify();
};

export default function ToastContainer() {
  const [toasts, setToasts] = useState<ToastState[]>([]);

  useEffect(() => {
    const update = () => setToasts([...globalToasts]);
    listeners.push(update);
    update();
    
    return () => {
      listeners = listeners.filter((l) => l !== update);
    };
  }, []);

  if (typeof window === 'undefined' || toasts.length === 0) return null;

  return createPortal(
    <div className="fixed top-4 right-4 z-50 space-y-3">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </div>,
    document.body
  );
}

