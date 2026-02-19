import { IsOptional, IsInt, Min, Max, IsBoolean, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { BaseQueryDto } from 'src/common/base/dtos/base.query.dto';

export class UserListQueryDto extends BaseQueryDto {
  @ApiPropertyOptional({ description: 'Filter by active status' })
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  isActive?: boolean;

  @ApiPropertyOptional({ description: '' })
  @IsOptional()
  @IsString()
  startDate?: string;

  @ApiPropertyOptional({ description: '' })
  @IsOptional()
  @IsString()
  endDate?: string;

  @ApiPropertyOptional({ description: 'Filter by merchant ID' })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  merchantId?: number;
}

export type UserListQueryOptions = UserListQueryDto;
