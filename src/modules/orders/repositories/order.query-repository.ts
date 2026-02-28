import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, Repository } from 'typeorm';
import { BaseQueryRepository } from '../../../common/base/repositories/base.query-repository';
import { OrderOrmEntity } from '../entities/order.orm-entity';
import { PaginationResponse } from '../../../common/base/interfaces/paginted.interface';
import { OrderListQueryDto } from '../dto/order-list-query.dto';



export interface OrderSummary {
  totalOrders: number;
  totalFinalCost: string;
  totalSellingAmount: string;
  totalProfit: string;
}

export interface OrderPaginatedResult {
  success: boolean;
  Code: number;
  message: string;
  results: OrderOrmEntity[];
  pagination: PaginationResponse;
  summary: OrderSummary;
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
    options: OrderListQueryDto,
    manager?: import('typeorm').EntityManager,
    _relations?: FindManyOptions<OrderOrmEntity>['relations'],
  ): Promise<OrderPaginatedResult> {
    const repo = this.getRepo(manager);
    const page = Math.max(1, options.page ?? 1);
    const limit = Math.min(100, Math.max(1, options.limit ?? 10));
    const skip = (page - 1) * limit;

    const buildFilters = (qb: ReturnType<typeof repo.createQueryBuilder>) => {
      if (options.merchantId != null) {
        qb.andWhere('merchant.id = :merchantId', { merchantId: options.merchantId });
      }
      if (options.customerId != null) {
        qb.andWhere('customer.id = :customerId', { customerId: options.customerId });
      }
      if (options.customerName) {
        qb.andWhere('customer.customerName LIKE :customerName', {
          customerName: `%${options.customerName}%`,
        });
      }
      if (options.search) {
        const field = options.searchField || 'orderCode';
        qb.andWhere(`order.${field} LIKE :search`, { search: `%${options.search}%` });
      }
      if (options.startDate) {
        qb.andWhere('DATE(order.orderDate) >= :startDate', { startDate: options.startDate });
      }
      if (options.endDate) {
        qb.andWhere('DATE(order.orderDate) <= :endDate', { endDate: options.endDate });
      }
      if (options.arrivalStatus) {
        qb.andWhere('order.arrivalStatus = :arrivalStatus', { arrivalStatus: options.arrivalStatus });
      }
      if (options.paymentStatus) {
        qb.andWhere('order.paymentStatus = :paymentStatus', { paymentStatus: options.paymentStatus });
      }
    };

    const qb = repo
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.merchant', 'merchant')
      .leftJoinAndSelect('order.createdByUser', 'createdByUser')
      .leftJoinAndSelect('order.orderItems', 'orderItems')
      .leftJoinAndSelect('order.customerOrders', 'customerOrders')
      .leftJoinAndSelect('customerOrders.customerOrderItems', 'customerOrderItems')
      .leftJoinAndSelect('customerOrders.customer', 'customer')
      .leftJoinAndSelect('order.exchangeRateBuy', 'exchangeRateBuy')
      .leftJoinAndSelect('order.exchangeRateSell', 'exchangeRateSell')
      .leftJoinAndSelect('orderItems.exchangeRateBuy', 'orderItems.exchangeRateBuy')
      .leftJoinAndSelect('orderItems.exchangeRateSell', 'orderItems.exchangeRateSell');

    buildFilters(qb);
    qb.orderBy('order.createdAt', 'DESC').skip(skip).take(limit);

    const [data, total] = await qb.getManyAndCount();

    const aggQb = repo
      .createQueryBuilder('order')
      .leftJoin('order.merchant', 'merchant')
      .leftJoin('order.customerOrders', 'customerOrders')
      .leftJoin('customerOrders.customer', 'customer')
      .select('COUNT(DISTINCT order.id)', 'totalOrders')
      .addSelect('COALESCE(SUM(order.totalFinalCost), 0)', 'totalFinalCost')
      .addSelect('COALESCE(SUM(order.totalSellingAmount), 0)', 'totalSellingAmount')
      .addSelect('COALESCE(SUM(order.totalProfit), 0)', 'totalProfit');

    buildFilters(aggQb);
    const aggRaw = await aggQb.getRawOne<Record<string, string>>();

    const summary: OrderSummary = {
      totalOrders: Number(aggRaw?.totalOrders ?? total),
      totalFinalCost: aggRaw?.totalFinalCost ?? '0',
      totalSellingAmount: aggRaw?.totalSellingAmount ?? '0',
      totalProfit: aggRaw?.totalProfit ?? '0',
    };

    const totalPages = Math.ceil(total / limit);
    const pagination: PaginationResponse = {
      total,
      page,
      limit,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    };
    return {
      success: true,
      Code: 200,
      message: 'Orders fetched successfully',
      results: data,
      pagination,
      summary,
    };
  }
}
