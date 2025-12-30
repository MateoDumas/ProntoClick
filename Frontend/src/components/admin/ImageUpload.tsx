import { useState } from 'react';
import { api } from '@/services/api';

interface ImageUploadProps {
  onUploadComplete: (url: string) => void;
  folder?: 'products' | 'restaurants';
  label?: string;
  currentImage?: string | null;
}

export default function ImageUpload({ 
  onUploadComplete, 
  folder = 'products',
  label = 'Subir Imagen',
  currentImage
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(currentImage || null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);

    // Validar tipo
    if (!file.type.startsWith('image/')) {
      setError('Solo se permiten imágenes (JPG, PNG, WEBP, GIF)');
      return;
    }

    // Validar tamaño (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('La imagen es demasiado grande. Máximo 5MB.');
      return;
    }

    // Preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Subir
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const endpoint = folder === 'products' 
        ? '/upload/product-image' 
        : '/upload/restaurant-image';

      const response = await api.post(endpoint, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        onUploadComplete(response.data.url);
        setError(null);
      }
    } catch (error: any) {
      console.error('Error al subir imagen:', error);
      const errorMessage = error.response?.data?.message || 'Error al subir la imagen';
      setError(errorMessage);
      
      // Si falla, restaurar preview anterior
      if (currentImage) {
        setPreview(currentImage);
      } else {
        setPreview(null);
      }
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}
      </label>
      <div className="flex items-center gap-4">
        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            {preview ? (
              <div className="relative">
                <img 
                  src={preview} 
                  alt="Preview" 
                  className="max-h-24 max-w-24 object-cover rounded-lg shadow-md" 
                />
                {uploading && (
                  <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                  </div>
                )}
              </div>
            ) : (
              <>
                <svg 
                  className="w-8 h-8 mb-2 text-gray-500 dark:text-gray-400" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" 
                  />
                </svg>
                <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                  <span className="font-semibold">Click para subir</span> o arrastra y suelta
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  PNG, JPG, WEBP (MAX. 5MB)
                </p>
              </>
            )}
          </div>
          <input
            type="file"
            className="hidden"
            accept="image/jpeg,image/png,image/webp,image/gif"
            onChange={handleFileChange}
            disabled={uploading}
          />
        </label>
      </div>
      {uploading && (
        <p className="text-sm text-blue-600 dark:text-blue-400 flex items-center gap-2">
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          Subiendo imagen...
        </p>
      )}
      {error && (
        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
    </div>
  );
}

