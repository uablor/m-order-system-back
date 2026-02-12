import { IsString, IsOptional, MaxLength, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RoleCreateDto {
  @ApiProperty({ example: 'ADMIN' })
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  roleName: string;

  @ApiPropertyOptional({ example: 'Administrator role' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;
}
