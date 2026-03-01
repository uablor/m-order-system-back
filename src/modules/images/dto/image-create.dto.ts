import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsArray, IsBoolean, IsNumber } from 'class-validator';

export class ImageCreateDto {
  @ApiProperty({ description: 'Original file name' })
  @IsString()
  originalName: string;

  @ApiProperty({ description: 'Generated file name' })
  @IsString()
  fileName: string;

  @ApiProperty({ description: 'File path in storage' })
  @IsString()
  filePath: string;

  @ApiProperty({ description: 'Unique file key for storage' })
  @IsString()
  fileKey: string;

  @ApiProperty({ description: 'File size in bytes' })
  @IsNumber()
  fileSize: number;

  @ApiProperty({ description: 'MIME type of the file' })
  @IsString()
  mimeType: string;

  @ApiPropertyOptional({ description: 'Public URL if available' })
  @IsOptional()
  @IsString()
  publicUrl?: string;

  @ApiPropertyOptional({ description: 'Image tags' })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @ApiPropertyOptional({ description: 'Image description' })
  @IsOptional()
  @IsString()
  description?: string;
}
