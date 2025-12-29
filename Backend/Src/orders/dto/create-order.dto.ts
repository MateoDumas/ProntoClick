import { IsString, IsArray, ValidateNested, IsEnum, IsObject, IsOptional, IsNumber, Min, IsBoolean, IsDateString } from 'class-validator';
import { Type } from 'class-transformer';

export class DeliveryAddressDto {
  @IsString()
  street: string;

  @IsString()
  city: string;

  @IsString()
  zipCode: string;

  @IsString()
  @IsOptional()
  notes?: string;
}

export class ProductDto {
  @IsString()
  id: string;
}

export class OrderItemDto {
  @ValidateNested()
  @Type(() => ProductDto)
  product: ProductDto;

  @IsNumber()
  @Min(1)
  quantity: number;

  @IsNumber()
  @IsOptional()
  price?: number; // Precio del producto (necesario para productos de mercado)
}

export class CreateOrderDto {
  @IsString()
  restaurantId: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];

  @IsObject()
  @ValidateNested()
  @Type(() => DeliveryAddressDto)
  deliveryAddress: DeliveryAddressDto;

  @IsEnum(['cash', 'card'])
  paymentMethod: 'cash' | 'card';

  @IsString()
  @IsOptional()
  couponCode?: string;

  @IsString()
  @IsOptional()
  paymentIntentId?: string; // ID del PaymentIntent de Stripe (si pago con tarjeta)

  @IsNumber()
  @IsOptional()
  @Min(0)
  tipAmount?: number; // Propina para el repartidor

  @IsBoolean()
  @IsOptional()
  isScheduled?: boolean; // Indica si el pedido está programado

  @IsDateString()
  @IsOptional()
  scheduledFor?: string; // Fecha y hora programada para el pedido (ISO string)
}

