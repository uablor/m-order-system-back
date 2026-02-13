import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CustomerResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  merchantId: number;

  @ApiProperty()
  customerName: string;

  @ApiProperty()
  customerType: string;

  @ApiPropertyOptional({ nullable: true })
  shippingAddress: string | null;

  @ApiPropertyOptional({ nullable: true })
  shippingProvider: string | null;

  @ApiPropertyOptional({ nullable: true })
  shippingSource: string | null;

  @ApiPropertyOptional({ nullable: true })
  shippingDestination: string | null;

  @ApiPropertyOptional({ nullable: true })
  paymentTerms: string | null;

  @ApiPropertyOptional({ nullable: true })
  contactPhone: string | null;

  @ApiPropertyOptional({ nullable: true })
  contactFacebook: string | null;

  @ApiPropertyOptional({ nullable: true })
  contactWhatsapp: string | null;

  @ApiPropertyOptional({ nullable: true })
  contactLine: string | null;

  @ApiPropertyOptional({ nullable: true })
  preferredContactMethod: string | null;

  @ApiProperty()
  uniqueToken: string;

  @ApiProperty()
  isActive: boolean;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
