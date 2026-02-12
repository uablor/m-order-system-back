import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class AuthUserDto {
  @ApiProperty()
  userId: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  fullName: string;

  @ApiProperty()
  roleId: string;

  @ApiPropertyOptional()
  roleName?: string;
}

export class AuthResponseDto {
  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty({ example: 'Login successful' })
  message: string;

  @ApiProperty({ description: 'JWT access token' })
  access_token: string;

  @ApiPropertyOptional({ type: AuthUserDto })
  user?: AuthUserDto;
}
