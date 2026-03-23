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
    .leftJoinAndSelect('customerOrder.order', 'ord')
    .leftJoinAndSelect('ord.exchangeRateBuy', 'exchangeRateBuy')
    .leftJoinAndSelect('ord.exchangeRateSell', 'exchangeRateSell')
    .leftJoinAndSelect('customerOrder.notification', 'notification')
    .leftJoinAndSelect('customerOrder.customer', 'customer')
    .leftJoinAndSelect('customerOrder.customerOrderItems', 'customerOrderItems')
    
    .leftJoinAndSelect('customerOrderItems.orderItemSku', 'orderItemSku');

  // Apply filters
  if (options.orderId != null) {
    qb.andWhere('ord.id = :orderId', { orderId: options.orderId });
  }

  if (options.customerOrderId != null) {
    qb.andWhere('customerOrder.id = :customerOrderId', { customerOrderId: options.customerOrderId });
  }
  
  if (options.customerId != null) {
    qb.andWhere('customer.id = :customerId', { customerId: options.customerId });
  }
  
  if (options.merchantId != null) {
    qb.andWhere('ord.merchantId = :merchantId', { merchantId: options.merchantId });
  }
  
  if (options.customerToken) {
    qb.andWhere('customer.uniqueToken = :customerToken', { customerToken: options.customerToken });
  }
  
  if (options.notificationToken) {
    qb.andWhere('notification.uniqueToken = :notificationToken', { notificationToken: options.notificationToken });
  }
  
  // Apply notification filter: if status is specified, use it; otherwise default to null
 if (options.notificationStatus) {
  if (options.notificationStatus === 'null') {
    qb.andWhere('customerOrder.notification_id IS NULL');
  } else {
    qb.andWhere('customerOrder.notification_id = :notificationStatus', {
      notificationStatus: options.notificationStatus,
    });
  }
} else if (!options.notificationToken) {
  // ❗ ใส่เงื่อนไขนี้เพิ่ม
  qb.andWhere('customerOrder.notification_id IS NULL');
}
  
  if (options.customerName) {
    qb.andWhere('customer.customerName LIKE :customerName', { customerName: `%${options.customerName}%` });
  }
  
  if (options.isArrived !== undefined) {
    if (options.isArrived) {
      qb.andWhere('ord.arrivedAt IS NOT NULL');
    } else {
      qb.andWhere('ord.arrivedAt IS NULL');
    }
  }
  
  // Apply date filters
  if (options.startDate) {
    qb.andWhere('customerOrder.createdAt >= :startDate', { startDate: new Date(options.startDate) });
  }
  
  if (options.endDate) {
    qb.andWhere('customerOrder.createdAt <= :endDate', { endDate: new Date(options.endDate) });
  }

  if (options.paymentStatus) {
    qb.andWhere('customerOrder.paymentStatus = :paymentStatus', { paymentStatus: options.paymentStatus });
  }

  return fetchWithPagination({
    qb,
    page: options.page ?? 1,
    limit: options.limit ?? 10,
    search: options.search ? { kw: options.search, field: options.searchField ?? 'customerOrder.id' } : undefined,
    sort: options.sort ?? SortDirection.DESC,
    manager: manager!,
  });
  }
}
