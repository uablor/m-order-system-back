import { IsOptional, IsInt, Min, Max, IsIn, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export enum SortDirection {
    ASC = 'ASC',
    DESC = 'DESC'
}

export class BaseQueryDto {
  @ApiPropertyOptional({ default: 1, minimum: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ default: 10, minimum: 1, maximum: 1000 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(1000)
  limit?: number = 10;

  @ApiPropertyOptional({ description: 'Search term to filter results' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ description: 'Field or comma-separated fields to apply the search to' })
  @IsOptional()
  @IsString()
  searchField?: string;

  @ApiPropertyOptional({ description: 'Sort order, e.g. "field:ASC" or "field:DESC"' })
  @IsString()
  sort: SortDirection = SortDirection.DESC;

  
}
