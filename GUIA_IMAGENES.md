# 🖼️ Guía Completa: Cargar Imágenes en ProntoClick

Tu aplicación ya tiene el sistema de upload implementado. Aquí tienes **3 opciones** para cargar imágenes en producción:

---

## 🎯 Opción 1: Cloudinary (Recomendado - Ya Implementado)

### ✅ Ventajas
- **Gratis:** 25 GB de almacenamiento, 25 GB de ancho de banda/mes
- **Optimización automática:** Redimensiona y comprime imágenes
- **CDN global:** Imágenes cargan rápido en todo el mundo
- **Ya está implementado** en tu código

### 📋 Pasos

#### 1. Crear cuenta en Cloudinary
1. Ve a: https://cloudinary.com/users/register/free
2. Regístrate con tu email
3. Confirma tu email

#### 2. Obtener credenciales
1. En el Dashboard de Cloudinary, ve a **Settings** → **Security**
2. Copia estos valores:
   - **Cloud Name** (ej: `dabc123`)
   - **API Key** (ej: `123456789012345`)
   - **API Secret** (ej: `abcdefghijklmnopqrstuvwxyz`)

#### 3. Configurar en Render (Backend)
1. Ve a tu servicio en Render
2. **Settings** → **Environment**
3. Agrega estas variables:
   ```
   CLOUDINARY_CLOUD_NAME=tu_cloud_name
   CLOUDINARY_API_KEY=tu_api_key
   CLOUDINARY_API_SECRET=tu_api_secret
   ```
4. Guarda y reinicia el servicio

#### 4. Probar el upload
```bash
# Desde tu frontend o Postman
POST https://prontoclick-backend.onrender.com/upload/product-image
Headers:
  Authorization: Bearer TU_JWT_TOKEN
Body (form-data):
  file: [tu_imagen.jpg]
```

**Respuesta:**
```json
{
  "success": true,
  "url": "https://res.cloudinary.com/.../prontoclick/products/...",
  "publicId": "prontoclick/products/..."
}
```

#### 5. Usar la URL en tu base de datos
Copia la `url` de la respuesta y actualiza el campo `image` en tu tabla `Product` o `Restaurant` en Supabase.

---

## 🎯 Opción 2: Supabase Storage (Gratis - Ya tienes Supabase)

### ✅ Ventajas
- **Gratis:** 1 GB de almacenamiento, 2 GB de transferencia/mes
- **Ya tienes cuenta:** No necesitas registrarte en otro servicio
- **Integrado:** Todo en un solo lugar

### 📋 Pasos

#### 1. Habilitar Storage en Supabase
1. Ve a tu proyecto en Supabase: https://supabase.com/dashboard
2. En el menú lateral, ve a **Storage**
3. Crea un bucket llamado `prontoclick-images`
4. Configura como **Public** (para que las imágenes sean accesibles)

#### 2. Instalar dependencias
```bash
cd Backend
npm install @supabase/supabase-js
```

#### 3. Crear servicio de upload para Supabase
Crear `Backend/Src/upload/supabase-upload.service.ts`:

```typescript
import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseUploadService {
  private readonly logger = new Logger(SupabaseUploadService.name);
  private supabase: SupabaseClient;

  constructor(private configService: ConfigService) {
    const supabaseUrl = this.configService.get<string>('SUPABASE_URL');
    const supabaseKey = this.configService.get<string>('SUPABASE_ANON_KEY');

    if (supabaseUrl && supabaseKey) {
      this.supabase = createClient(supabaseUrl, supabaseKey);
      this.logger.log('Supabase Storage configurado correctamente');
    } else {
      this.logger.warn('Supabase no está configurado');
    }
  }

  async uploadImage(
    file: Express.Multer.File,
    folder: string = 'products',
  ): Promise<{ url: string; publicId: string }> {
    if (!this.supabase) {
      throw new BadRequestException('Supabase no está configurado');
    }

    if (!file) {
      throw new BadRequestException('No se proporcionó ningún archivo');
    }

    // Validar tipo
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException('Tipo de archivo no permitido');
    }

    // Validar tamaño (5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      throw new BadRequestException('El archivo es demasiado grande. Máximo 5MB.');
    }

    try {
      // Generar nombre único
      const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(7)}.${file.originalname.split('.').pop()}`;

      // Subir a Supabase Storage
      const { data, error } = await this.supabase.storage
        .from('prontoclick-images')
        .upload(fileName, file.buffer, {
          contentType: file.mimetype,
          upsert: false,
        });

      if (error) {
        throw new BadRequestException('Error al subir imagen: ' + error.message);
      }

      // Obtener URL pública
      const { data: urlData } = this.supabase.storage
        .from('prontoclick-images')
        .getPublicUrl(fileName);

      this.logger.log(`Imagen subida exitosamente: ${fileName}`);

      return {
        url: urlData.publicUrl,
        publicId: fileName,
      };
    } catch (error) {
      this.logger.error('Error al procesar imagen:', error);
      throw new BadRequestException('Error al procesar la imagen: ' + error.message);
    }
  }

  async deleteImage(publicId: string): Promise<boolean> {
    if (!this.supabase) {
      return false;
    }

    try {
      const { error } = await this.supabase.storage
        .from('prontoclick-images')
        .remove([publicId]);

      if (error) {
        this.logger.error(`Error al eliminar imagen: ${error.message}`);
        return false;
      }

      return true;
    } catch (error) {
      this.logger.error(`Error al eliminar imagen:`, error);
      return false;
    }
  }
}
```

#### 4. Actualizar UploadController
Modificar `Backend/Src/upload/upload.controller.ts` para usar Supabase cuando Cloudinary no esté configurado.

#### 5. Configurar variables en Render
```
SUPABASE_URL=https://qkjtnkmmxaeznpwtvppd.supabase.co
SUPABASE_ANON_KEY=tu_anon_key
```

---

## 🎯 Opción 3: URLs Públicas Directas (Más Simple)

### ✅ Ventajas
- **Sin configuración:** Solo necesitas URLs públicas
- **Gratis:** Usa servicios como Imgur, ImgBB, o cualquier hosting de imágenes

### 📋 Pasos

#### 1. Subir imágenes a un servicio público
**Opción A: Imgur (Gratis)**
1. Ve a: https://imgur.com/upload
2. Sube tu imagen
3. Copia el link directo (ej: `https://i.imgur.com/abc123.jpg`)

