import { Injectable, NotFoundException } from '@nestjs/common';
import { ArrivalQueryRepository } from '../repositories/arrival.query-repository';
import { ArrivalRepository } from '../repositories/arrival.repository';
import { ArrivalListQueryDto } from '../dto/arrival-list-query.dto';
import { ArrivalResponseDto } from '../dto/arrival-response.dto';
import { PaginatedResult } from '../../../common/base/interfaces/paginted.interface';
import { ArrivalOrmEntity } from '../entities/arrival.orm-entity';

@Injectable()
export class ArrivalQueryService {
  constructor(
    private readonly arrivalRepository: ArrivalRepository,
    private readonly arrivalQueryRepository: ArrivalQueryRepository,
  ) {}

  async getById(id: number, withRelations = true): Promise<ArrivalResponseDto | null> {
    const entity = withRelations
      ? await this.arrivalQueryRepository.repository.findOne({
          where: { id },
          relations: ['order', 'merchant', 'recordedByUser'],
        })
      : await this.arrivalRepository.findOneById(id);
    if (!entity) return null;
    return this.toResponse(entity);
  }

  async getByIdOrFail(id: number): Promise<ArrivalResponseDto> {
    const dto = await this.getById(id);
    if (!dto) throw new NotFoundException('Arrival not found');
    return dto;
  }

  async getByIdWithItems(id: number): Promise<ArrivalResponseDto | null> {
    const entity = await this.arrivalQueryRepository.repository.findOne({
      where: { id },
      relations: ['order', 'merchant', 'recordedByUser', 'arrivalItems', 'arrivalItems.orderItem'],
    });
    if (!entity) return null;
    return this.toResponse(entity);
  }

  async getList(query: ArrivalListQueryDto): Promise<PaginatedResult<ArrivalResponseDto>> {
    const result = await this.arrivalQueryRepository.findWithPagination({
      page: query.page,
      limit: query.limit,
      merchantId: query.merchantId,
      orderId: query.orderId,
    });
    return {
      results: result.results.map((e) => this.toResponse(e)),
      pagination: result.pagination,
    };
  }

  private toResponse(entity: ArrivalOrmEntity): ArrivalResponseDto {
    const arrivedDate =
      entity.arrivedDate instanceof Date
        ? entity.arrivedDate.toISOString().slice(0, 10)
        : String(entity.arrivedDate);
    return {
      id: entity.id,
      orderId: entity.order?.id ?? 0,
      merchantId: entity.merchant?.id ?? 0,
      arrivedDate,
      arrivedTime: entity.arrivedTime,
      recordedBy: entity.recordedByUser?.id ?? null,
      notes: entity.notes ?? null,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }
}
