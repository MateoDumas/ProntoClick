import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { useToast } from '../hooks/useToast';

type Step = 'email' | 'method' | 'code' | 'securityQuestion' | 'reset';

type VerificationMethod = 'email' | 'sms' | 'securityQuestion';

export default function ForgotPassword() {
  const router = useRouter();
  const { success, error: toastError } = useToast();
  const [step, setStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const [availableMethods, setAvailableMethods] = useState<VerificationMethod[]>([]);
  const [selectedMethod, setSelectedMethod] = useState<VerificationMethod | null>(null);
  const [code, setCode] = useState('');
  const [securityAnswer, setSecurityAnswer] = useState('');
  const [securityQuestion, setSecurityQuestion] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{
    email?: string;
    code?: string;
    securityAnswer?: string;
    newPassword?: string;
    confirmPassword?: string;
    general?: string;
  }>({});

  const validateEmail = (): boolean => {
    const newErrors: typeof errors = {};
    if (!email.trim()) {
      newErrors.email = 'El email es requerido';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'El email no es válido';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateCode = (): boolean => {
    const newErrors: typeof errors = {};
    if (!code.trim()) {
      newErrors.code = 'El código es requerido';
    } else if (code.length !== 6) {
      newErrors.code = 'El código debe tener 6 dígitos';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateSecurityAnswer = (): boolean => {
    const newErrors: typeof errors = {};
    if (!securityAnswer.trim()) {
      newErrors.securityAnswer = 'La respuesta es requerida';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePassword = (): boolean => {
    const newErrors: typeof errors = {};
    if (!newPassword) {
      newErrors.newPassword = 'La contraseña es requerida';
    } else if (newPassword.length < 6) {
      newErrors.newPassword = 'La contraseña debe tener al menos 6 caracteres';
    }
    if (!confirmPassword) {
      newErrors.confirmPassword = 'Confirma tu contraseña';
    } else if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateEmail()) return;

    setLoading(true);
    setErrors({});

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Error al solicitar recuperación');
      }

      const data = await response.json();
      
      // Si solo hay un método disponible (email), enviar código directamente
      if (data.availableMethods && data.availableMethods.length === 1) {
        success(data.message || 'Código de recuperación enviado');
        setStep('code');
      } else if (data.availableMethods && data.availableMethods.length > 1) {
        // Si hay múltiples métodos, mostrar selección
        setAvailableMethods(data.availableMethods);
        setStep('method');
      } else {
        // Fallback al método anterior
        success('Si el email existe, recibirás un código de recuperación');
        setStep('code');
      }
    } catch (error: any) {
      setErrors({ general: error.message || 'Error al solicitar recuperación' });
      toastError(error.message || 'Error al solicitar recuperación');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectMethod = async (method: VerificationMethod) => {
    setSelectedMethod(method);
    setLoading(true);
    setErrors({});

    try {
      if (method === 'securityQuestion') {
        // Para preguntas de seguridad, primero necesitamos obtener la pregunta
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/forgot-password/get-security-question`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email }),
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.message || 'Error al obtener pregunta de seguridad');
        }

        const data = await response.json();
        if (data.question) {
          setSecurityQuestion(data.question);
          setStep('securityQuestion');
        } else {
          throw new Error('Pregunta de seguridad no configurada');
        }
        setLoading(false);
        return;
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/forgot-password/method`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, method }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Error al enviar código');
      }

      success('Código de recuperación enviado');
      setStep('code');
    } catch (error: any) {
      setErrors({ general: error.message || 'Error al procesar método' });
      toastError(error.message || 'Error al procesar método');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifySecurityQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateSecurityAnswer()) return;

    setLoading(true);
    setErrors({});

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/forgot-password/verify-security-question`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, answer: securityAnswer }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Respuesta incorrecta');
      }

      success('Pregunta de seguridad verificada. Código de recuperación enviado por email');
      setStep('code');
    } catch (error: any) {
      setErrors({ general: error.message || 'Error al verificar pregunta de seguridad' });
      toastError(error.message || 'Error al verificar pregunta de seguridad');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateCode()) return;

    setStep('reset');
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validatePassword()) return;

    setLoading(true);
    setErrors({});

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          code,
          newPassword,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Error al restablecer contraseña');
      }

      success('Contraseña restablecida correctamente');
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    } catch (error: any) {
      setErrors({ general: error.message || 'Error al restablecer contraseña' });
      toastError(error.message || 'Error al restablecer contraseña');
    } finally {
      setLoading(false);
    }
  };

  const getMethodLabel = (method: VerificationMethod): string => {
    switch (method) {
      case 'email':
        return '📧 Email';
      case 'sms':
        return '📱 SMS';
      case 'securityQuestion':
        return '🔒 Pregunta de Seguridad';
      default:
        return method;
    }
  };

  const getMethodDescription = (method: VerificationMethod): string => {
    switch (method) {
      case 'email':
        return 'Recibirás un código por email';
      case 'sms':
        return 'Recibirás un código por SMS';
      case 'securityQuestion':
        return 'Responde tu pregunta de seguridad';
      default:
        return '';
    }
  };

  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center px-4 py-8 sm:py-12">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-red-600 to-red-700 rounded-2xl mb-3 sm:mb-4 shadow-lg">
            <span className="text-white font-bold text-xl sm:text-2xl">🔑</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            {step === 'email' && 'Recuperar Contraseña'}
            {step === 'method' && 'Selecciona Método de Verificación'}
            {step === 'code' && 'Verificar Código'}
            {step === 'securityQuestion' && 'Pregunta de Seguridad'}
            {step === 'reset' && 'Nueva Contraseña'}
          </h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
            {step === 'email' && 'Ingresa tu email para ver los métodos de recuperación disponibles'}
            {step === 'method' && 'Elige cómo quieres verificar tu identidad'}
            {step === 'code' && 'Ingresa el código de 6 dígitos que recibiste'}
            {step === 'securityQuestion' && 'Responde tu pregunta de seguridad para continuar'}
            {step === 'reset' && 'Crea una nueva contraseña para tu cuenta'}
          </p>
        </div>

        {/* Form */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 sm:p-8 transition-colors duration-200">
          {errors.general && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg">
              <p className="text-sm text-red-600 dark:text-red-400">{errors.general}</p>
            </div>
          )}

          {step === 'email' && (
            <form onSubmit={handleRequestReset} className="space-y-5">
              <Input
                label="Email"
                type="email"
                placeholder="tu@email.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) {
                    setErrors((prev) => ({ ...prev, email: undefined }));
                  }
                }}
                error={errors.email}
                required
                autoComplete="email"
              />

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Verificando...' : 'Continuar'}
              </Button>

              <div className="text-center">
                <Link
                  href="/login"
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                >
                  ← Volver a iniciar sesión
                </Link>
              </div>
            </form>
          )}

          {step === 'method' && (
            <div className="space-y-4">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Selecciona un método de verificación para recuperar tu contraseña:
              </p>

              {availableMethods.map((method) => (
                <button
                  key={method}
                  type="button"
                  onClick={() => handleSelectMethod(method)}
                  disabled={loading}
                  className="w-full p-4 border-2 border-gray-200 dark:border-gray-700 rounded-lg hover:border-red-500 dark:hover:border-red-500 transition-colors text-left disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="font-semibold text-gray-900 dark:text-gray-100">
                    {getMethodLabel(method)}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {getMethodDescription(method)}
                  </div>
                </button>
              ))}

              <div className="text-center mt-4">
                <button
                  type="button"
                  onClick={() => setStep('email')}
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
                >
                  ← Cambiar email
                </button>
              </div>
            </div>
          )}

          {step === 'securityQuestion' && (
            <form onSubmit={handleVerifySecurityQuestion} className="space-y-5">
              <div className="mb-4 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg">
                <p className="text-sm text-blue-800 dark:text-blue-200 mb-2">
                  <strong>Pregunta de Seguridad:</strong>
                </p>
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  {securityQuestion || 'Responde tu pregunta de seguridad configurada'}
                </p>
              </div>

              <Input
                label="Respuesta"
                type="text"
                placeholder="Tu respuesta"
                value={securityAnswer}
                onChange={(e) => {
                  setSecurityAnswer(e.target.value);
                  if (errors.securityAnswer) {
                    setErrors((prev) => ({ ...prev, securityAnswer: undefined }));
                  }
                }}
                error={errors.securityAnswer}
                required
              />

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Verificando...' : 'Verificar'}
              </Button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setStep('method')}
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
                >
                  ← Volver a métodos
                </button>
              </div>
            </form>
          )}

          {step === 'code' && (
            <form onSubmit={handleVerifyCode} className="space-y-5">
              <div className="mb-4 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg">
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  {selectedMethod === 'sms' 
                    ? `Revisa tu teléfono para encontrar el código de recuperación.`
                    : `Revisa tu email <strong>${email}</strong> para encontrar el código de recuperación.`}
                </p>
              </div>

              <Input
                label="Código de Recuperación"
                type="text"
                placeholder="000000"
                value={code}
                onChange={(e) => {
                  setCode(e.target.value.replace(/\D/g, '').slice(0, 6));
                  if (errors.code) {
                    setErrors((prev) => ({ ...prev, code: undefined }));
                  }
                }}
                error={errors.code}
                required
                maxLength={6}
                autoComplete="one-time-code"
              />

              <Button type="submit" className="w-full">
                Verificar Código
              </Button>

              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => {
                    if (availableMethods.length > 1) {
                      setStep('method');
                    } else {
                      setStep('email');
                    }
                  }}
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
                >
                  ← Volver
                </button>
                <button
                  type="button"
                  onClick={async () => {
                    if (selectedMethod) {
                      await handleSelectMethod(selectedMethod);
                    } else {
                      // Reenviar código por email por defecto
                      setLoading(true);
                      try {
                        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/forgot-password/method`, {
                          method: 'POST',
                          headers: {
                            'Content-Type': 'application/json',
                          },
                          body: JSON.stringify({ email, method: 'email' }),
                        });
                        if (response.ok) {
                          success('Código reenviado');
                        }
                      } catch (error) {
                        toastError('Error al reenviar código');
                      } finally {
                        setLoading(false);
                      }
                    }
                  }}
                  className="text-sm text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-500 transition-colors"
                >
                  Reenviar código
                </button>
              </div>
            </form>
          )}

          {step === 'reset' && (
            <form onSubmit={handleResetPassword} className="space-y-5">
              <Input
                label="Nueva Contraseña"
                type="password"
                placeholder="••••••••"
                value={newPassword}
                onChange={(e) => {
                  setNewPassword(e.target.value);
                  if (errors.newPassword) {
                    setErrors((prev) => ({ ...prev, newPassword: undefined }));
                  }
                }}
                error={errors.newPassword}
                required
                autoComplete="new-password"
              />

              <Input
                label="Confirmar Contraseña"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  if (errors.confirmPassword) {
                    setErrors((prev) => ({ ...prev, confirmPassword: undefined }));
                  }
                }}
                error={errors.confirmPassword}
                required
                autoComplete="new-password"
              />

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Restableciendo...' : 'Restablecer Contraseña'}
              </Button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setStep('code')}
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
                >
                  ← Volver
                </button>
              </div>
            </form>
          )}

          {/* Divider */}
          {step !== 'method' && step !== 'securityQuestion' && (
            <>
              <div className="mt-6 mb-6 flex items-center">
                <div className="flex-1 border-t border-gray-200 dark:border-gray-700"></div>
                <span className="px-4 text-sm text-gray-500 dark:text-gray-400">o</span>
                <div className="flex-1 border-t border-gray-200 dark:border-gray-700"></div>
              </div>

              {/* Register Link */}
              <div className="text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  ¿No tienes una cuenta?{' '}
                  <Link
                    href="/register"
                    className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-500 font-semibold transition-colors"
                  >
                    Regístrate aquí
                  </Link>
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
