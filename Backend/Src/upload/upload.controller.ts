import {
  Controller,
  Post,
  Get,
  Patch,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  Param,
  Body,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadService } from './upload.service';
import { JwtAuthGuard } from '../common/jwt.guard';
import { PrismaService } from '../Prisma/prisma.service';
import { memoryStorage } from 'multer';

@Controller('upload')
export class UploadController {
  constructor(
    private uploadService: UploadService,
    private prisma: PrismaService,
  ) {}

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

  /**
   * Sube imagen de restaurante Y actualiza automáticamente en la base de datos
   * POST /upload/restaurant/:id/image
   */
  @Post('restaurant/:id/image')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
      },
    }),
  )
  async uploadAndUpdateRestaurantImage(
    @Param('id') restaurantId: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('No se proporcionó ningún archivo');
    }

    // Verificar que el restaurante existe
    const restaurant = await this.prisma.restaurant.findUnique({
      where: { id: restaurantId },
    });

    if (!restaurant) {
      throw new BadRequestException('Restaurante no encontrado');
    }

    // Subir imagen a Cloudinary
    const result = await this.uploadService.uploadImage(file, 'prontoclick/restaurants');

    // Actualizar restaurante en la base de datos
    const updatedRestaurant = await this.prisma.restaurant.update({
      where: { id: restaurantId },
      data: { image: result.url },
    });

    return {
      success: true,
      message: 'Imagen subida y actualizada correctamente',
      url: result.url,
      publicId: result.publicId,
      restaurant: {
        id: updatedRestaurant.id,
        name: updatedRestaurant.name,
        image: updatedRestaurant.image,
      },
    };
  }

  /**
   * Sube imagen de producto Y actualiza automáticamente en la base de datos
   * POST /upload/product/:id/image
   */
  @Post('product/:id/image')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
      },
    }),
  )
  async uploadAndUpdateProductImage(
    @Param('id') productId: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('No se proporcionó ningún archivo');
    }

    // Verificar que el producto existe
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new BadRequestException('Producto no encontrado');
    }

    // Subir imagen a Cloudinary
    const result = await this.uploadService.uploadImage(file, 'prontoclick/products');

    // Actualizar producto en la base de datos
    const updatedProduct = await this.prisma.product.update({
      where: { id: productId },
      data: { image: result.url },
    });

    return {
      success: true,
      message: 'Imagen subida y actualizada correctamente',
      url: result.url,
      publicId: result.publicId,
      product: {
        id: updatedProduct.id,
        name: updatedProduct.name,
        image: updatedProduct.image,
      },
    };
  }

  /**
   * Sube imagen de restaurante desde URL Y actualiza automáticamente
   * POST /upload/restaurant/:id/image-url
   */
  @Post('restaurant/:id/image-url')
  @UseGuards(JwtAuthGuard)
  async uploadRestaurantImageFromUrl(
    @Param('id') restaurantId: string,
    @Body() body: { url: string },
  ) {
    if (!body.url) {
      throw new BadRequestException('No se proporcionó ninguna URL');
    }

    // Verificar que el restaurante existe
    const restaurant = await this.prisma.restaurant.findUnique({
      where: { id: restaurantId },
    });

    if (!restaurant) {
      throw new BadRequestException('Restaurante no encontrado');
    }

    // Subir imagen desde URL a Cloudinary
    const result = await this.uploadService.uploadImageFromUrl(body.url, 'prontoclick/restaurants');

    // Actualizar restaurante en la base de datos
    const updatedRestaurant = await this.prisma.restaurant.update({
      where: { id: restaurantId },
      data: { image: result.url },
    });

    return {
      success: true,
      message: 'Imagen subida desde URL y actualizada correctamente',
      url: result.url,
      publicId: result.publicId,
      restaurant: {
        id: updatedRestaurant.id,
        name: updatedRestaurant.name,
        image: updatedRestaurant.image,
      },
    };
  }

  /**
   * Sube imagen de producto desde URL Y actualiza automáticamente
   * POST /upload/product/:id/image-url
   */
  @Post('product/:id/image-url')
  @UseGuards(JwtAuthGuard)
  async uploadProductImageFromUrl(
    @Param('id') productId: string,
    @Body() body: { url: string },
  ) {
    if (!body.url) {
      throw new BadRequestException('No se proporcionó ninguna URL');
    }

    // Verificar que el producto existe
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new BadRequestException('Producto no encontrado');
    }

    // Subir imagen desde URL a Cloudinary
    const result = await this.uploadService.uploadImageFromUrl(body.url, 'prontoclick/products');

    // Actualizar producto en la base de datos
    const updatedProduct = await this.prisma.product.update({
      where: { id: productId },
      data: { image: result.url },
    });

    return {
      success: true,
      message: 'Imagen subida desde URL y actualizada correctamente',
      url: result.url,
      publicId: result.publicId,
      product: {
        id: updatedProduct.id,
        name: updatedProduct.name,
        image: updatedProduct.image,
      },
    };
  }
}

