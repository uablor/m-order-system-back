import { Injectable, NotFoundException } from '@nestjs/common';
import { CustomerOrderItemQueryRepository } from '../repositories/customer-order-item.query-repository';
import { CustomerOrderItemRepository } from '../repositories/customer-order-item.repository';
import { CustomerOrderItemListQueryDto } from '../dto/customer-order-item-list-query.dto';
import { CustomerOrderItemResponseDto } from '../dto/customer-order-item-response.dto';
import { PaginatedResult } from '../../../common/base/interfaces/paginted.interface';

@Injectable()
export class CustomerOrderItemQueryService {
  constructor(
    private readonly customerOrderItemRepository: CustomerOrderItemRepository,
    private readonly customerOrderItemQueryRepository: CustomerOrderItemQueryRepository,
  ) {}

  async getById(id: number): Promise<CustomerOrderItemResponseDto | null> {
    const entity = await this.customerOrderItemQueryRepository.repository.findOne({
      where: { id },
      relations: ['customerOrder', 'orderItem'],
    });
    if (!entity) return null;
    return this.toResponse(entity);
  }

  async getByIdOrFail(id: number): Promise<CustomerOrderItemResponseDto> {
    const dto = await this.getById(id);
    if (!dto) throw new NotFoundException('Customer order item not found');
    return dto;
  }

  async getList(query: CustomerOrderItemListQueryDto): Promise<PaginatedResult<CustomerOrderItemResponseDto>> {
    const result = await this.customerOrderItemQueryRepository.findWithPagination({
      page: query.page,
      limit: query.limit,
      customerOrderId: query.customerOrderId,
      orderItemId: query.orderItemId,
    });
    return {
      results: result.results.map((e) => this.toResponse(e)),
      pagination: result.pagination,
    };
  }

  private toResponse(entity: import('../entities/customer-order-item.orm-entity').CustomerOrderItemOrmEntity): CustomerOrderItemResponseDto {
    return {
      id: entity.id,
      customerOrderId: entity.customerOrder?.id ?? 0,
      orderItemId: entity.orderItem?.id ?? 0,
      quantity: entity.quantity,
      sellingPriceForeign: entity.sellingPriceForeign,
      sellingTotalLak: entity.sellingTotalLak,
      profitLak: entity.profitLak,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }
}
