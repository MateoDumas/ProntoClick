import { ReactNode } from 'react';
import { useGoogleMaps } from '../../contexts/GoogleMapsContext';

interface GoogleMapsLoaderProps {
  children: ReactNode;
}

export default function GoogleMapsLoader({ children }: GoogleMapsLoaderProps) {
  const { isLoaded, loadError } = useGoogleMaps();

  if (loadError) {
    return (
      <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg transition-colors duration-200">
        <p className="text-red-600 dark:text-red-400 font-medium">Error al cargar Google Maps. Verifica tu API key.</p>
        <p className="text-xs text-red-500 dark:text-red-400 mt-1">{loadError.message}</p>
        <div className="mt-3 text-xs text-gray-600 dark:text-gray-400">
          <p className="font-semibold mb-1">Para configurar tu API key:</p>
          <ol className="list-decimal list-inside space-y-1 ml-2">
            <li>Crea un archivo <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">.env.local</code> en la carpeta Frontend</li>
            <li>Agrega: <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=tu_api_key_aqui</code></li>
            <li>Reinicia el servidor de desarrollo</li>
          </ol>
          <p className="mt-2 text-blue-600 dark:text-blue-400">
            <a href="/OBTENER_GOOGLE_MAPS_API_KEY.md" target="_blank" className="underline hover:no-underline">
              Ver guía completa para obtener la API key →
            </a>
          </p>
        </div>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 dark:border-red-400"></div>
        <span className="ml-3 text-gray-600 dark:text-gray-400">Cargando mapa...</span>
      </div>
    );
  }

  return <>{children}</>;
}

