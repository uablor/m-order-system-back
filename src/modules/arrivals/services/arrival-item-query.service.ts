import { Injectable, NotFoundException } from '@nestjs/common';
import { ArrivalItemQueryRepository } from '../repositories/arrival-item.query-repository';
import { ArrivalItemRepository } from '../repositories/arrival-item.repository';
import { ArrivalItemListQueryDto } from '../dto/arrival-item-list-query.dto';
import { ArrivalItemResponseDto } from '../dto/arrival-item-response.dto';
import { PaginatedResult } from '../../../common/base/interfaces/paginted.interface';
import { ArrivalItemOrmEntity } from '../entities/arrival-item.orm-entity';

@Injectable()
export class ArrivalItemQueryService {
  constructor(
    private readonly arrivalItemRepository: ArrivalItemRepository,
    private readonly arrivalItemQueryRepository: ArrivalItemQueryRepository,
  ) {}

  async getById(id: number): Promise<ArrivalItemResponseDto | null> {
    const entity = await this.arrivalItemQueryRepository.repository.findOne({
      where: { id },
      relations: ['arrival', 'orderItem'],
    });
    if (!entity) return null;
    return this.toResponse(entity);
  }

  async getByIdOrFail(id: number): Promise<ArrivalItemResponseDto> {
    const dto = await this.getById(id);
    if (!dto) throw new NotFoundException('Arrival item not found');
    return dto;
  }

  async getList(query: ArrivalItemListQueryDto): Promise<PaginatedResult<ArrivalItemResponseDto>> {
    const result = await this.arrivalItemQueryRepository.findWithPagination({
      page: query.page,
      limit: query.limit,
      arrivalId: query.arrivalId,
      orderItemId: query.orderItemId,
    });
    return {
      results: result.results.map((e) => this.toResponse(e)),
      pagination: result.pagination,
    };
  }

  private toResponse(entity: ArrivalItemOrmEntity): ArrivalItemResponseDto {
    return {
      id: entity.id,
      arrivalId: entity.arrival?.id ?? 0,
      orderItemId: entity.orderItem?.id ?? 0,
      arrivedQuantity: entity.arrivedQuantity,
      condition: entity.condition ?? null,
      notes: entity.notes ?? null,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }
}
