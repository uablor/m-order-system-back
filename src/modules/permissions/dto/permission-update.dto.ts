import { IsString, IsOptional, MaxLength, MinLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class PermissionUpdateDto {
  @ApiPropertyOptional({ example: 'users:read' })
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  permissionCode?: string;

  @ApiPropertyOptional({ example: 'Read users' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;
}
