import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsBoolean, IsArray } from 'class-validator';
import { BaseQueryDto } from 'src/common/base/dtos/base.query.dto';
import { Type } from 'class-transformer';

export class ImageListQueryDto extends BaseQueryDto {
  @ApiPropertyOptional({ description: 'Filter by merchant ID' })
  @IsOptional()
  @Type(() => Number)
  merchantId?: number;

  @ApiPropertyOptional({ description: 'Filter by uploaded by user ID' })
  @IsOptional()
  @Type(() => Number)
  uploadedByUserId?: number;

  @ApiPropertyOptional({ description: 'Filter by MIME type' })
  @IsOptional()
  @IsString()
  mimeType?: string;

  @ApiPropertyOptional({ description: 'Filter by tags' })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @ApiPropertyOptional({ description: 'Filter by active status' })
  @IsOptional()
  @Type(() => Boolean)
  isActive?: boolean;

  @ApiPropertyOptional({ description: 'Filter by minimum file size' })
  @IsOptional()
  @Type(() => Number)
  minFileSize?: number;

  @ApiPropertyOptional({ description: 'Filter by maximum file size' })
  @IsOptional()
  @Type(() => Number)
  maxFileSize?: number;
}
