import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class AuthUserDto {
  @ApiProperty()
  userId: number;

  @ApiProperty()
  email: string;

  @ApiProperty()
  fullName: string;

  @ApiProperty()
  roleId: number;

  @ApiPropertyOptional()
  roleName?: string;

  @ApiPropertyOptional({
    description: 'Merchant ID if user is linked to a merchant',
  })
  merchantId?: number | null;

  @ApiPropertyOptional({
    type: [String],
    description: 'Permission codes (e.g. arrival-items:delete)',
  })
  permissions?: string[];
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
