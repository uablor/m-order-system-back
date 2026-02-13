import { Injectable, NotFoundException } from '@nestjs/common';
import { ArrivalItemQueryRepository } from '../repositories/arrival-item.query-repository';
import { ArrivalItemRepository } from '../repositories/arrival-item.repository';
import { ArrivalItemListQueryDto } from '../dto/arrival-item-list-query.dto';
import { ArrivalItemResponseDto } from '../dto/arrival-item-response.dto';
import type { ResponseInterface, ResponseWithPaginationInterface } from '../../../common/base/interfaces/response.interface';
import { createPaginatedResponse, createSingleResponse } from '../../../common/base/helpers/response.helper';
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

  async getByIdOrFail(id: number): Promise<ResponseInterface<ArrivalItemResponseDto>> {
    const dto = await this.getById(id);
    if (!dto) throw new NotFoundException('Arrival item not found');
    return createSingleResponse(dto);
  }

  async getList(query: ArrivalItemListQueryDto): Promise<ResponseWithPaginationInterface<ArrivalItemResponseDto>> {
    const result = await this.arrivalItemQueryRepository.findWithPagination({
      page: query.page,
      limit: query.limit,
      arrivalId: query.arrivalId,
      orderItemId: query.orderItemId,
    });
    return createPaginatedResponse(
      result.results.map((e) => this.toResponse(e)),
      result.pagination,
    );
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
