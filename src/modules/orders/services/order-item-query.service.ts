import { Injectable, NotFoundException } from '@nestjs/common';
import { OrderItemQueryRepository } from '../repositories/order-item.query-repository';
import { OrderItemRepository } from '../repositories/order-item.repository';
import { OrderItemListQueryDto } from '../dto/order-item-list-query.dto';
import { OrderItemResponseDto } from '../dto/order-item-response.dto';
import type { ResponseInterface, ResponseWithPaginationInterface } from '../../../common/base/interfaces/response.interface';
import { createPaginatedResponse, createSingleResponse } from '../../../common/base/helpers/response.helper';
import { ExchangeRateOrmEntity } from 'src/modules/exchange-rates/entities/exchange-rate.orm-entity';
import type { CurrentUserPayload } from '../../../common/decorators/current-user.decorator';

@Injectable()
export class OrderItemQueryService {
  constructor(
    private readonly orderItemRepository: OrderItemRepository,
    private readonly orderItemQueryRepository: OrderItemQueryRepository,
  ) { }

  async getById(id: number): Promise<OrderItemResponseDto | null> {
    const entity = await this.orderItemQueryRepository.repository.findOne({
      where: { id },
      relations: ['order', 'exchangeRateBuy', 'exchangeRateSell', 'image'],
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

  async getListByMerchant(
    query: OrderItemListQueryDto,
    currentUser: CurrentUserPayload,
  ): Promise<ResponseWithPaginationInterface<OrderItemResponseDto>> {
    const merchantId = currentUser?.merchantId;
    if (!merchantId) {
      return createPaginatedResponse([], {
        total: 0,
        page: query.page ?? 1,
        limit: query.limit ?? 10,
        totalPages: 0,
        hasNextPage: false,
        hasPreviousPage: false,
      });
    }
    const result = await this.orderItemQueryRepository.findWithPagination({
      page: query.page,
      limit: query.limit,
      orderId: query.orderId,
      merchantId,
    });
    return createPaginatedResponse(
      result.results.map((e) => this.toResponse(e)),
      result.pagination,
    );
  }

  
  private convertToTargetCurrency(amount: number, exchangeRate: ExchangeRateOrmEntity | null): string {
    if (!exchangeRate) {
      console.log('No exchange rate provided, returning original amount:', amount);
      return amount.toString();
    }
      
      // If base currency is already the target currency, no conversion needed
      if (exchangeRate.baseCurrency === exchangeRate.targetCurrency) {
        console.log('Base and target currency are the same:', exchangeRate.baseCurrency);
        return amount.toString();
      }
      
      // Convert based on rate type
      if (exchangeRate.rateType === 'BUY') {
        // BUY rate: foreign currency -> base currency (LAK)
        // To convert from base to foreign: amount / rate
        const converted = amount / exchangeRate.rate;
        console.log(`BUY conversion: ${amount} / ${exchangeRate.rate} = ${converted}`);
        return converted.toString();
      } else {
        // SELL rate: base currency (LAK) -> foreign currency  
        // To convert from base to foreign: amount * rate
        const converted = amount * exchangeRate.rate;
        console.log(`SELL conversion: ${amount} * ${exchangeRate.rate} = ${converted}`);
        return converted.toString();
      }
    }
  
  private toResponse(entity: import('../entities/order-item.orm-entity').OrderItemOrmEntity): OrderItemResponseDto {
    return {
      id: entity.id,
      orderId: entity.order?.id ?? 0,
      productName: entity.productName,
      orderItemIndex: entity.skus?.[0]?.orderItemSkuIndex ?? null,
      quantity: entity.quantity,
      imageId: entity.image?.id ?? null,
      image: entity.image ? {
        id: entity.image.id,
        publicUrl: entity.image.publicUrl,
        fileName: entity.image.fileName,
        originalName: entity.image.originalName,
      } : null,
      exchangeRateBuy: entity.order?.exchangeRateBuy ? {
        id: entity.order.exchangeRateBuy.id,
        baseCurrency: entity.order.exchangeRateBuy.baseCurrency,
        targetCurrency: entity.order.exchangeRateBuy.targetCurrency,
        rate: entity.order.exchangeRateBuy.rate.toString(),
        rateType: entity.order.exchangeRateBuy.rateType,
        rateDate: entity.order.exchangeRateBuy.rateDate,
        isActive: entity.order.exchangeRateBuy.isActive,
      } : null,
      exchangeRateSell: entity.order?.exchangeRateSell ? {
        id: entity.order.exchangeRateSell.id,
        baseCurrency: entity.order.exchangeRateSell.baseCurrency,
        targetCurrency: entity.order.exchangeRateSell.targetCurrency,
        rate: entity.order.exchangeRateSell.rate.toString(),
        rateType: entity.order.exchangeRateSell.rateType,
        rateDate: entity.order.exchangeRateSell.rateDate,
        isActive: entity.order.exchangeRateSell.isActive,
      } : null,
      exchangeRateBuyValue: entity.order?.exchangeRateBuyValue?.toString() || null,
      exchangeRateSellValue: entity.order?.exchangeRateSellValue?.toString() || null,
      purchaseTotal: entity.purchaseTotal.toString(),
      shippingTotal: entity.shippingTotal.toString(),
      totalCostBeforeDiscount: entity.totalCostBeforeDiscount.toString(),
      discountType: entity.discountType,
      discountValue: entity.discountValue?.toString() || null,
      discountAmount: entity.discountAmount.toString(),
      finalCost: entity.finalCost.toString(),
      sellingTotal: entity.sellingTotal.toString(),
      profit: entity.profit.toString(),
      skus: entity.skus?.map(sku => ({
            id: sku.id,
            orderItemId: entity.id,
            variant: sku.variant,
            quantity: sku.quantity,
            exchangeRateBuy: sku.exchangeRateBuy ? {
              id: sku.exchangeRateBuy.id,
              baseCurrency: sku.exchangeRateBuy.baseCurrency,
              targetCurrency: sku.exchangeRateBuy.targetCurrency,
              rate: sku.exchangeRateBuy.rate.toString(),
              rateType: sku.exchangeRateBuy.rateType,
              rateDate: sku.exchangeRateBuy.rateDate,
              isActive: sku.exchangeRateBuy.isActive,
            } : null,
            exchangeRateSell: sku.exchangeRateSell ? {
              id: sku.exchangeRateSell.id,
              baseCurrency: sku.exchangeRateSell.baseCurrency,
              targetCurrency: sku.exchangeRateSell.targetCurrency,
              rate: sku.exchangeRateSell.rate.toString(),
              rateType: sku.exchangeRateSell.rateType,
              rateDate: sku.exchangeRateSell.rateDate,
              isActive: sku.exchangeRateSell.isActive,
            } : null,
            exchangeRateBuyValue: sku.exchangeRateBuyValue?.toString() || null,
            exchangeRateSellValue: sku.exchangeRateSellValue?.toString() || null,
            purchasePrice: sku.purchasePrice.toString(),
            purchaseTotal: sku.purchaseTotal.toString(),
            sellingPriceForeign: sku.sellingPriceForeign.toString(),
            sellingTotal: sku.sellingTotal.toString(),
            profit: sku.profit.toString(),
            createdAt: sku.createdAt,
            updatedAt: sku.updatedAt,
          })) || [],
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }
}
