import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class MerchantResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  ownerUserId: number;

  @ApiProperty()
  shopName: string;

  @ApiPropertyOptional({ nullable: true })
  shopLogoUrl: {
    id: number;
    fileKey: string;
    originalName: string;
    publicUrl: string | null;
  } | null;

  @ApiPropertyOptional({ nullable: true })
  shopAddress: string | null;

  @ApiPropertyOptional({ nullable: true })
  contactPhone: string | null;

  @ApiPropertyOptional({ nullable: true })
  contactEmail: string | null;

  @ApiPropertyOptional({ nullable: true })
  contactFacebook: string | null;

  @ApiPropertyOptional({ nullable: true })
  contactLine: string | null;

  @ApiPropertyOptional({ nullable: true })
  contactWhatsapp: string | null;

  @ApiProperty()
  defaultCurrency: string;

  @ApiProperty()
  isActive: boolean;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
