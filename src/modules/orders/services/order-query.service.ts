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
            'orderItems',
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
        'orderItems',
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
      totalPurchaseCostLak: entity.totalPurchaseCostLak,
      totalShippingCostLak: entity.totalShippingCostLak,
      totalCostBeforeDiscountLak: entity.totalCostBeforeDiscountLak,
      totalDiscountLak: entity.totalDiscountLak,
      totalFinalCostLak: entity.totalFinalCostLak,
      totalFinalCostThb: entity.totalFinalCostThb,
      totalSellingAmountLak: entity.totalSellingAmountLak,
      totalSellingAmountThb: entity.totalSellingAmountThb,
      totalProfitLak: entity.totalProfitLak,
      totalProfitThb: entity.totalProfitThb,
      depositAmount: entity.depositAmount,
      paidAmount: entity.paidAmount,
      remainingAmount: entity.remainingAmount,
      paymentStatus: entity.paymentStatus,
      orderItems: (entity.orderItems ?? []).map((item) => ({
        id: item.id,
        orderId: item.order?.id ?? 0,
        productName: item.productName,
        variant: item.variant,
        quantity: item.quantity,
        quantityRemaining: item.quantityRemaining,
        purchaseCurrency: item.purchaseCurrency,
        purchasePrice: item.purchasePrice,
        purchaseExchangeRate: item.purchaseExchangeRate,
        purchaseTotalLak: item.purchaseTotalLak,
        shippingPrice: item.shippingPrice,
        shippingLak: item.shippingLak,
        totalCostBeforeDiscountLak: item.totalCostBeforeDiscountLak,
        discountType: item.discountType,
        discountValue: item.discountValue,
        discountAmountLak: item.discountAmountLak,
        finalCostLak: item.finalCostLak,
        finalCostThb: item.finalCostThb,
        sellingPriceForeign: item.sellingPriceForeign,
        sellingExchangeRate: item.sellingExchangeRate,
        sellingTotalLak: item.sellingTotalLak,
        profitLak: item.profitLak,
        profitThb: item.profitThb,
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
        totalSellingAmountLak: customerOrder.totalSellingAmountLak,
        paidAmount: customerOrder.totalPaid,
        remainingAmount: customerOrder.remainingAmount,
        paymentStatus: customerOrder.paymentStatus,
        customerOrderItems: (customerOrder.customerOrderItems ?? []).map((item) => ({
          id: item.id,
          customerOrderId: item.customerOrder?.id ?? 0,
          orderItemId: item.orderItem?.id ?? 0,
          quantity: item.quantity,
          sellingTotalLak: item.sellingTotalLak,
          profitLak: item.profitLak,
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
