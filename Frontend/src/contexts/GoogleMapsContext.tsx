import { createContext, useContext, ReactNode } from 'react';
import { useLoadScript } from '@react-google-maps/api';

const libraries: ('places' | 'drawing' | 'geometry' | 'visualization')[] = ['places'];

interface GoogleMapsContextType {
  isLoaded: boolean;
  loadError: Error | undefined;
}

const GoogleMapsContext = createContext<GoogleMapsContextType>({
  isLoaded: false,
  loadError: undefined,
});

export function GoogleMapsProvider({ children }: { children: ReactNode }) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '';
  
  // Si no hay API key, no intentar cargar Google Maps
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: apiKey,
    libraries: apiKey ? libraries : [],
    id: 'google-maps-script', // ID único para evitar múltiples cargas
    ...(apiKey ? {} : { loadingElement: <div /> }), // No cargar si no hay key
  });

  // Si no hay API key, marcar como "cargado" pero sin funcionalidad
  const finalIsLoaded = !apiKey ? false : isLoaded;
  const finalLoadError = !apiKey 
    ? new Error('NEXT_PUBLIC_GOOGLE_MAPS_API_KEY no está configurada') 
    : loadError;

  return (
    <GoogleMapsContext.Provider value={{ isLoaded: finalIsLoaded, loadError: finalLoadError }}>
      {children}
    </GoogleMapsContext.Provider>
  );
}

export function useGoogleMaps() {
  const context = useContext(GoogleMapsContext);
  if (!context) {
    throw new Error('useGoogleMaps must be used within GoogleMapsProvider');
  }
  return context;
}

