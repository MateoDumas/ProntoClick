import { useSocket } from '../../hooks/useSocket';

export default function ConnectionStatus() {
  const { isConnected } = useSocket();

  if (isConnected) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
        <p className="text-sm text-green-800 flex items-center gap-2">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
          Conectado. Recibiendo actualizaciones en tiempo real.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
      <p className="text-sm text-yellow-800 flex items-center gap-2">
        <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
        No conectado. Las actualizaciones en tiempo real no están disponibles.
      </p>
      <p className="text-xs text-yellow-700 mt-1">
        Verifica que el backend esté corriendo en el puerto 3001.
      </p>
    </div>
  );
}

