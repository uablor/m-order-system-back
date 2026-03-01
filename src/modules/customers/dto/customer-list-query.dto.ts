import { IsOptional, IsInt, IsString, MaxLength, Min, Max, IsIn } from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class CustomerListQueryDto {
  @ApiPropertyOptional({ description: 'Page number', default: 1, minimum: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ description: 'Items per page', default: 10, minimum: 1, maximum: 100 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 10;

  @ApiPropertyOptional({ description: 'Filter by merchant ID' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  merchantId?: number;

  @ApiPropertyOptional({ description: 'Search by name / phone / token' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  search?: string;

  @ApiPropertyOptional({ description: 'Filter by customer type', enum: ['CUSTOMER', 'AGENT'] })
  @IsOptional()
  @IsString()
  @IsIn(['CUSTOMER', 'AGENT'])
  customerType?: 'CUSTOMER' | 'AGENT';

  @ApiPropertyOptional({ description: 'Filter by active status (true/false)' })
  @IsOptional()
  @Transform(({ value }) => {
    if (value === 'true' || value === true) return true;
    if (value === 'false' || value === false) return false;
    return undefined;
  })
  isActive?: boolean;
}
