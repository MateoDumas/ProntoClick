import { Address } from '../../services/address.service';

interface AddressCardProps {
  address: Address;
  onEdit?: () => void;
  onDelete?: () => void;
  onSetDefault?: () => void;
}

export default function AddressCard({ address, onEdit, onDelete, onSetDefault }: AddressCardProps) {
  return (
    <div className={`glass rounded-xl p-5 border-2 transition-all ${
      address.isDefault ? 'border-red-500' : 'border-white/20'
    }`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h4 className="font-bold text-white">{address.label}</h4>
            {address.isDefault && (
              <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                Por defecto
              </span>
            )}
          </div>
          <p className="text-gray-300 text-sm">{address.street}</p>
          <p className="text-gray-300 text-sm">
            {address.city}, {address.zipCode}
          </p>
          {address.notes && (
            <p className="text-gray-400 text-xs mt-2 italic">{address.notes}</p>
          )}
        </div>
      </div>
      
      <div className="flex gap-2 mt-4">
        {!address.isDefault && onSetDefault && (
          <button
            onClick={onSetDefault}
            className="text-xs text-red-400 hover:text-red-300 transition-colors"
          >
            Establecer como predeterminada
          </button>
        )}
        {onEdit && (
          <button
            onClick={onEdit}
            className="text-xs text-blue-400 hover:text-blue-300 transition-colors ml-auto"
          >
            Editar
          </button>
        )}
        {onDelete && (
          <button
            onClick={onDelete}
            className="text-xs text-red-400 hover:text-red-300 transition-colors"
          >
            Eliminar
          </button>
        )}
      </div>
    </div>
  );
}

