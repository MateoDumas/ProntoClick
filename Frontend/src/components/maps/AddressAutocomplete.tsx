import { useRef, useEffect } from 'react';
import { useGoogleMaps } from '../../contexts/GoogleMapsContext';
import Input from '../ui/Input';

interface AddressAutocompleteProps {
  value: string;
  onChange: (address: string, details?: google.maps.places.PlaceResult) => void;
  placeholder?: string;
  label?: string;
  error?: string;
  onLocationSelect?: (location: { lat: number; lng: number }) => void;
}

export default function AddressAutocomplete({
  value,
  onChange,
  placeholder = 'Buscar dirección...',
  label,
  error,
  onLocationSelect,
}: AddressAutocompleteProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  const { isLoaded: scriptsLoaded } = useGoogleMaps();

  useEffect(() => {
    if (scriptsLoaded && inputRef.current && !autocompleteRef.current) {
      const autocomplete = new google.maps.places.Autocomplete(inputRef.current, {
        types: ['address'],
        componentRestrictions: { country: ['ar', 'mx', 'co', 'cl', 'pe'] }, // Países de Latinoamérica
        fields: ['formatted_address', 'geometry', 'address_components'],
      });

      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        
        if (place.formatted_address) {
          onChange(place.formatted_address, place);
          
          if (place.geometry?.location && onLocationSelect) {
            onLocationSelect({
              lat: place.geometry.location.lat(),
              lng: place.geometry.location.lng(),
            });
          }
        }
      });

      autocompleteRef.current = autocomplete;
    }

    return () => {
      if (autocompleteRef.current) {
        google.maps.event.clearInstanceListeners(autocompleteRef.current);
      }
    };
  }, [scriptsLoaded, onChange, onLocationSelect]);

  return (
    <div>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}
      <Input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        error={error}
        className="w-full"
      />
      {!scriptsLoaded && (
        <p className="text-xs text-gray-500 mt-1">Cargando autocompletado...</p>
      )}
    </div>
  );
}

