import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useVerifyEmail, useResendVerificationCode, useCurrentUser } from '../hooks/useAuth';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { useToast } from '../hooks/useToast';
import Loader from '../components/ui/Loader';

export default function VerifyEmail() {
  const router = useRouter();
  const { data: user, isLoading: userLoading } = useCurrentUser();
  const verifyMutation = useVerifyEmail();
  const resendMutation = useResendVerificationCode();
  const { success, error: toastError } = useToast();
  const [code, setCode] = useState('');
  const [errors, setErrors] = useState<{ code?: string; general?: string }>({});
  const [countdown, setCountdown] = useState(0);

  // Redirigir si el usuario no está logueado o ya está verificado
  useEffect(() => {
    if (!userLoading) {
      if (!user) {
        router.push('/login');
        return;
      }
      if (user.emailVerified) {
        router.push('/');
        return;
      }
    }
  }, [user, userLoading, router]);

  // Countdown para reenvío
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    if (!code.trim()) {
      setErrors({ code: 'El código es requerido' });
      return;
    }

    if (code.length !== 6 || !/^\d+$/.test(code)) {
      setErrors({ code: 'El código debe tener 6 dígitos numéricos' });
      return;
    }

    try {
      const result = await verifyMutation.mutateAsync(code);
      if (result.success) {
        success('¡Email verificado correctamente!');
        setTimeout(() => {
          router.push('/');
        }, 1500);
      }
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Código de verificación incorrecto';
      setErrors({ general: errorMessage });
      toastError(errorMessage);
    }
  };

  const handleResend = async () => {
    if (countdown > 0) return;

    try {
      await resendMutation.mutateAsync();
      success('Código de verificación reenviado. Revisa tu email.');
      setCountdown(60); // 60 segundos de espera
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Error al reenviar código';
      toastError(errorMessage);
    }
  };

  if (userLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader text="Cargando..." />
      </div>
    );
  }

  if (!user || user.emailVerified) {
    return null; // El useEffect redirigirá
  }

  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-red-600 to-red-700 rounded-2xl mb-4 shadow-lg">
            <span className="text-white font-bold text-2xl">🔐</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Verifica tu Email
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Hemos enviado un código de verificación a
          </p>
          <p className="text-gray-900 dark:text-gray-100 font-semibold mt-1">
            {user.email}
          </p>
        </div>

        {/* Form */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-8 transition-colors duration-200">
          {errors.general && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-sm text-red-600 dark:text-red-400">{errors.general}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Código de Verificación
              </label>
              <Input
                type="text"
                placeholder="000000"
                value={code}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                  setCode(value);
                  if (errors.code) {
                    setErrors((prev) => ({ ...prev, code: undefined }));
                  }
                }}
                error={errors.code}
                required
                maxLength={6}
                className="text-center text-2xl tracking-widest font-mono"
                autoFocus
              />
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Ingresa el código de 6 dígitos que recibiste por email
              </p>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={verifyMutation.isPending || code.length !== 6}
            >
              {verifyMutation.isPending ? 'Verificando...' : 'Verificar Email'}
            </Button>
          </form>

          {/* Resend Code */}
          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400 text-center mb-3">
              ¿No recibiste el código?
            </p>
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={handleResend}
              disabled={resendMutation.isPending || countdown > 0}
            >
              {countdown > 0
                ? `Reenviar en ${countdown}s`
                : resendMutation.isPending
                ? 'Enviando...'
                : 'Reenviar Código'}
            </Button>
          </div>

          {/* Info Box */}
          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <p className="text-sm text-blue-800 dark:text-blue-300">
              <strong>💡 Consejo:</strong> Revisa tu carpeta de spam si no encuentras el email. 
              El código expira en 15 minutos.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

