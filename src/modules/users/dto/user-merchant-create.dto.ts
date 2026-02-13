import { IsEmail, IsString, IsOptional, IsBoolean, IsNumber, MinLength, MaxLength, IsIn } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

const CURRENCIES = ['THB', 'USD', 'LAK'] as const;

export class UserMerchantCreateDto {
  // User fields
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'password123', minLength: 6 })
  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters' })
  @MaxLength(100)
  password: string;

  @ApiProperty({ example: 'John Doe' })
  @IsString()
  @MinLength(1)
  @MaxLength(200)
  fullName: string;

  // Merchant fields
  @ApiProperty({ example: 'My Shop' })
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  shopName: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  shopLogoUrl?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  shopAddress?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(50)
  contactPhone?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(255)
  contactEmail?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  contactFacebook?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  contactLine?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(50)
  contactWhatsapp?: string;

  @ApiPropertyOptional({ enum: CURRENCIES, default: 'THB' })
  @IsOptional()
  @IsIn(CURRENCIES)
  defaultCurrency?: 'THB' | 'USD' | 'LAK';
}
