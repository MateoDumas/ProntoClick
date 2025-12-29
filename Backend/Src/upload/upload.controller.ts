import {
  Controller,
  Post,
  Get,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadService } from './upload.service';
import { JwtAuthGuard } from '../common/jwt.guard';
import { memoryStorage } from 'multer';

@Controller('upload')
export class UploadController {
  constructor(private uploadService: UploadService) {}

  @Get('status')
  getStatus() {
    const isConfigured = this.uploadService.isCloudinaryConfigured();
    return {
      cloudinary: {
        configured: isConfigured,
        message: isConfigured 
          ? 'Cloudinary está configurado correctamente' 
          : 'Cloudinary no está configurado. Verifica las variables de entorno.',
      },
    };
  }

  @Post('image')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
      },
    }),
  )
  async uploadImage(
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('No se proporcionó ningún archivo');
    }

    const result = await this.uploadService.uploadImage(file);
    return {
      success: true,
      url: result.url,
      publicId: result.publicId,
    };
  }

  @Post('product-image')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
      },
    }),
  )
  async uploadProductImage(
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('No se proporcionó ningún archivo');
    }

    const result = await this.uploadService.uploadImage(file, 'prontoclick/products');
    return {
      success: true,
      url: result.url,
      publicId: result.publicId,
    };
  }

  @Post('restaurant-image')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
      },
    }),
  )
  async uploadRestaurantImage(
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('No se proporcionó ningún archivo');
    }

    const result = await this.uploadService.uploadImage(file, 'prontoclick/restaurants');
    return {
      success: true,
      url: result.url,
      publicId: result.publicId,
    };
  }
}

