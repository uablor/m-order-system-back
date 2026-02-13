import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * Standard API response wrapper (matches ResponseInterface).
 */
export class ApiResponseDto<T = unknown> {
  @ApiProperty({ example: true, description: 'Whether the request succeeded' })
  success: boolean;

  @ApiProperty({ example: 200, description: 'Response code' })
  Code: number;

  @ApiProperty({ example: 'Success', description: 'Human-readable message' })
  message: string;

  @ApiPropertyOptional({ description: 'Response payload (list or single item)' })
  results?: T[];
}

/**
 * Pagination response (matches PaginationResponse in paginted.interface).
 */
export class ApiPaginationResultDto {
  @ApiProperty({ example: 100 })
  total: number;

  @ApiProperty({ example: 1 })
  page: number;

  @ApiProperty({ example: 10 })
  limit: number;

  @ApiProperty({ example: 10 })
  totalPages: number;

  @ApiProperty({ example: true })
  hasNextPage: boolean;

  @ApiProperty({ example: false })
  hasPreviousPage: boolean;
}

/**
 * Paginated list response (matches ResponseWithPaginationInterface).
 */
export class ApiPaginatedResponseDto<T = unknown> {
  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty({ example: 200 })
  Code: number;

  @ApiProperty({ example: 'Success' })
  message: string;

  @ApiProperty({ type: ApiPaginationResultDto })
  pagination: ApiPaginationResultDto;

  @ApiProperty({ type: 'array', description: 'List of items' })
  results: T[];
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
