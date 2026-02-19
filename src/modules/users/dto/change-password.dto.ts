import { IsString, IsUUID, IsOptional, IsBoolean, IsEmail, MinLength, MaxLength, IsNumber } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ChangePasswordDto {
  @ApiProperty({ example: 'password123', minLength: 6 })
  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters' })
  @MaxLength(100)
  password: string;

  @ApiProperty({ example: 'currentPassword123', minLength: 6 })
  @IsString()
  @MinLength(6, { message: 'Current password must be at least 6 characters' })
  @MaxLength(100)
  currentPassword: string;
}
