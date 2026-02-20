import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, Repository } from 'typeorm';
import { BaseQueryRepository } from '../../../common/base/repositories/base.query-repository';
import { OrderOrmEntity } from '../entities/order.orm-entity';
import { PaginatedResult, PaginationResponse } from '../../../common/base/interfaces/paginted.interface';

export interface OrderFindOptions {
  page?: number;
  limit?: number;
  merchantId?: number;
  customerId?: number;
  customerName?: string;
  startDate?: string;
  endDate?: string;
}

@Injectable()
export class OrderQueryRepository extends BaseQueryRepository<OrderOrmEntity> {
  constructor(
    @InjectRepository(OrderOrmEntity)
    repository: Repository<OrderOrmEntity>,
  ) {
    super(repository);
  }

  async findWithPagination(
    options: OrderFindOptions,
    manager?: import('typeorm').EntityManager,
    relations?: FindManyOptions<OrderOrmEntity>['relations'],
  ): Promise<PaginatedResult<OrderOrmEntity>> {
    const repo = this.getRepo(manager);
    const page = Math.max(1, options.page ?? 1);
    const limit = Math.min(100, Math.max(1, options.limit ?? 10));
    const skip = (page - 1) * limit;

    const qb = repo
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.merchant', 'merchant')
      .leftJoinAndSelect('order.createdByUser', 'createdByUser')
      .leftJoinAndSelect('order.orderItems', 'orderItems')
      .leftJoinAndSelect('order.customerOrders', 'customerOrders')
      .leftJoinAndSelect('customerOrders.customerOrderItems', 'customerOrderItems')
      .leftJoinAndSelect('customerOrders.customer', 'customer');

    if (options.merchantId != null) {
      qb.andWhere('merchant.id = :merchantId', { merchantId: options.merchantId });
    }

    if (options.customerId != null) {
      qb.andWhere('customer.id = :customerId', { customerId: options.customerId });
    }

    if (options.customerName) {
      qb.andWhere('customer.fullName LIKE :customerName', {
        customerName: `%${options.customerName}%`,
      });
    }

    if (options.startDate) {
      qb.andWhere('DATE(order.orderDate) >= :startDate', { startDate: options.startDate });
    }

    if (options.endDate) {
      qb.andWhere('DATE(order.orderDate) <= :endDate', { endDate: options.endDate });
    }

    qb.orderBy('order.createdAt', 'DESC').skip(skip).take(limit);

    const [data, total] = await qb.getManyAndCount();

    const totalPages = Math.ceil(total / limit);
    const pagination: PaginationResponse = {
      total,
      page,
      limit,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    };
    return { success: true, Code: 200, message: 'Orders fetched successfully', results: data, pagination };
  }
}
