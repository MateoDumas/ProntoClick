import { ReactNode } from 'react';
import { useGoogleMaps } from '../../contexts/GoogleMapsContext';

interface GoogleMapsLoaderProps {
  children: ReactNode;
}

export default function GoogleMapsLoader({ children }: GoogleMapsLoaderProps) {
  const { isLoaded, loadError } = useGoogleMaps();

  if (loadError) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-600">Error al cargar Google Maps. Verifica tu API key.</p>
        <p className="text-xs text-red-500 mt-1">{loadError.message}</p>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
        <span className="ml-3 text-gray-600">Cargando mapa...</span>
      </div>
    );
  }

  return <>{children}</>;
}

