import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { addressService, Address, CreateAddressDto } from '../services/address.service';
import AddressCard from '../components/addresses/AddressCard';
import AddressForm from '../components/addresses/AddressForm';
import { useState } from 'react';
import { useToast } from '../hooks/useToast';
import ProtectedRoute from '../components/auth/ProtectedRoute';

function AddressesPageContent() {
  const [showForm, setShowForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | undefined>();
  const queryClient = useQueryClient();

  const { data: addresses, isLoading } = useQuery<Address[]>({
    queryKey: ['addresses'],
    queryFn: addressService.getAll,
  });

  const { success, error: toastError } = useToast();

  const createMutation = useMutation({
    mutationFn: addressService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] });
      setShowForm(false);
      success('Dirección guardada correctamente');
    },
    onError: (error: any) => {
      toastError(error.response?.data?.message || 'Error al guardar la dirección');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateAddressDto> }) =>
      addressService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] });
      setShowForm(false);
      setEditingAddress(undefined);
      success('Dirección actualizada correctamente');
    },
    onError: (error: any) => {
      toastError(error.response?.data?.message || 'Error al actualizar la dirección');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: addressService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] });
      success('Dirección eliminada correctamente');
    },
    onError: (error: any) => {
      toastError(error.response?.data?.message || 'Error al eliminar la dirección');
    },
  });

  const setDefaultMutation = useMutation({
    mutationFn: addressService.setDefault,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] });
      success('Dirección predeterminada actualizada');
    },
    onError: (error: any) => {
      toastError(error.response?.data?.message || 'Error al actualizar la dirección predeterminada');
    },
  });

  const handleSubmit = async (data: CreateAddressDto) => {
    if (editingAddress) {
      await updateMutation.mutateAsync({ id: editingAddress.id, data });
    } else {
      await createMutation.mutateAsync(data);
    }
  };

  const handleEdit = (address: Address) => {
    setEditingAddress(address);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('¿Estás seguro de eliminar esta dirección?')) {
      await deleteMutation.mutateAsync(id);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-gray-600">Cargando direcciones...</div>
        </div>
      </div>
    );
  }

  return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50 py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-red-600 to-red-800 bg-clip-text text-transparent mb-2">
              Mis Direcciones
            </h1>
            <p className="text-gray-600">Administra tus direcciones de entrega</p>
          </div>

          {showForm ? (
            <AddressForm
              address={editingAddress}
              onSubmit={handleSubmit}
              onCancel={() => {
                setShowForm(false);
                setEditingAddress(undefined);
              }}
            />
          ) : (
            <>
              <div className="mb-6">
                <button
                  onClick={() => setShowForm(true)}
                  className="bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-red-600 hover:to-red-700 transition-all shadow-lg"
                >
                  + Agregar Nueva Dirección
                </button>
              </div>

              {addresses && addresses.length === 0 ? (
                <div className="glass rounded-xl p-12 text-center border border-white/20">
                  <p className="text-gray-400 mb-4">No tienes direcciones guardadas</p>
                  <button
                    onClick={() => setShowForm(true)}
                    className="text-red-500 hover:text-red-600 font-semibold"
                  >
                    Agregar tu primera dirección
                  </button>
                </div>
              ) : (
                <div className="grid gap-4">
                  {addresses?.map((address) => (
                    <AddressCard
                      key={address.id}
                      address={address}
                      onEdit={() => handleEdit(address)}
                      onDelete={() => handleDelete(address.id)}
                      onSetDefault={() => setDefaultMutation.mutate(address.id)}
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
  );
}

export default function AddressesPage() {
  return (
    <ProtectedRoute>
      <AddressesPageContent />
    </ProtectedRoute>
  );
}

