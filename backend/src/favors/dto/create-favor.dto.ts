import {
  IsArray,
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { MetodoPago, Urgencia } from '@prisma/client';

export class CreateFavorDto {
  @IsString()
  @IsNotEmpty()
  categorySlug!: string;

  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsString()
  @IsNotEmpty()
  description!: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  photoUrls?: string[];

  @IsString()
  @IsNotEmpty()
  originLabel!: string;

  @IsOptional() @IsNumber() originLat?: number;
  @IsOptional() @IsNumber() originLng?: number;

  @IsString()
  @IsNotEmpty()
  destLabel!: string;

  @IsOptional() @IsNumber() destLat?: number;
  @IsOptional() @IsNumber() destLng?: number;

  @IsOptional()
  @IsDateString()
  scheduledAt?: string;

  @IsEnum(Urgencia)
  urgency!: Urgencia;

  @IsNumber()
  @Min(3.01, { message: 'agrega un valor mayor a 3.00' })
  budget!: number;

  @IsEnum(MetodoPago)
  paymentMethod!: MetodoPago;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsString()
  couponCode?: string;
}
