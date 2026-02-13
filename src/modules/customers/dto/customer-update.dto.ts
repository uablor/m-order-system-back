import {
  IsString,
  IsOptional,
  IsBoolean,
  IsIn,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

const CUSTOMER_TYPES = ['CUSTOMER', 'AGENT'] as const;
const PREFERRED_CONTACT = ['PHONE', 'FACEBOOK', 'WHATSAPP', 'LINE'] as const;

export class CustomerUpdateDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  customerName?: string;

  @ApiPropertyOptional({ enum: CUSTOMER_TYPES })
  @IsOptional()
  @IsIn(CUSTOMER_TYPES)
  customerType?: 'CUSTOMER' | 'AGENT';

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  shippingAddress?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(100)
  shippingProvider?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(255)
  shippingSource?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(255)
  shippingDestination?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  paymentTerms?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(50)
  contactPhone?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  contactFacebook?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(50)
  contactWhatsapp?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  contactLine?: string;

  @ApiPropertyOptional({ enum: PREFERRED_CONTACT })
  @IsOptional()
  @IsIn(PREFERRED_CONTACT)
  preferredContactMethod?: 'PHONE' | 'FACEBOOK' | 'WHATSAPP' | 'LINE';

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(255)
  uniqueToken?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
