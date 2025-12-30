import { useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { useCurrentUser } from '../../hooks/useAuth';
import Loader from '../ui/Loader';

interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
}

export default function ProtectedRoute({ 
  children, 
  redirectTo = '/login' 
}: ProtectedRouteProps) {
  const router = useRouter();
  const { data: user, isLoading } = useCurrentUser();
  const hasRedirected = useRef(false);

  useEffect(() => {
    // Evitar redirecciones múltiples
    if (hasRedirected.current) return;
    
    if (!isLoading) {
      if (!user) {
        hasRedirected.current = true;
        // Guardar la URL actual para redirigir después del login
        const currentPath = router.asPath;
        // Solo redirigir si no estamos ya en la página de login o verificación
        if (currentPath !== redirectTo && !currentPath.startsWith(redirectTo) && currentPath !== '/verify-email') {
          router.push(`${redirectTo}?redirect=${encodeURIComponent(currentPath)}`);
        }
      } else if (!user.emailVerified && router.asPath !== '/verify-email') {
        // Si el usuario no ha verificado su email, redirigir a verificación
        hasRedirected.current = true;
        router.push('/verify-email');
      }
    }
  }, [user, isLoading, redirectTo, router]); // Agregar router a las dependencias

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
        <Loader text="Verificando autenticación..." />
      </div>
    );
  }

  if (!user) {
    return null; // El useEffect redirigirá
  }

  // Si el usuario no ha verificado su email, no mostrar el contenido
  if (!user.emailVerified) {
    return null; // El useEffect redirigirá a /verify-email
  }

  return <>{children}</>;
}

