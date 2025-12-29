import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';

@Injectable()
export class UploadService {
  private readonly logger = new Logger(UploadService.name);
  private isConfigured = false;

  constructor(private configService: ConfigService) {
    const cloudName = this.configService.get<string>('CLOUDINARY_CLOUD_NAME');
    const apiKey = this.configService.get<string>('CLOUDINARY_API_KEY');
    const apiSecret = this.configService.get<string>('CLOUDINARY_API_SECRET');

    if (cloudName && apiKey && apiSecret) {
      cloudinary.config({
        cloud_name: cloudName,
        api_key: apiKey,
        api_secret: apiSecret,
      });
      this.isConfigured = true;
      this.logger.log('Cloudinary configurado correctamente');
    } else {
      this.logger.warn('Cloudinary no está configurado. Las imágenes no se subirán.');
    }
  }

  /**
   * Sube una imagen a Cloudinary
   */
  async uploadImage(
    file: Express.Multer.File,
    folder: string = 'prontoclick',
  ): Promise<{ url: string; publicId: string }> {
    if (!this.isConfigured) {
      throw new BadRequestException('Cloudinary no está configurado. Configura las variables de entorno.');
    }

    if (!file) {
      throw new BadRequestException('No se proporcionó ningún archivo');
    }

    // Validar tipo de archivo
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException('Tipo de archivo no permitido. Solo se permiten imágenes.');
    }

    // Validar tamaño (máximo 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      throw new BadRequestException('El archivo es demasiado grande. Máximo 5MB.');
    }

    try {
      return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder,
            resource_type: 'image',
            transformation: [
              { width: 1200, height: 1200, crop: 'limit' },
              { quality: 'auto' },
              { format: 'auto' },
            ],
          },
          (error, result) => {
            if (error) {
              this.logger.error('Error al subir imagen a Cloudinary:', error);
              reject(new BadRequestException('Error al subir la imagen: ' + error.message));
            } else {
              this.logger.log(`Imagen subida exitosamente: ${result.public_id}`);
              resolve({
                url: result.secure_url,
                publicId: result.public_id,
              });
            }
          },
        );

        // Convertir buffer a stream
        const stream = Readable.from(file.buffer);
        stream.pipe(uploadStream);
      });
    } catch (error) {
      this.logger.error('Error al procesar imagen:', error);
      throw new BadRequestException('Error al procesar la imagen: ' + error.message);
    }
  }

  /**
   * Elimina una imagen de Cloudinary
   */
  async deleteImage(publicId: string): Promise<boolean> {
    if (!this.isConfigured) {
      this.logger.warn('Cloudinary no configurado. No se puede eliminar la imagen.');
      return false;
    }

    try {
      const result = await cloudinary.uploader.destroy(publicId);
      if (result.result === 'ok') {
        this.logger.log(`Imagen eliminada: ${publicId}`);
        return true;
      }
      return false;
    } catch (error) {
      this.logger.error(`Error al eliminar imagen ${publicId}:`, error);
      return false;
    }
  }

  /**
   * Optimiza una URL de imagen existente
   */
  optimizeImageUrl(url: string, width?: number, height?: number): string {
    if (!this.isConfigured || !url) {
      return url;
    }

    try {
      // Extraer public_id de la URL de Cloudinary
      const publicIdMatch = url.match(/\/v\d+\/(.+)\.(jpg|png|webp|gif)/);
      if (publicIdMatch) {
        const publicId = publicIdMatch[1];
        const transformations: string[] = [];
        
        if (width) transformations.push(`w_${width}`);
        if (height) transformations.push(`h_${height}`);
        transformations.push('q_auto', 'f_auto');

        return cloudinary.url(publicId, {
          secure: true,
          transformation: [{ width, height, crop: 'limit', quality: 'auto', fetch_format: 'auto' }],
        });
      }
      return url;
    } catch (error) {
      this.logger.error('Error al optimizar URL:', error);
      return url;
    }
  }

  /**
   * Verifica si Cloudinary está configurado
   */
  isCloudinaryConfigured(): boolean {
    return this.isConfigured;
  }
}

