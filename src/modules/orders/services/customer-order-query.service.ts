import { Injectable, NotFoundException } from '@nestjs/common';
import { CustomerOrderQueryRepository } from '../repositories/customer-order.query-repository';
import { CustomerOrderRepository } from '../repositories/customer-order.repository';
import { CustomerOrderListQueryDto } from '../dto/customer-order-list-query.dto';
import { CustomerOrderResponseDto } from '../dto/customer-order-response.dto';
import type { ResponseInterface, ResponseWithPaginationInterface } from '../../../common/base/interfaces/response.interface';
import { createPaginatedResponse, createSingleResponse } from '../../../common/base/helpers/response.helper';

@Injectable()
export class CustomerOrderQueryService {
  constructor(
    private readonly customerOrderRepository: CustomerOrderRepository,
    private readonly customerOrderQueryRepository: CustomerOrderQueryRepository,
  ) {}

  async getById(id: number): Promise<CustomerOrderResponseDto | null> {
    const entity = await this.customerOrderQueryRepository.repository.findOne({
      where: { id },
      relations: ['order', 'customer', 'customerOrderItems', 'customerOrderItems.orderItem'],
    });
    if (!entity) return null;
    return this.toResponse(entity);
  }

  async getByIdOrFail(id: number): Promise<ResponseInterface<CustomerOrderResponseDto>> {
    const dto = await this.getById(id);
    if (!dto) throw new NotFoundException('Customer order not found');
    return createSingleResponse(dto);
  }

  async getList(query: CustomerOrderListQueryDto): Promise<ResponseWithPaginationInterface<CustomerOrderResponseDto>> {
    const result = await this.customerOrderQueryRepository.findWithPagination({
      page: query.page,
      limit: query.limit,
      orderId: query.orderId,
      customerId: query.customerId,
      customerToken: query.customerToken,
      customerName: query.customerName,
      startDate: query.startDate,
      endDate: query.endDate,
    });
    return createPaginatedResponse(
      result.results.map((e) => this.toResponse(e)),
      result.pagination,
    );
  }

  private toResponse(entity: import('../entities/customer-order.orm-entity').CustomerOrderOrmEntity): CustomerOrderResponseDto {
    return {
      id: entity.id,
      orderId: entity.order?.id ?? 0,
      customerId: entity.customer?.id ?? 0,
      customerName: entity.customer?.contactLine || '',
      customerToken: entity.customer?.uniqueToken || '',
      totalSellingAmount: entity.totalSellingAmount,
      totalPaid: entity.totalPaid,
      remainingAmount: entity.remainingAmount,
      paymentStatus: entity.paymentStatus,
      customerOrderItems: entity.customerOrderItems?.map(item => ({
        id: item.id,
        orderId: item.orderItem?.id ?? 0,
        productName: item.orderItem?.productName || '',
        quantity: item.quantity,
        sellingPriceForeign: item.sellingPriceForeign,
        sellingTotal: item.sellingTotal,
        profit: item.profit,
      })) || [],
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }
}
