import { useState, useEffect } from 'react';
import { Address, CreateAddressDto } from '../../services/address.service';
import AddressAutocomplete from '../maps/AddressAutocomplete';
import InteractiveMap from '../maps/InteractiveMap';
import GoogleMapsLoader from '../maps/GoogleMapsLoader';
import { Location } from '../../utils/maps';

interface AddressFormProps {
  address?: Address;
  onSubmit: (data: CreateAddressDto) => Promise<void>;
  onCancel?: () => void;
}

export default function AddressForm({ address, onSubmit, onCancel }: AddressFormProps) {
  const [formData, setFormData] = useState<CreateAddressDto>({
    label: address?.label || '',
    street: address?.street || '',
    city: address?.city || '',
    zipCode: address?.zipCode || '',
    notes: address?.notes || '',
    isDefault: address?.isDefault || false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [showMap, setShowMap] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSubmit(formData);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="glass rounded-xl p-6 border border-white/20">
      <h3 className="text-xl font-bold text-white mb-4">
        {address ? 'Editar dirección' : 'Nueva dirección'}
      </h3>

      <div className="space-y-4">
        <div>
          <label htmlFor="label" className="block text-white mb-2">
            Etiqueta (ej: Casa, Trabajo)
          </label>
          <input
            id="label"
            type="text"
            value={formData.label}
            onChange={(e) => setFormData({ ...formData, label: e.target.value })}
            required
            className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
            placeholder="Casa"
          />
        </div>

        <div>
          <GoogleMapsLoader>
            <AddressAutocomplete
              label="Dirección"
              value={formData.street}
              onChange={(address, place) => {
                setFormData({ ...formData, street: address });
                if (place?.address_components) {
                  // Extraer ciudad y código postal automáticamente
                  let city = formData.city;
                  let zipCode = formData.zipCode;
                  
                  place.address_components.forEach((component: { types: string[]; long_name: string }) => {
                    if (component.types.includes('locality') || component.types.includes('administrative_area_level_2')) {
                      city = component.long_name;
                    }
                    if (component.types.includes('postal_code')) {
                      zipCode = component.long_name;
                    }
                  });
                  
                  setFormData({ ...formData, street: address, city, zipCode });
                }
                if (place?.geometry?.location) {
                  setSelectedLocation({
                    lat: place.geometry.location.lat(),
                    lng: place.geometry.location.lng(),
                  });
                }
              }}
              onLocationSelect={(location) => {
                setSelectedLocation(location);
              }}
              placeholder="Buscar dirección..."
            />
          </GoogleMapsLoader>
          
          <button
            type="button"
            onClick={() => setShowMap(!showMap)}
            className="mt-2 text-sm text-red-300 hover:text-red-200 underline"
          >
            {showMap ? 'Ocultar mapa' : 'Mostrar en mapa'}
          </button>
          
          {showMap && (
            <div className="mt-4">
              <GoogleMapsLoader>
                <InteractiveMap
                  initialLocation={selectedLocation || undefined}
                  onLocationChange={(location) => {
                    setSelectedLocation(location);
                  }}
                  markerLabel="Dirección de entrega"
                />
              </GoogleMapsLoader>
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="city" className="block text-white mb-2">
              Ciudad
            </label>
            <input
              id="city"
              type="text"
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              required
              className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          <div>
            <label htmlFor="zipCode" className="block text-white mb-2">
              Código Postal
            </label>
            <input
              id="zipCode"
              type="text"
              value={formData.zipCode}
              onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
              required
              className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
        </div>

        <div>
          <label htmlFor="notes" className="block text-white mb-2">
            Notas adicionales (opcional)
          </label>
          <textarea
            id="notes"
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            rows={2}
            className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
            placeholder="Instrucciones de entrega..."
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            id="isDefault"
            type="checkbox"
            checked={formData.isDefault}
            onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
            className="w-4 h-4 rounded border-white/20 bg-white/10 text-red-500 focus:ring-red-500"
          />
          <label htmlFor="isDefault" className="text-white text-sm">
            Establecer como dirección predeterminada
          </label>
        </div>
      </div>

      <div className="flex gap-3 mt-6">
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-2 rounded-lg font-semibold hover:from-red-600 hover:to-red-700 transition-all disabled:opacity-50"
        >
          {isSubmitting ? 'Guardando...' : 'Guardar'}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 rounded-lg border border-white/20 text-white hover:bg-white/10 transition-all"
          >
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
}

