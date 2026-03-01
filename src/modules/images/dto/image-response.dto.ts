import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ImageResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  merchantId: number;

  @ApiPropertyOptional({ nullable: true })
  uploadedByUser: {
    id: number;
    fullName: string;
    email: string;
  } | null;

  @ApiProperty({ description: 'Original file name' })
  originalName: string;

  @ApiProperty({ description: 'Generated file name' })
  fileName: string;

  @ApiProperty({ description: 'File path in storage' })
  filePath: string;

  @ApiProperty({ description: 'Unique file key for storage' })
  fileKey: string;

  @ApiProperty({ description: 'File size in bytes' })
  fileSize: number;

  @ApiProperty({ description: 'MIME type of the file' })
  mimeType: string;

  @ApiPropertyOptional({ description: 'Public URL if available' })
  publicUrl: string | null;

  @ApiProperty({ description: 'Whether the image is active' })
  isActive: boolean;

  @ApiPropertyOptional({ description: 'Image tags' })
  tags: string[] | null;

  @ApiPropertyOptional({ description: 'Image description' })
  description: string | null;

  @ApiProperty({ description: 'Creation timestamp' })
  createdAt: Date;

  @ApiProperty({ description: 'Last update timestamp' })
  updatedAt: Date;
}
