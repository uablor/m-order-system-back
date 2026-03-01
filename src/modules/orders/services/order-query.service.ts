import { Injectable, NotFoundException } from '@nestjs/common';
import { OrderQueryRepository } from '../repositories/order.query-repository';
import { OrderRepository } from '../repositories/order.repository';
import { OrderListQueryDto } from '../dto/order-list-query.dto';
import { OrderResponseDto, CustomerOrderResponseDto } from '../dto/order-response.dto';
import type { ResponseInterface, ResponseWithPaginationInterface } from '../../../common/base/interfaces/response.interface';
import { createSingleResponse } from '../../../common/base/helpers/response.helper';
import { DEFAULT_SUCCESS_CODE, DEFAULT_SUCCESS_MESSAGE } from '../../../common/base/helpers/response.helper';
import { ExchangeRateOrmEntity } from '../../exchange-rates/entities/exchange-rate.orm-entity';

@Injectable()
export class OrderQueryService {
  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly orderQueryRepository: OrderQueryRepository,
  ) {}

  async getById(id: number, withRelations = true): Promise<OrderResponseDto | null> {
    const entity = withRelations
      ? await this.orderQueryRepository.repository.findOne({
          where: { id },
          relations: [
            'merchant',
            'createdByUser',
            'exchangeRateBuy',
            'exchangeRateSell',
            'orderItems',
            'orderItems.exchangeRateBuy',
            'orderItems.exchangeRateSell',
            'customerOrders',
            'customerOrders.customerOrderItems',
            'customerOrders.customer',
          ],
        })
      : await this.orderRepository.findOneById(id);
    if (!entity) return null;
    return this.toResponse(entity);
  }

  async getByIdOrFail(id: number): Promise<ResponseInterface<OrderResponseDto>> {
    const dto = await this.getById(id);
    if (!dto) throw new NotFoundException('Order not found');
    return createSingleResponse(dto);
  }

  async getByIdWithItems(id: number): Promise<OrderResponseDto | null> {
    const entity = await this.orderQueryRepository.repository.findOne({
      where: { id },
      relations: [
        'merchant',
        'createdByUser',
        'exchangeRateBuy',
        'exchangeRateSell',
        'orderItems',
        'orderItems.exchangeRateBuy',
        'orderItems.exchangeRateSell',
        'customerOrders',
        'customerOrders.customerOrderItems',
        'customerOrders.customer',
      ],
    });
    if (!entity) return null;
    return this.toResponse(entity);
  }

  async getList(query: OrderListQueryDto): Promise<ResponseWithPaginationInterface<OrderResponseDto> & { summary: any }> {
    const result = await this.orderQueryRepository.findWithPagination({
      page: query.page,
      limit: query.limit,
      search: query.search,
      searchField: query.searchField,
      merchantId: query.merchantId,
      customerId: query.customerId,
      customerName: query.customerName,
      startDate: query.startDate,
      endDate: query.endDate,
      arrivalStatus: query.arrivalStatus,
      paymentStatus: query.paymentStatus,
    });
    return {
      success: true,
      Code: DEFAULT_SUCCESS_CODE,
      message: DEFAULT_SUCCESS_MESSAGE,
      results: result.results.map((e) => this.toResponse(e)),
      pagination: result.pagination,
      summary: result.summary,
    };
  }

  async getListByMerchant(
    query: OrderListQueryDto,
    currentUser: import('../../../common/decorators/current-user.decorator').CurrentUserPayload,
  ): Promise<ResponseWithPaginationInterface<OrderResponseDto> & { summary: any }> {
    const result = await this.orderQueryRepository.findWithPagination({
      page: query.page,
      limit: query.limit,
      search: query.search,
      searchField: query.searchField,
      merchantId: currentUser.merchantId!,
      customerId: query.customerId,
      customerName: query.customerName,
      startDate: query.startDate,
      endDate: query.endDate,
      arrivalStatus: query.arrivalStatus,
      paymentStatus: query.paymentStatus,
    });
    return {
      success: true,
      Code: DEFAULT_SUCCESS_CODE,
      message: DEFAULT_SUCCESS_MESSAGE,
      results: result.results.map((e) => this.toResponse(e)),
      pagination: result.pagination,
      summary: result.summary,
    };
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

  private toResponse(entity: import('../entities/order.orm-entity').OrderOrmEntity): OrderResponseDto {
    return {
      id: entity.id,
      merchantId: entity.merchant?.id ?? 0,
      createdByUser: entity.createdByUser ? {
        id: entity.createdByUser.id,
          fullName: entity.createdByUser.fullName,
        email: entity.createdByUser.email,
        roleId: entity.createdByUser.roleId,
        roleName: entity.createdByUser.role?.roleName,
        isActive: entity.createdByUser.isActive,
        lastLogin: entity.createdByUser.lastLogin,
        createdAt: entity.createdByUser.createdAt,
        updatedAt: entity.createdByUser.updatedAt,
      } : null,
      orderCode: entity.orderCode,
      orderDate: entity.orderDate instanceof Date ? entity.orderDate.toISOString().slice(0, 10) : String(entity.orderDate),
      arrivalStatus: entity.arrivalStatus,
      arrivedAt: entity.arrivedAt,
      notifiedAt: entity.notifiedAt,
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
      totalPurchaseCost: entity.totalPurchaseCost.toString(),
      totalShippingCost: entity.totalShippingCost.toString(),
      totalCostBeforeDiscount: entity.totalCostBeforeDiscount.toString(),
      totalDiscount: entity.totalDiscount.toString(),
      totalFinalCost: entity.totalFinalCost.toString() ,
      totalSellingAmount: entity.totalSellingAmount.toString() ,
      totalProfit: entity.totalProfit.toString() ,
      paymentStatus: entity.paymentStatus,

      targetCurrencyTotalPurchaseCost: this.convertToTargetCurrency(entity.totalPurchaseCost, entity.exchangeRateSell),
      targetCurrencyTotalShippingCost: this.convertToTargetCurrency(entity.totalShippingCost, entity.exchangeRateSell),
      targetCurrencyTotalCostBeforeDiscount: this.convertToTargetCurrency(entity.totalCostBeforeDiscount, entity.exchangeRateSell),
      targetCurrencyTotalDiscount: this.convertToTargetCurrency(entity.totalDiscount, entity.exchangeRateSell),
      targetCurrencyTotalFinalCost: this.convertToTargetCurrency(entity.totalFinalCost, entity.exchangeRateSell),
      targetCurrencyTotalSellingAmount: this.convertToTargetCurrency(entity.totalSellingAmount, entity.exchangeRateSell),
      targetCurrencyTotalProfit: this.convertToTargetCurrency(entity.totalProfit, entity.exchangeRateSell),
     
      orderItems: (entity.orderItems ?? []).map((item) => {
      console.log('Order Item Exchange Rate Sell:', item.exchangeRateSell);
      console.log('Order Item Exchange Rate Buy:', item.exchangeRateBuy);
      return {
        id: item.id,
        orderId: item.order?.id ?? 0,
        productName: item.productName,
        variant: item.variant,
        quantity: item.quantity,
        exchangeRateBuy: item.exchangeRateBuy ? {
          id: item.exchangeRateBuy.id,
          baseCurrency: item.exchangeRateBuy.baseCurrency,
          targetCurrency: item.exchangeRateBuy.targetCurrency,
          rate: item.exchangeRateBuy.rate.toString(),
          rateType: item.exchangeRateBuy.rateType,
          rateDate: item.exchangeRateBuy.rateDate,
          isActive: item.exchangeRateBuy.isActive,
        } : null,
        exchangeRateSell: item.exchangeRateSell ? {
          id: item.exchangeRateSell.id,
          baseCurrency: item.exchangeRateSell.baseCurrency,
          targetCurrency: item.exchangeRateSell.targetCurrency,
          rate: item.exchangeRateSell.rate.toString(),
          rateType: item.exchangeRateSell.rateType,
          rateDate: item.exchangeRateSell.rateDate,
          isActive: item.exchangeRateSell.isActive,
        } : null,
        exchangeRateBuyValue: item.exchangeRateBuyValue?.toString() || null,
        exchangeRateSellValue: item.exchangeRateSellValue?.toString() || null,
        purchasePrice: item.purchasePrice.toString(),
        purchaseTotal: item.purchaseTotal.toString(),
        shippingPrice: item.shippingPrice?.toString() || null,
        totalCostBeforeDiscount: item.totalCostBeforeDiscount.toString(),
        discountType: item.discountType,
        discountValue: item.discountValue?.toString() || null,
        discountAmount: item.discountAmount.toString(),
        finalCost: item.finalCost.toString(),
        sellingPriceForeign: item.sellingPriceForeign.toString(),
        sellingTotal: item.sellingTotal.toString(),
        profit: item.profit.toString(),

        targetCurrencyPurchasePrice: this.convertToTargetCurrency(item.purchasePrice, item.exchangeRateSell),
        targetCurrencyPurchaseTotal: this.convertToTargetCurrency(item.purchaseTotal, item.exchangeRateSell),
        targetCurrencyShippingPrice: item.shippingPrice ? this.convertToTargetCurrency(item.shippingPrice, item.exchangeRateSell) : null,
        targetCurrencyTotalCostBeforeDiscount: this.convertToTargetCurrency(item.totalCostBeforeDiscount, item.exchangeRateSell),
        targetCurrencyDiscountType: item.discountType,
        targetCurrencyDiscountValue: item.discountValue ? this.convertToTargetCurrency(item.discountValue, item.exchangeRateSell) : null,
        targetCurrencyDiscountAmount: this.convertToTargetCurrency(item.discountAmount, item.exchangeRateSell),
        targetCurrencyFinalCost: this.convertToTargetCurrency(item.finalCost, item.exchangeRateSell),
        targetCurrencySellingPriceForeign: this.convertToTargetCurrency(item.sellingPriceForeign, item.exchangeRateSell),
        targetCurrencySellingTotal: this.convertToTargetCurrency(item.sellingTotal, item.exchangeRateSell),
        targetCurrencyProfit: this.convertToTargetCurrency(item.profit, item.exchangeRateSell),
        
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
      };
    }),
      customerOrders: (entity.customerOrders ?? []).map((customerOrder): CustomerOrderResponseDto => ({
        id: customerOrder.id,
        orderId: customerOrder.order?.id ?? 0,
        customerId: customerOrder.customer?.id ?? 0,
        customer: customerOrder.customer
          ? {
              id: customerOrder.customer.id,
              customerName: customerOrder.customer.customerName,
              customerType: customerOrder.customer.customerType,
            }
          : null,
        totalSellingAmount: customerOrder.totalSellingAmount.toString(),
        paidAmount: customerOrder.totalPaid.toString(),
        remainingAmount: customerOrder.remainingAmount.toString(),
        paymentStatus: customerOrder.paymentStatus,
        customerOrderItems: (customerOrder.customerOrderItems ?? []).map((item) => ({
          id: item.id,
          customerOrderId: item.customerOrder?.id ?? 0,
          orderItemId: item.orderItem?.id ?? 0,
          quantity: item.quantity,
          sellingTotal: item.sellingTotal.toString(),
          profit: item.profit.toString(),

          targetCurrencySellingTotal: item.targetCurrencySellingTotal.toString(),
          targetCurrencyProfit: item.targetCurrencyProfit.toString(),
          createdAt: item.createdAt,
          updatedAt: item.updatedAt,
        })),
        createdAt: customerOrder.createdAt,
        updatedAt: customerOrder.updatedAt,
      })),
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }
}
