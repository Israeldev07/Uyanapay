import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  Max,
  Min,
  MinLength,
} from 'class-validator';
import { Transporte } from '@prisma/client';

export class RegisterClientDto {
  @IsString()
  @IsNotEmpty()
  firstName!: string;

  @IsString()
  @IsNotEmpty()
  lastName!: string;

  @IsEmail()
  email!: string;

  @IsString()
  @IsNotEmpty()
  phone!: string;

  @IsString()
  @IsNotEmpty()
  university!: string;

  @IsOptional()
  @IsString()
  career?: string;

  @MinLength(8)
  password!: string;

  @IsBoolean()
  acceptedTos!: boolean;
}

export class RegisterYanapayerDto extends RegisterClientDto {
  @IsString()
  @IsNotEmpty()
  cedula!: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(12)
  semester?: number;

  @IsOptional()
  @IsString()
  bankAccount?: string;

  @IsEnum(Transporte)
  transport!: Transporte;

  @IsOptional()
  @IsObject()
  schedule?: Record<string, string[]>;
}
