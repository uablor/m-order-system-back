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
      relations: ['order', 'merchant', 'recordedByUser', 'arrivalItems', 'arrivalItems.orderItem', 'arrivalItems.orderItem.image', 'arrivalItems.orderItem.skus'],
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
      relations: ['order', 'merchant', 'recordedByUser', 'arrivalItems', 'arrivalItems.orderItem', 'arrivalItems.orderItem.image', 'arrivalItems.orderItem.skus'],
    });
    if (!entity) return null;
    return this.toResponse(entity);
  }

  async getList(query: ArrivalListQueryDto): Promise<ResponseWithPaginationInterface<ArrivalOrmEntity>> {
    const result = await this.arrivalQueryRepository.findWithPagination({
      page: query.page,
      limit: query.limit,
      search: query.search,
      searchField: query.searchField,
      sort: query.sort,
      merchantId: query.merchantId,
      orderId: query.orderId,
      orderItemId: query.orderItemId,
      startDate: query.startDate,
      endDate: query.endDate,
      createdByUserId: query.createdByUserId,
      arrivalDate: query.arrivalDate,
      arrivalTime: query.arrivalTime,
      arrival: query.arrival,
      customerId: query.customerId,
      notification: query.notification,
    });
    return createPaginatedResponse(
      result.results,
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
      searchField: query.searchField,
      sort: query.sort,
      merchantId: currentUser.merchantId!,
      orderId: query.orderId,
      orderItemId: query.orderItemId,
      startDate: query.startDate,
      endDate: query.endDate,
      createdByUserId: query.createdByUserId,
      arrivalDate: query.arrivalDate,
      arrivalTime: query.arrivalTime,
      arrival: query.arrival,
      customerId: query.customerId,
      notification: query.notification,
    });
    return createPaginatedResponse(
      result.results.map((e) => this.toResponse(e)),
      result.pagination,
    );
  }

  async getSummary(query: ArrivalListQueryDto): Promise<{ totalArrivals: number }> {
    return this.arrivalQueryRepository.getSummary({
      merchantId: query.merchantId,
      orderId: query.orderId,
      orderItemId: query.orderItemId,
      startDate: query.startDate,
      endDate: query.endDate,
      search: query.search,
      createdByUserId: query.createdByUserId,
      arrivalDate: query.arrivalDate,
      arrivalTime: query.arrivalTime,
      arrival: query.arrival,
      customerId: query.customerId,
    });
  }

  async getSummaryByMerchant(
    query: ArrivalListQueryDto,
    currentUser: import('../../../common/decorators/current-user.decorator').CurrentUserPayload,
  ): Promise<{ totalArrivals: number }> {
    return this.getSummary({ ...query, merchantId: currentUser.merchantId! });
  }

  private toResponse(entity: ArrivalOrmEntity): ArrivalResponseDto {
    const arrivedDate =
      entity.arrivedDate instanceof Date
        ? entity.arrivedDate.toISOString().slice(0, 10)
        : String(entity.arrivedDate);
    const orderDto: ArrivalResponseDto['order'] = entity.order
      ? {
          id: entity.order.id,
          orderCode: entity.order.orderCode,
          orderDate:
            entity.order.orderDate instanceof Date
              ? entity.order.orderDate.toISOString().slice(0, 10)
              : String(entity.order.orderDate),
          totalAmount: 0, // TODO: Calculate from order items
          currency: 'LAK', // TODO: Get from order
          status: entity.order.arrivalStatus ?? 'PENDING',
          paymentStatus: 'PENDING', // TODO: Get from customer orders
          customer: null, // TODO: Get from customer orders
          customerOrders: (entity.order.customerOrders ?? []).map((co) => ({
            id: co.id,
            customerId: co.customer?.id ?? (co as { customerId?: number }).customerId ?? 0,
          })),
        }
      : null;
    return {
      id: entity.id,
      orderId: entity.order?.id ?? 0,
      order: orderDto,
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
        variant: item.orderItem?.skus?.[0]?.variant ?? null,
        quantity: item.arrivedQuantity ?? 0,
        publicUrl: item.orderItem?.image?.publicUrl ?? null,
        purchasePrice: item.orderItem?.skus?.[0]?.purchasePrice ?? null,
        purchaseTotal: item.orderItem?.purchaseTotal ?? 0,
        shippingPrice: item.orderItem?.shippingTotal && item.orderItem?.quantity > 0 
          ? (item.orderItem.shippingTotal / item.orderItem.quantity) 
          : 0,
        totalCostBeforeDiscount: item.orderItem?.totalCostBeforeDiscount ?? 0,
        discountType: item.orderItem?.discountType ?? null,
        discountValue: item.orderItem?.discountValue ?? null,
        discountAmount: item.orderItem?.discountAmount ?? 0,
        finalCost: item.orderItem?.finalCost ?? 0,
        sellingPriceForeign: item.orderItem?.skus?.[0]?.sellingPriceForeign ?? null,
        sellingTotal: item.orderItem?.sellingTotal ?? 0,
        profit: item.orderItem?.profit ?? 0,
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
