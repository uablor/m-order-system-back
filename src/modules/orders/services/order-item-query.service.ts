import { Injectable, NotFoundException } from '@nestjs/common';
import { OrderItemQueryRepository } from '../repositories/order-item.query-repository';
import { OrderItemRepository } from '../repositories/order-item.repository';
import { OrderItemListQueryDto } from '../dto/order-item-list-query.dto';
import { OrderItemResponseDto } from '../dto/order-item-response.dto';
import type { ResponseInterface, ResponseWithPaginationInterface } from '../../../common/base/interfaces/response.interface';
import { createPaginatedResponse, createSingleResponse } from '../../../common/base/helpers/response.helper';

@Injectable()
export class OrderItemQueryService {
  constructor(
    private readonly orderItemRepository: OrderItemRepository,
    private readonly orderItemQueryRepository: OrderItemQueryRepository,
  ) { }

  async getById(id: number): Promise<OrderItemResponseDto | null> {
    const entity = await this.orderItemQueryRepository.repository.findOne({
      where: { id },
      relations: ['order', 'exchangeRateBuy', 'exchangeRateSell'],
    });
    if (!entity) return null;
    return this.toResponse(entity);
  }

  async getByIdOrFail(id: number): Promise<ResponseInterface<OrderItemResponseDto>> {
    const dto = await this.getById(id);
    if (!dto) throw new NotFoundException('Order item not found');
    return createSingleResponse(dto);
  }

  async getList(query: OrderItemListQueryDto): Promise<ResponseWithPaginationInterface<OrderItemResponseDto>> {
    const result = await this.orderItemQueryRepository.findWithPagination({
      page: query.page,
      limit: query.limit,
      orderId: query.orderId,
    });
    return createPaginatedResponse(
      result.results.map((e) => this.toResponse(e)),
      result.pagination,
    );
  }

  private toResponse(entity: import('../entities/order-item.orm-entity').OrderItemOrmEntity): OrderItemResponseDto {
    return {
      id: entity.id,
      orderId: entity.order?.id ?? 0,
      productName: entity.productName,
      variant: entity.variant,
      quantity: entity.quantity,
      exchangeRateBuy: entity.exchangeRateBuy ? {
        id: entity.exchangeRateBuy.id,
        baseCurrency: entity.exchangeRateBuy.baseCurrency,
        targetCurrency: entity.exchangeRateBuy.targetCurrency,
        rate: entity.exchangeRateBuy.rate.toString(),
        rateType: entity.exchangeRateBuy.rateType,
        rateDate: entity.exchangeRateBuy.rateDate,
        isActive: entity.exchangeRateBuy.isActive,
      } : null,
      exchangeRateSell: entity.exchangeRateSell ? {
        id: entity.exchangeRateSell.id,
        baseCurrency: entity.exchangeRateSell.baseCurrency,
        targetCurrency: entity.exchangeRateSell.targetCurrency,
        rate: entity.exchangeRateSell.rate.toString(),
        rateType: entity.exchangeRateSell.rateType,
        rateDate: entity.exchangeRateSell.rateDate,
        isActive: entity.exchangeRateSell.isActive,
      } : null,
      exchangeRateBuyValue: entity.exchangeRateBuyValue?.toString() || null,
      exchangeRateSellValue: entity.exchangeRateSellValue?.toString() || null,
      purchasePrice: entity.purchasePrice.toString(),
      purchaseTotal: entity.purchaseTotal.toString(),
      shippingPrice: entity.shippingPrice?.toString() || null,
      totalCostBeforeDiscount: entity.totalCostBeforeDiscount.toString(),
      discountType: entity.discountType,
      discountValue: entity.discountValue?.toString() || null,
      discountAmount: entity.discountAmount.toString(),
      finalCost: entity.finalCost.toString(),
      sellingPriceForeign: entity.sellingPriceForeign.toString(),
      sellingTotal: entity.sellingTotal.toString(),
      profit: entity.profit.toString(),
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }
}
