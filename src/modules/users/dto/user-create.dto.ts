import { IsString, IsUUID, IsOptional, IsBoolean, IsEmail, MinLength, MaxLength, IsNumber } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UserCreateDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'password123', minLength: 6 })
  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters' })
  @MaxLength(100)
  password: string;

  @ApiProperty({ example: 'John Doe' })
  @IsString()
  @MinLength(1)
  @MaxLength(200)
  fullName: string;

  @ApiPropertyOptional({ default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean = true;
}
