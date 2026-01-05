import { IsString, IsOptional, IsEmail, Matches } from 'class-validator';

export class UpdateProfileDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  avatar?: string;

  @IsString()
  @IsOptional()
  @Matches(/^\+?[1-9]\d{1,14}$/, {
    message: 'El número de teléfono debe tener un formato válido (ej: +1234567890)',
  })
  phoneNumber?: string;

  @IsString()
  @IsOptional()
  securityQuestion?: string;

  @IsString()
  @IsOptional()
  securityAnswer?: string;
}


