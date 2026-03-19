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
            'orderItems.image',
            'orderItems.skus',
            'orderItems.skus.exchangeRateBuy',
            'orderItems.skus.exchangeRateSell',
            'customerOrders',
            'customerOrders.customer',
            'customerOrders.customerOrderItems',
            'customerOrders.customerOrderItems.orderItemSku',
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
        'orderItems.image',
        'orderItems.skus',
        'orderItems.skus.exchangeRateBuy',
        'orderItems.skus.exchangeRateSell',
        'customerOrders',
        'customerOrders.customer',
        'customerOrders.customerOrderItems',
        'customerOrders.customerOrderItems.orderItemSku',
      ],
    });
    if (!entity) return null;
    return this.toResponse(entity);
  }

  async getList(query: OrderListQueryDto): Promise<ResponseWithPaginationInterface<OrderResponseDto>> {
    const result = await this.orderQueryRepository.findWithPagination({
      page: query.page,
      limit: query.limit,
      search: query.search,
      searchField: query.searchField,
      sort: query.sort,
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
    };
  }

  async getListByMerchant(
    query: OrderListQueryDto,
    currentUser: import('../../../common/decorators/current-user.decorator').CurrentUserPayload,
  ): Promise<ResponseWithPaginationInterface<OrderResponseDto>> {
    const result = await this.orderQueryRepository.findWithPagination({
      page: query.page,
      limit: query.limit,
      search: query.search,
      searchField: query.searchField,
      sort: query.sort,
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
    };
  }

  async getSummary(query: OrderListQueryDto): Promise<{ totalOrders: number; arrivedOrders: number; notArrivedOrders: number; paidOrders: number; unpaidOrders: number; }> {
    const summary = await this.orderQueryRepository.getSummary({
      merchantId: query.merchantId,
      customerId: query.customerId,
      customerName: query.customerName,
      search: query.search,
      searchField: query.searchField,
      startDate: query.startDate,
      endDate: query.endDate,
      arrivalStatus: query.arrivalStatus,
      paymentStatus: query.paymentStatus,
    });
    return {
      totalOrders: summary.totalOrders,
      arrivedOrders: summary.arrivedOrders,
      notArrivedOrders: summary.notArrivedOrders,
      paidOrders: summary.paidOrders,
      unpaidOrders: summary.unpaidOrders,
    };
  }

  async getSummaryByMerchant(
    query: OrderListQueryDto,
    currentUser: import('../../../common/decorators/current-user.decorator').CurrentUserPayload,
  ): Promise<{ totalOrders: number; arrivedOrders: number; notArrivedOrders: number; paidOrders: number; unpaidOrders: number; }> {
    return this.getSummary({
      ...query,
      merchantId: currentUser.merchantId!,
    });
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
      const converted = amount * exchangeRate.rate;
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
    console.log('entity', entity);

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
      totalProfit: entity.totalProfit.toString(),
      paymentStatus: entity.paymentStatus,

      targetCurrencyTotalPurchaseCost: this.convertToTargetCurrency(entity.totalPurchaseCost, entity.exchangeRateBuy),
      targetCurrencyTotalShippingCost: this.convertToTargetCurrency(entity.totalShippingCost, entity.exchangeRateBuy),
      targetCurrencyTotalCostBeforeDiscount: this.convertToTargetCurrency(entity.totalCostBeforeDiscount, entity.exchangeRateBuy),
      targetCurrencyTotalDiscount: this.convertToTargetCurrency(entity.totalDiscount, entity.exchangeRateBuy),
      targetCurrencyTotalFinalCost: this.convertToTargetCurrency(entity.totalFinalCost, entity.exchangeRateBuy),
      targetCurrencyTotalSellingAmount: this.convertToTargetCurrency(entity.totalSellingAmount, entity.exchangeRateSell),
      targetCurrencyTotalProfit: this.convertToTargetCurrency(entity.totalProfit, entity.exchangeRateSell),
     
      orderItems: (entity.orderItems ?? []).map((item) => {
        return {
          id: item.id,
          orderId: item.order?.id ?? 0,
          productName: item.productName,
          orderItemIndex: item.skus?.[0]?.orderItemSkuIndex ?? null,
          quantity: item.quantity,
          imageId: item.image?.id ?? null,
          image: item.image ? {
            id: item.image.id,
            publicUrl: item.image.publicUrl,
            fileName: item.image.fileName,
            originalName: item.image.originalName,
          } : null,
          exchangeRateBuy: item.order?.exchangeRateBuy ? {
            id: item.order.exchangeRateBuy.id,
            baseCurrency: item.order.exchangeRateBuy.baseCurrency,
            targetCurrency: item.order.exchangeRateBuy.targetCurrency,
            rate: item.order.exchangeRateBuy.rate.toString(),
            rateType: item.order.exchangeRateBuy.rateType,
            rateDate: item.order.exchangeRateBuy.rateDate,
            isActive: item.order.exchangeRateBuy.isActive,
          } : null,
          exchangeRateSell: item.order?.exchangeRateSell ? {
            id: item.order.exchangeRateSell.id,
            baseCurrency: item.order.exchangeRateSell.baseCurrency,
            targetCurrency: item.order.exchangeRateSell.targetCurrency,
            rate: item.order.exchangeRateSell.rate.toString(),
            rateType: item.order.exchangeRateSell.rateType,
            rateDate: item.order.exchangeRateSell.rateDate,
            isActive: item.order.exchangeRateSell.isActive,
          } : null,
          exchangeRateBuyValue: item.order?.exchangeRateBuyValue?.toString() || null,
          exchangeRateSellValue: item.order?.exchangeRateSellValue?.toString() || null,
          discountType: item.discountType,
          discountValue: item.discountValue?.toString() || null,
          discountAmount: item.discountAmount.toString(),
          purchaseTotal: item.purchaseTotal.toString(),
          shippingTotal: item.shippingTotal.toString(),
          totalCostBeforeDiscount: item.totalCostBeforeDiscount.toString(),
          finalCost: item.finalCost.toString(),
          sellingTotal: item.sellingTotal.toString(),
          profit: item.profit.toString(),

          targetCurrencyDiscountAmount: this.convertToTargetCurrency(item.discountAmount, item.order?.exchangeRateSell),
          targetCurrencyPurchaseTotal: this.convertToTargetCurrency(item.purchaseTotal, item.order?.exchangeRateSell),
          targetCurrencyShippingTotal: this.convertToTargetCurrency(item.shippingTotal, item.order?.exchangeRateSell),
          targetCurrencyTotalCostBeforeDiscount: this.convertToTargetCurrency(item.totalCostBeforeDiscount, item.order?.exchangeRateSell),
          targetCurrencyFinalCost: this.convertToTargetCurrency(item.finalCost, item.order?.exchangeRateSell),
          targetCurrencySellingTotal: this.convertToTargetCurrency(item.sellingTotal, item.order?.exchangeRateSell),
          targetCurrencyProfit: this.convertToTargetCurrency(item.profit, item.order?.exchangeRateSell),
          targetCurrencyPurchasePrice: item.order?.exchangeRateSell && item.quantity > 0 ? this.convertToTargetCurrency(item.purchaseTotal / item.quantity, item.order?.exchangeRateSell) : '0',
          targetCurrencySellingPriceForeign: item.order?.exchangeRateSell && item.quantity > 0 ? this.convertToTargetCurrency(item.sellingTotal / item.quantity, item.order?.exchangeRateSell) : '0',
          
          createdAt: item.createdAt,
          updatedAt: item.updatedAt,
          skus: item.skus?.map(sku => ({
            id: sku.id,
            orderItemId: item.id,
            orderItemSkuIndex: sku.orderItemSkuIndex,
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

            
            targetCurrencyPurchasePrice: this.convertToTargetCurrency(sku.purchasePrice, item.order?.exchangeRateSell),
            targetCurrencyPurchaseTotal: this.convertToTargetCurrency(sku.purchaseTotal, item.order?.exchangeRateSell),
            targetCurrencySellingPriceForeign: this.convertToTargetCurrency(sku.sellingPriceForeign, item.order?.exchangeRateSell),
            targetCurrencySellingTotal: this.convertToTargetCurrency(sku.sellingTotal, item.order?.exchangeRateSell),
            targetCurrencyProfit: this.convertToTargetCurrency(sku.profit, item.order?.exchangeRateSell),
          
            createdAt: sku.createdAt,
            updatedAt: sku.updatedAt,
          })) || [],

        // createdAt: item.createdAt,
        // updatedAt: item.updatedAt,
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
        
        targetCurrencyTotalSellingAmount: this.convertToTargetCurrency(customerOrder.totalSellingAmount, entity.exchangeRateSell),
        targetCurrencyPaidAmount: this.convertToTargetCurrency(customerOrder.totalPaid, entity.exchangeRateSell),
        targetCurrencyRemainingAmount: this.convertToTargetCurrency(customerOrder.remainingAmount, entity.exchangeRateSell),
        paymentStatus: customerOrder.paymentStatus,
        // hasPendingPayment: customerOrder.paymentStatus === 'UNPAID',
        customerOrderItems: (customerOrder.customerOrderItems ?? []).map((item) => ({
          id: item.id,
          customerOrderId: customerOrder.id,
          orderItemSkuId: item.orderItemSku?.id ?? 0,
          variant: item.orderItemSku?.variant || null,
          quantity: item.quantity,
          sellingPriceForeign: item.sellingPriceForeign.toString(),
          purchasePrice: item.purchasePrice.toString(),
          purchaseTotal: item.purchaseTotal.toString(),
          sellingTotal: item.sellingTotal.toString(),
          profit: item.profit.toString(),
          
          targetCurrencyPurchasePrice: this.convertToTargetCurrency(item.purchasePrice, entity.exchangeRateSell),
          targetCurrencyPurchaseTotal: this.convertToTargetCurrency(item.purchaseTotal, entity.exchangeRateSell),
          targetCurrencySellingPriceForeign: this.convertToTargetCurrency(item.sellingPriceForeign, entity.exchangeRateSell),
          targetCurrencySellingTotal: this.convertToTargetCurrency(item.sellingTotal, entity.exchangeRateSell),
          targetCurrencyProfit: this.convertToTargetCurrency(item.profit, entity.exchangeRateSell),
          
          createdAt: item.createdAt,
          updatedAt: item.updatedAt,
        })) || [],
        createdAt: customerOrder.createdAt,
        updatedAt: customerOrder.updatedAt,
      })),
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }
}
