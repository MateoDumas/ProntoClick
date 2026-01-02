import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { useRegister } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';

export default function Register() {
  const router = useRouter();
  const registerMutation = useRegister();
  const { success, error: toastError } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    referralCode: '',
  });

  // Obtener código de referido de la URL
  useEffect(() => {
    const refCode = router.query.ref as string;
    if (refCode) {
      setFormData(prev => ({ ...prev, referralCode: refCode.toUpperCase() }));
    }
  }, [router.query]);
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
    general?: string;
  }>({});

  const validateForm = (): boolean => {
    const newErrors: typeof errors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es requerido';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'El nombre debe tener al menos 2 caracteres';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'El email es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'El email no es válido';
    }

    if (!formData.password) {
      newErrors.password = 'La contraseña es requerida';
    } else if (formData.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Confirma tu contraseña';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      const result = await registerMutation.mutateAsync({
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
        referralCode: formData.referralCode.trim() || undefined,
      });
      
      success('¡Cuenta creada exitosamente! Revisa tu email para verificar tu cuenta.');
      
      // Si requiere verificación, el hook ya redirigirá a /verify-email
      // Si no, redirigir normalmente
      if (!result.requiresVerification) {
        const redirect = (router.query.redirect as string) || '/';
        router.push(redirect);
      }
    } catch (error: any) {
      let errorMessage = 'Error al registrarse. Intenta de nuevo.';
      
      // Manejar errores de conexión
      if (error?.isConnectionError || error?.code === 'ERR_NETWORK' || error?.message?.includes('conectar')) {
        errorMessage = 'No se pudo conectar con el servidor. Verifica que el backend esté corriendo en http://localhost:3001';
      } else if (error?.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error?.message) {
        errorMessage = error.message;
      }
      
      setErrors({
        general: errorMessage,
      });
      toastError(errorMessage);
      
      // Si el error es específico del email, mostrarlo en el campo
      if (errorMessage.toLowerCase().includes('email')) {
        setErrors((prev) => ({
          ...prev,
          email: errorMessage,
        }));
      }
    }
  };

  const handleChange = (
    field: 'name' | 'email' | 'password' | 'confirmPassword',
    value: string
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-red-600 to-red-700 rounded-2xl mb-4 shadow-lg">
            <span className="text-white font-bold text-2xl">P</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">Crea tu cuenta</h1>
          <p className="text-gray-600 dark:text-gray-400">Únete a ProntoClick y disfruta de la mejor comida</p>
        </div>

        {/* Form */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-8 transition-colors duration-200">
          {errors.general && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{errors.general}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Nombre completo"
              type="text"
              placeholder="Juan Pérez"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              error={errors.name}
              required
              autoComplete="name"
            />

            <Input
              label="Email"
              type="email"
              placeholder="tu@email.com"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              error={errors.email}
              required
              autoComplete="email"
            />

            <Input
              label="Contraseña"
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => handleChange('password', e.target.value)}
              error={errors.password}
              required
              autoComplete="new-password"
            />

            <Input
              label="Confirmar contraseña"
              type="password"
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={(e) => handleChange('confirmPassword', e.target.value)}
              error={errors.confirmPassword}
              required
              autoComplete="new-password"
            />

            <div>
              <Input
                label="Código de referido (opcional)"
                type="text"
                placeholder="ABC12345"
                value={formData.referralCode}
                onChange={(e) => setFormData(prev => ({ ...prev, referralCode: e.target.value.toUpperCase().trim() }))}
                autoComplete="off"
                maxLength={8}
              />
              {formData.referralCode && (
                <div className="mt-2 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3">
                  <p className="text-sm text-green-800 dark:text-green-300">
                    <span className="font-semibold">Código de referido aplicado:</span> {formData.referralCode}
                  </p>
                  <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                    ¡Ganarás puntos de bienvenida al registrarte y tu amigo también recibirá una recompensa!
                  </p>
                </div>
              )}
            </div>

            <div className="flex items-start">
              <input
                type="checkbox"
                className="mt-1 rounded border-gray-300 dark:border-gray-600 text-red-600 dark:text-red-500 focus:ring-red-500 dark:focus:ring-red-400"
                required
              />
              <label className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                Acepto los{' '}
                <Link href="/terms" className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-500 transition-colors">
                  términos y condiciones
                </Link>{' '}
                y la{' '}
                <Link href="/privacy" className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-500 transition-colors">
                  política de privacidad
                </Link>
              </label>
            </div>

            <Button 
              type="submit" 
              className="w-full" 
              disabled={registerMutation.isPending}
            >
              {registerMutation.isPending ? 'Creando cuenta...' : 'Crear Cuenta'}
            </Button>
          </form>

          {/* Divider */}
          <div className="mt-6 mb-6 flex items-center">
            <div className="flex-1 border-t border-gray-200"></div>
            <span className="px-4 text-sm text-gray-500">o</span>
            <div className="flex-1 border-t border-gray-200"></div>
          </div>

          {/* Login Link */}
          <div className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              ¿Ya tienes una cuenta?{' '}
              <Link
                href="/login"
                className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-500 font-semibold transition-colors"
              >
                Inicia sesión aquí
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

