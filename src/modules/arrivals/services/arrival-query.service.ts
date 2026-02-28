import { Injectable, NotFoundException } from '@nestjs/common';
import { ArrivalQueryRepository } from '../repositories/arrival.query-repository';
import { ArrivalRepository } from '../repositories/arrival.repository';
import { ArrivalListQueryDto } from '../dto/arrival-list-query.dto';
import { ArrivalResponseDto } from '../dto/arrival-response.dto';
import type { ResponseInterface, ResponseWithPaginationInterface } from '../../../common/base/interfaces/response.interface';
import { createPaginatedResponse, createSingleResponse } from '../../../common/base/helpers/response.helper';
import { ArrivalOrmEntity } from '../entities/arrival.orm-entity';

@Injectable()
export class ArrivalQueryService {
  constructor(
    private readonly arrivalRepository: ArrivalRepository,
    private readonly arrivalQueryRepository: ArrivalQueryRepository,
  ) {}

  async getById(id: number): Promise<ArrivalResponseDto | null> {
    const entity = await this.arrivalQueryRepository.repository.findOne({
      where: { id },
      relations: ['order', 'merchant', 'recordedByUser', 'arrivalItems', 'arrivalItems.orderItem'],
    });
    if (!entity) return null;
    return this.toResponse(entity);
  }

  async getByIdOrFail(id: number): Promise<ResponseInterface<ArrivalResponseDto>> {
    const dto = await this.getById(id);
    if (!dto) throw new NotFoundException('Arrival not found');
    return createSingleResponse(dto);
  }

  async getByIdWithItems(id: number): Promise<ArrivalResponseDto | null> {
    const entity = await this.arrivalQueryRepository.repository.findOne({
      where: { id },
      relations: ['order', 'merchant', 'recordedByUser', 'arrivalItems', 'arrivalItems.orderItem'],
    });
    if (!entity) return null;
    return this.toResponse(entity);
  }

  async getList(query: ArrivalListQueryDto): Promise<ResponseWithPaginationInterface<ArrivalResponseDto>> {
    const result = await this.arrivalQueryRepository.findWithPagination({
      page: query.page,
      limit: query.limit,
      search: query.search,
      merchantId: query.merchantId,
      orderId: query.orderId,
      startDate: query.startDate,
      endDate: query.endDate,
      createdByUserId: query.createdByUserId,
      arrivalDate: query.arrivalDate,
      arrivalTime: query.arrivalTime,
      arrival: query.arrival,
    });
    return createPaginatedResponse(
      result.results.map((e) => this.toResponse(e)),
      result.pagination,
    );
  }

  async getListByMerchant(
    query: ArrivalListQueryDto,
    currentUser: import('../../../common/decorators/current-user.decorator').CurrentUserPayload,
  ): Promise<ResponseWithPaginationInterface<ArrivalResponseDto>> {
    const result = await this.arrivalQueryRepository.findWithPagination({
      page: query.page,
      limit: query.limit,
      search: query.search,
      merchantId: currentUser.merchantId!,
      orderId: query.orderId,
      startDate: query.startDate,
      endDate: query.endDate,
      createdByUserId: query.createdByUserId,
      arrivalDate: query.arrivalDate,
      arrivalTime: query.arrivalTime,
      arrival: query.arrival,
    });
    return createPaginatedResponse(
      result.results.map((e) => this.toResponse(e)),
      result.pagination,
    );
  }

  private toResponse(entity: ArrivalOrmEntity): ArrivalResponseDto {
    const arrivedDate =
      entity.arrivedDate instanceof Date
        ? entity.arrivedDate.toISOString().slice(0, 10)
        : String(entity.arrivedDate);
    return {
      id: entity.id,
      orderId: entity.order?.id ?? 0,
      order: entity.order
        ? {
            id: entity.order.id,
            orderCode: entity.order.orderCode,
            orderDate:
              entity.order.orderDate instanceof Date
                ? entity.order.orderDate.toISOString().slice(0, 10)
                : String(entity.order.orderDate),
          }
        : null,
      merchantId: entity.merchant?.id ?? 0,
      arrivedDate,
      arrivedTime: entity.arrivedTime,
      recordedBy: entity.recordedByUser?.id ?? null,
      recordedByUser: entity.recordedByUser
        ? {
            id: entity.recordedByUser.id,
            fullName: entity.recordedByUser.fullName,
            email: entity.recordedByUser.email,
          }
        : null,
      notes: entity.notes ?? null,
      arrivalItems: (entity.arrivalItems ?? []).map((item) => ({
        id: item.id,
        arrivalId: entity.id,
        orderItemId: item.orderItem?.id ?? 0,
        orderItem: item.orderItem
          ? {
              id: item.orderItem.id,
              productName: item.orderItem.productName,
              variant: item.orderItem.variant ?? null,
              quantity: item.orderItem.quantity,
            }
          : null,
        arrivedQuantity: item.arrivedQuantity,
        condition: item.condition ?? null,
        notes: item.notes ?? null,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
      })),
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }
}
