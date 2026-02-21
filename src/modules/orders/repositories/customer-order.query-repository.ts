import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { BaseQueryRepository } from '../../../common/base/repositories/base.query-repository';
import { CustomerOrderOrmEntity } from '../entities/customer-order.orm-entity';
import { PaginatedResult, PaginationResponse } from '../../../common/base/interfaces/paginted.interface';

@Injectable()
export class CustomerOrderQueryRepository extends BaseQueryRepository<CustomerOrderOrmEntity> {
  constructor(
    @InjectRepository(CustomerOrderOrmEntity)
    repository: Repository<CustomerOrderOrmEntity>,
  ) {
    super(repository);
  }

  async findWithPagination(
    options: { page?: number; limit?: number; orderId?: number; customerId?: number; customerToken?: string; customerName?: string; startDate?: string; endDate?: string },
    manager?: import('typeorm').EntityManager,
  ): Promise<PaginatedResult<CustomerOrderOrmEntity>> {
    const repo = this.getRepo(manager);
    const page = Math.max(1, options.page ?? 1);
    const limit = Math.min(100, Math.max(1, options.limit ?? 10));
    const skip = (page - 1) * limit;
    const where: FindOptionsWhere<CustomerOrderOrmEntity> = {};
    
    if (options.orderId != null) where.order = { id: options.orderId };
    if (options.customerId != null) where.customer = { id: options.customerId };
    if (options.customerToken) {
      where.customer = {
        ...(where.customer as any || {}),
        uniqueToken: options.customerToken
      };
    }
    if (options.customerName) {
      where.customer = {
        ...(where.customer as any || {}),
        contactName: options.customerName
      };
    }
    
    const [data, total] = await repo.findAndCount({
      where: Object.keys(where).length ? where : undefined,
      relations: ['order', 'customer', 'customerOrderItems', 'customerOrderItems.orderItem'],
      order: { id: 'ASC' as const },
      skip,
      take: limit,
    });

    // Apply date filters if provided
    if (options.startDate || options.endDate) {
      const dateConditions: any = {};
      if (options.startDate) dateConditions.$gte = new Date(options.startDate);
      if (options.endDate) dateConditions.$lte = new Date(options.endDate);
      if (Object.keys(dateConditions).length) {
        where.createdAt = dateConditions;
      }
    }

    const totalPages = Math.ceil(total / limit);
    const pagination: PaginationResponse = {
      total,
      page,
      limit,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    };
    return { success: true, Code: 200, message: 'Customer orders fetched successfully', results: data, pagination };
  }
}
