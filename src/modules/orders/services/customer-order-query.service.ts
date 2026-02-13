import { Injectable, NotFoundException } from '@nestjs/common';
import { CustomerOrderQueryRepository } from '../repositories/customer-order.query-repository';
import { CustomerOrderRepository } from '../repositories/customer-order.repository';
import { CustomerOrderListQueryDto } from '../dto/customer-order-list-query.dto';
import { CustomerOrderResponseDto } from '../dto/customer-order-response.dto';
import { PaginatedResult } from '../../../common/base/interfaces/paginted.interface';

@Injectable()
export class CustomerOrderQueryService {
  constructor(
    private readonly customerOrderRepository: CustomerOrderRepository,
    private readonly customerOrderQueryRepository: CustomerOrderQueryRepository,
  ) {}

  async getById(id: number): Promise<CustomerOrderResponseDto | null> {
    const entity = await this.customerOrderQueryRepository.repository.findOne({
      where: { id },
      relations: ['order', 'customer'],
    });
    if (!entity) return null;
    return this.toResponse(entity);
  }

  async getByIdOrFail(id: number): Promise<CustomerOrderResponseDto> {
    const dto = await this.getById(id);
    if (!dto) throw new NotFoundException('Customer order not found');
    return dto;
  }

  async getList(query: CustomerOrderListQueryDto): Promise<PaginatedResult<CustomerOrderResponseDto>> {
    const result = await this.customerOrderQueryRepository.findWithPagination({
      page: query.page,
      limit: query.limit,
      orderId: query.orderId,
      customerId: query.customerId,
    });
    return {
      results: result.results.map((e) => this.toResponse(e)),
      pagination: result.pagination,
    };
  }

  private toResponse(entity: import('../entities/customer-order.orm-entity').CustomerOrderOrmEntity): CustomerOrderResponseDto {
    return {
      id: entity.id,
      orderId: entity.order?.id ?? 0,
      customerId: entity.customer?.id ?? 0,
      totalSellingAmountLak: entity.totalSellingAmountLak,
      totalPaid: entity.totalPaid,
      remainingAmount: entity.remainingAmount,
      paymentStatus: entity.paymentStatus,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }
}
