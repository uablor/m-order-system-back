import { Injectable, NotFoundException } from '@nestjs/common';
import { OrderItemQueryRepository } from '../repositories/order-item.query-repository';
import { OrderItemRepository } from '../repositories/order-item.repository';
import { OrderItemListQueryDto } from '../dto/order-item-list-query.dto';
import { OrderItemResponseDto } from '../dto/order-item-response.dto';
import { PaginatedResult } from '../../../common/base/interfaces/paginted.interface';

@Injectable()
export class OrderItemQueryService {
  constructor(
    private readonly orderItemRepository: OrderItemRepository,
    private readonly orderItemQueryRepository: OrderItemQueryRepository,
  ) {}

  async getById(id: number): Promise<OrderItemResponseDto | null> {
    const entity = await this.orderItemQueryRepository.repository.findOne({
      where: { id },
      relations: ['order'],
    });
    if (!entity) return null;
    return this.toResponse(entity);
  }

  async getByIdOrFail(id: number): Promise<OrderItemResponseDto> {
    const dto = await this.getById(id);
    if (!dto) throw new NotFoundException('Order item not found');
    return dto;
  }

  async getList(query: OrderItemListQueryDto): Promise<PaginatedResult<OrderItemResponseDto>> {
    const result = await this.orderItemQueryRepository.findWithPagination({
      page: query.page,
      limit: query.limit,
      orderId: query.orderId,
    });
    return {
      results: result.results.map((e) => this.toResponse(e)),
      pagination: result.pagination,
    };
  }

  private toResponse(entity: import('../entities/order-item.orm-entity').OrderItemOrmEntity): OrderItemResponseDto {
    return {
      id: entity.id,
      orderId: entity.order?.id ?? 0,
      productName: entity.productName,
      variant: entity.variant,
      quantity: entity.quantity,
      quantityRemaining: entity.quantityRemaining,
      purchaseCurrency: entity.purchaseCurrency,
      purchasePrice: entity.purchasePrice,
      purchaseExchangeRate: entity.purchaseExchangeRate,
      purchaseTotalLak: entity.purchaseTotalLak,
      totalCostBeforeDiscountLak: entity.totalCostBeforeDiscountLak,
      discountType: entity.discountType,
      discountValue: entity.discountValue,
      discountAmountLak: entity.discountAmountLak,
      finalCostLak: entity.finalCostLak,
      finalCostThb: entity.finalCostThb,
      sellingPriceForeign: entity.sellingPriceForeign,
      sellingExchangeRate: entity.sellingExchangeRate,
      sellingTotalLak: entity.sellingTotalLak,
      profitLak: entity.profitLak,
      profitThb: entity.profitThb,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }
}
