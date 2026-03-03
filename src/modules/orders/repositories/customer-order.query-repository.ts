import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository, Not, IsNull } from 'typeorm';
import { BaseQueryRepository } from '../../../common/base/repositories/base.query-repository';
import { CustomerOrderOrmEntity } from '../entities/customer-order.orm-entity';
import { PaginatedResult, PaginationResponse } from '../../../common/base/interfaces/paginted.interface';
import { CustomerOrderListQueryDto } from '../dto/customer-order-list-query.dto';
import { fetchWithPagination } from '../../../common/utils/pagination.util';
import { ResponseWithPaginationInterface } from '../../../common/base/interfaces/response.interface';
import { SortDirection } from '../../../common/base/enums/base.query.enum';

@Injectable()
export class CustomerOrderQueryRepository extends BaseQueryRepository<CustomerOrderOrmEntity> {
  constructor(
    @InjectRepository(CustomerOrderOrmEntity)
    repository: Repository<CustomerOrderOrmEntity>,
  ) {
    super(repository);
  }

  async findWithPagination(
    options: CustomerOrderListQueryDto,
    manager?: import('typeorm').EntityManager,
  ): Promise<ResponseWithPaginationInterface<CustomerOrderOrmEntity>> {
    const repo = this.getRepo(manager);
  const qb = repo.createQueryBuilder('customerOrder')
    .leftJoinAndSelect('customerOrder.order', 'order')
    .leftJoinAndSelect('customerOrder.notification', 'notification')
    .leftJoinAndSelect('customerOrder.customer', 'customer')
    .leftJoinAndSelect('customerOrder.customerOrderItems', 'customerOrderItems')
    .leftJoinAndSelect('customerOrderItems.orderItem', 'orderItem');

  // Apply filters
  if (options.orderId != null) {
    qb.andWhere('order.id = :orderId', { orderId: options.orderId });
  }
  
  if (options.customerId != null) {
    qb.andWhere('customer.id = :customerId', { customerId: options.customerId });
  }
  
  if (options.customerToken) {
    qb.andWhere('customer.uniqueToken = :customerToken', { customerToken: options.customerToken });
  }
  
  if (options.notificationToken) {
    qb.andWhere('notification.notificationToken = :notificationToken', { notificationToken: options.notificationToken });
  }
  
  if (options.customerName) {
    qb.andWhere('customer.contactName LIKE :customerName', { customerName: `%${options.customerName}%` });
  }
  
  if (options.isArrived !== undefined) {
    if (options.isArrived) {
      qb.andWhere('order.arrivedAt IS NOT NULL');
    } else {
      qb.andWhere('order.arrivedAt IS NULL');
    }
  }
  
  // Apply date filters
  if (options.startDate) {
    qb.andWhere('customerOrder.createdAt >= :startDate', { startDate: new Date(options.startDate) });
  }
  
  if (options.endDate) {
    qb.andWhere('customerOrder.createdAt <= :endDate', { endDate: new Date(options.endDate) });
  }

  return fetchWithPagination({
    qb,
    page: options.page ?? 1,
    limit: options.limit ?? 10,
    sort: SortDirection.ASC, // Default sort direction
    manager: manager!,
  });
  }
}
