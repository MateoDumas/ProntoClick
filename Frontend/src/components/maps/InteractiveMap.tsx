import { useState, useCallback, useRef, useEffect } from 'react';
import { GoogleMap, Marker } from '@react-google-maps/api';
import { useGoogleMaps } from '../../contexts/GoogleMapsContext';

const mapContainerStyle = {
  width: '100%',
  height: '400px',
};

const defaultCenter = {
  lat: -34.6037, // Buenos Aires por defecto
  lng: -58.3816,
};

interface InteractiveMapProps {
  initialLocation?: { lat: number; lng: number };
  onLocationChange?: (location: { lat: number; lng: number }) => void;
  markerLabel?: string;
  zoom?: number;
  className?: string;
}

export default function InteractiveMap({
  initialLocation,
  onLocationChange,
  markerLabel = 'Tu ubicación',
  zoom = 15,
  className = '',
}: InteractiveMapProps) {
  const [center, setCenter] = useState(initialLocation || defaultCenter);
  const [markerPosition, setMarkerPosition] = useState(initialLocation || defaultCenter);
  const mapRef = useRef<google.maps.Map | null>(null);

  const { isLoaded } = useGoogleMaps();

  // Detectar ubicación del usuario
  useEffect(() => {
    if (navigator.geolocation && !initialLocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setCenter(userLocation);
          setMarkerPosition(userLocation);
          if (onLocationChange) {
            onLocationChange(userLocation);
          }
        },
        (error) => {
          console.error('Error obteniendo ubicación:', error);
        }
      );
    } else if (initialLocation) {
      setCenter(initialLocation);
      setMarkerPosition(initialLocation);
    }
  }, [initialLocation, onLocationChange]);

  const onMapClick = useCallback(
    (e: google.maps.MapMouseEvent) => {
      if (e.latLng) {
        const newLocation = {
          lat: e.latLng.lat(),
          lng: e.latLng.lng(),
        };
        setMarkerPosition(newLocation);
        if (onLocationChange) {
          onLocationChange(newLocation);
        }
      }
    },
    [onLocationChange]
  );

  const onMapLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
  }, []);

  if (!isLoaded) {
    return (
      <div className={`flex items-center justify-center bg-gray-100 rounded-lg ${className}`} style={mapContainerStyle}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Cargando mapa...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`rounded-lg overflow-hidden border border-gray-200 shadow-sm ${className}`}>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={center}
        zoom={zoom}
        onClick={onMapClick}
        onLoad={onMapLoad}
        options={{
          disableDefaultUI: false,
          zoomControl: true,
          streetViewControl: false,
          mapTypeControl: false,
          fullscreenControl: true,
        }}
      >
        <Marker
          position={markerPosition}
          label={markerLabel}
          draggable={true}
          onDragEnd={(e) => {
            if (e.latLng) {
              const newLocation = {
                lat: e.latLng.lat(),
                lng: e.latLng.lng(),
              };
              setMarkerPosition(newLocation);
              if (onLocationChange) {
                onLocationChange(newLocation);
              }
            }
          }}
        />
      </GoogleMap>
    </div>
  );
}

