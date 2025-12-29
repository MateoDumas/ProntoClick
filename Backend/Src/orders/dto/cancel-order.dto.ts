import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CancelOrderDto {
  @IsString()
  @IsNotEmpty()
  reason: string; // Razón de cancelación

  @IsString()
  @IsOptional()
  additionalNotes?: string; // Notas adicionales opcionales
}

