import { Injectable, NotFoundException } from '@nestjs/common';
import { OrderQueryRepository } from '../repositories/order.query-repository';
import { OrderRepository } from '../repositories/order.repository';
import { OrderListQueryDto } from '../dto/order-list-query.dto';
import { OrderResponseDto, CustomerOrderResponseDto } from '../dto/order-response.dto';
import type { ResponseInterface, ResponseWithPaginationInterface } from '../../../common/base/interfaces/response.interface';
import { createSingleResponse } from '../../../common/base/helpers/response.helper';
import { DEFAULT_SUCCESS_CODE, DEFAULT_SUCCESS_MESSAGE } from '../../../common/base/helpers/response.helper';

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
      orderItems: (entity.orderItems ?? []).map((item) => ({
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
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
      })),
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
