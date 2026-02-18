import { Injectable, NotFoundException } from '@nestjs/common';
import { OrderQueryRepository } from '../repositories/order.query-repository';
import { OrderRepository } from '../repositories/order.repository';
import { OrderListQueryDto } from '../dto/order-list-query.dto';
import { OrderResponseDto } from '../dto/order-response.dto';
import type { ResponseInterface, ResponseWithPaginationInterface } from '../../../common/base/interfaces/response.interface';
import { createPaginatedResponse, createSingleResponse } from '../../../common/base/helpers/response.helper';
import { OrderOrmEntity } from '../entities/order.orm-entity';
import { CustomerOrderOrmEntity } from '../entities/customer-order.orm-entity';
import { CustomerOrderResponseDto } from '../dto/customer-order-response.dto';

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
          relations: ['merchant', 'createdByUser'],
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
        'createdByUser.role',          // ✅ ต้องเอา role ด้วย
        'orderItems',
        'orderItems.order',            // ✅ ถ้าใช้ orderItem.order.id
        'customerOrders',
        'customerOrders.customer',     // ✅ customer
        'customerOrders.customerOrderItems',
        'customerOrders.customerOrderItems.orderItem', // ✅ orderItem ของ customerOrderItems
      ],
    });
    if (!entity) return null;
    return this.toResponse(entity);
  }

  async getList(query: OrderListQueryDto): Promise<ResponseWithPaginationInterface<OrderResponseDto>> {
    const result = await this.orderQueryRepository.findWithPagination({
      page: query.page,
      limit: query.limit,
      merchantId: query.merchantId,
    },
    undefined,
    ['merchant', 'createdByUser', 'orderItems', 'customerOrders', 'customerOrders.customerOrderItems', 'customerOrders.customer']
  );
  console.log("result.results", result.results);
  console.log("result.pagination", result.pagination);
    return createPaginatedResponse(
      result.results.map((e) => this.toResponse(e)),
      result.pagination,
    );
  }
  private toResponse(entity: OrderOrmEntity): OrderResponseDto {
    return {
      id: entity.id,
      merchantId: entity.merchant?.id ?? 0,
      createdByUser: entity.createdByUser
  ? {
      id: entity.createdByUser.id,
      email: entity.createdByUser.email,
      fullName: entity.createdByUser.fullName,
      roleId: entity.createdByUser.role?.id ?? 0, // ✅ ป้องกัน undefined
      roleName: entity.createdByUser.role?.roleName ?? 'N/A',
      isActive: entity.createdByUser.isActive,
      createdAt: entity.createdByUser.createdAt,
      updatedAt: entity.createdByUser.updatedAt,
      lastLogin: entity.createdByUser.lastLogin,
    }
  : null,
      orderCode: entity.orderCode,
      orderDate:
        entity.orderDate instanceof Date
          ? entity.orderDate.toISOString().slice(0, 10)
          : String(entity.orderDate),
  
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
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      // 🔥 เพิ่มตรงนี้
      orderItems: entity.orderItems?.map((item) => ({
        id: item.id,
        orderId: item.order?.id ?? 0, // ✅ ป้องกัน undefined
        productName: item.productName,
        variant: item.variant ?? null,
        quantity: item.quantity,
        quantityRemaining: item.quantityRemaining,
        purchaseCurrency: item.purchaseCurrency,
        purchasePrice: item.purchasePrice,
        purchaseExchangeRate: item.purchaseExchangeRate,
        purchaseTotalLak: item.purchaseTotalLak,
        totalCostBeforeDiscountLak: item.totalCostBeforeDiscountLak,
        discountType: item.discountType ?? null,
        discountValue: item.discountValue ?? null,
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
  
      customerOrders: entity.customerOrders?.map((co) => ({
        id: co.id,
        customerId: co.customer?.id ?? 0, // ✅ ป้องกัน null
        totalSellingAmountLak: co.totalSellingAmountLak,
        totalPaid: co.totalPaid,
        remainingAmount: co.remainingAmount,
        paymentStatus: co.paymentStatus,
        items: co.customerOrderItems?.map((ci) => ({
          id: ci.id,
          orderItemId: ci.orderItem?.id ?? 0, // ✅ ป้องกัน undefined
          quantity: ci.quantity,
          sellingTotalLak: ci.sellingTotalLak,
          profitLak: ci.profitLak,
          createdAt: ci.createdAt,
          updatedAt: ci.updatedAt,
        })) ?? [],
        createdAt: co.createdAt,
        updatedAt: co.updatedAt,
      })) ?? [],
    };
  }
}
