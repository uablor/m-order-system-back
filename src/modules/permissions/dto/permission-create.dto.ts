import { IsString, IsOptional, MaxLength, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class PermissionCreateDto {
  @ApiProperty({ example: 'users:read' })
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  permissionCode: string;

  @ApiPropertyOptional({ example: 'Read users' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;
}
