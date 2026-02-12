import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * Standard API response wrapper used across all endpoints.
 */
export class ApiResponseDto<T = unknown> {
  @ApiProperty({ example: true, description: 'Whether the request succeeded' })
  success: boolean;

  @ApiProperty({ example: 'Operation completed', description: 'Human-readable message' })
  message: string;

  @ApiPropertyOptional({ description: 'Response payload' })
  data?: T;
}

/**
 * Paginated list response.
 */
export class ApiPaginatedMetaDto {
  @ApiProperty({ example: 1 })
  page: number;

  @ApiProperty({ example: 10 })
  limit: number;

  @ApiProperty({ example: 100 })
  total: number;

  @ApiProperty({ example: 10 })
  totalPages: number;
}

export class ApiPaginatedResponseDto<T = unknown> {
  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty({ example: 'List retrieved' })
  message: string;

  @ApiProperty({ type: ApiPaginatedMetaDto })
  meta: ApiPaginatedMetaDto;

  @ApiProperty({ type: 'array' })
  data: T[];
}

/**
 * Auth login request (for documentation when auth module is added).
 */
export class ApiLoginDto {
  @ApiProperty({ example: 'user@example.com' })
  email: string;

  @ApiProperty({ example: 'password123' })
  password: string;
}

/**
 * Auth response (access_token + user info).
 */
export class ApiAuthResponseDto {
  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty({ example: 'Login successful' })
  message: string;

  @ApiProperty({
    description: 'JWT access token',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  access_token: string;

  @ApiPropertyOptional({ description: 'Authenticated user info' })
  user?: unknown;
}