**Opción B: ImgBB (Gratis)**
1. Ve a: https://imgbb.com/
2. Sube tu imagen
3. Copia el link directo

**Opción C: GitHub (Gratis)**
1. Crea un repositorio público en GitHub
2. Sube las imágenes
3. Usa el link raw (ej: `https://raw.githubusercontent.com/usuario/repo/main/imagen.jpg`)

#### 2. Actualizar directamente en Supabase
1. Ve a tu proyecto en Supabase
2. **Table Editor** → Selecciona `Restaurant` o `Product`
3. Edita el campo `image` con la URL pública
4. Guarda

---

## 🎨 Componente Frontend para Subir Imágenes

Si quieres que los usuarios o administradores puedan subir imágenes desde el frontend, aquí tienes un componente:

### Crear `Frontend/src/components/admin/ImageUpload.tsx`:

```typescript
import { useState } from 'react';
import { api } from '@/services/api';

interface ImageUploadProps {
  onUploadComplete: (url: string) => void;
  folder?: 'products' | 'restaurants';
  label?: string;
}

export default function ImageUpload({ 
  onUploadComplete, 
  folder = 'products',
  label = 'Subir Imagen'
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validar tipo
    if (!file.type.startsWith('image/')) {
      alert('Solo se permiten imágenes');
      return;
    }

    // Validar tamaño (5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('La imagen es demasiado grande. Máximo 5MB.');
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
        alert('Imagen subida exitosamente');
      }
    } catch (error: any) {
      console.error('Error al subir imagen:', error);
      alert(error.response?.data?.message || 'Error al subir la imagen');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <div className="flex items-center gap-4">
        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            {preview ? (
              <img src={preview} alt="Preview" className="max-h-24 max-w-24 object-cover rounded" />
            ) : (
              <>
                <svg className="w-8 h-8 mb-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <p className="mb-2 text-sm text-gray-500">
                  <span className="font-semibold">Click para subir</span> o arrastra y suelta
                </p>
                <p className="text-xs text-gray-500">PNG, JPG, WEBP (MAX. 5MB)</p>
              </>
            )}
          </div>
          <input
            type="file"
            className="hidden"
            accept="image/*"
            onChange={handleFileChange}
            disabled={uploading}
          />
        </label>
      </div>
      {uploading && (
        <p className="text-sm text-blue-600">Subiendo imagen...</p>
      )}
    </div>
  );
}
```

---

## 📝 Resumen de Endpoints Disponibles

### Backend (Ya implementados)
- `POST /upload/image` - Sube imagen genérica
- `POST /upload/product-image` - Sube imagen de producto
- `POST /upload/restaurant-image` - Sube imagen de restaurante

**Todos requieren:**
- Header: `Authorization: Bearer JWT_TOKEN`
- Body: `form-data` con campo `file`

---

## 🚀 Recomendación

**Para empezar rápido:** Usa **Cloudinary** (Opción 1)
- Ya está implementado
- Solo necesitas crear cuenta y configurar variables
- Gratis y potente

**Para mantener todo en Supabase:** Usa **Supabase Storage** (Opción 2)
- Todo en un solo lugar
- Requiere implementar el servicio

**Para pruebas rápidas:** Usa **URLs públicas** (Opción 3)
- Más simple pero menos control
- Bueno para MVP

---

## ✅ Checklist

- [ ] Elegir opción (Cloudinary recomendado)
- [ ] Configurar credenciales en Render
- [ ] Probar upload desde Postman o frontend
- [ ] Actualizar imágenes en base de datos
- [ ] Verificar que se muestren en el frontend

---

¿Necesitas ayuda con alguna opción específica? 🚀

