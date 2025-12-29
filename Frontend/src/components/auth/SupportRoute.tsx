import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useCurrentUser } from '../../hooks/useAuth';
import Loader from '../ui/Loader';

interface SupportRouteProps {
  children: React.ReactNode;
}

export default function SupportRoute({ children }: SupportRouteProps) {
  const { data: user, isLoading } = useCurrentUser();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.push('/login?returnTo=' + router.asPath);
        return;
      }

      if (user.role !== 'support' && user.role !== 'admin') {
        router.push('/');
        return;
      }
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader />
      </div>
    );
  }

  if (!user || (user.role !== 'support' && user.role !== 'admin')) {
    return null;
  }

  return <>{children}</>;
}

