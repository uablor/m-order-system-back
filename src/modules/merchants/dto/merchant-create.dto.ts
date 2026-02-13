import {
  IsString,
  IsOptional,
  IsBoolean,
  IsIn,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

const CURRENCIES = ['THB', 'USD', 'LAK'] as const;

export class MerchantCreateDto {
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

  @ApiPropertyOptional({ default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
