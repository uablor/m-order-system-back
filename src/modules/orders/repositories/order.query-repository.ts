import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, Repository } from 'typeorm';
import { BaseQueryRepository } from '../../../common/base/repositories/base.query-repository';
import { OrderOrmEntity } from '../entities/order.orm-entity';
import { PaginationResponse } from '../../../common/base/interfaces/paginted.interface';
import { OrderListQueryDto } from '../dto/order-list-query.dto';



export interface OrderSummary {
  totalOrders: number;
  arrivedOrders: number;
  notArrivedOrders: number;
  paidOrders: number;
  unpaidOrders: number;
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
    const sortDir = options.sort === 'ASC' ? 'ASC' : 'DESC';
    qb.orderBy('order.createdAt', sortDir).skip(skip).take(limit);

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
    return {
      success: true,
      Code: 200,
      message: 'Orders fetched successfully',
      results: data,
      pagination,
    };
  }

  async getSummary(
    options: OrderListQueryDto,
    manager?: import('typeorm').EntityManager,
  ): Promise<OrderSummary> {
    const repo = this.getRepo(manager);

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

    const aggQb = repo
      .createQueryBuilder('order')
      .leftJoin('order.merchant', 'merchant')
      .leftJoin('order.customerOrders', 'customerOrders')
      .leftJoin('customerOrders.customer', 'customer')
      .select('COUNT(DISTINCT order.id)', 'totalOrders')
      .addSelect("COALESCE(SUM(CASE WHEN order.arrivalStatus = 'ARRIVED' THEN 1 ELSE 0 END), 0)", 'arrivedOrders')
      .addSelect("COALESCE(SUM(CASE WHEN order.arrivalStatus = 'NOT_ARRIVED' THEN 1 ELSE 0 END), 0)", 'notArrivedOrders')
      .addSelect("COALESCE(SUM(CASE WHEN order.paymentStatus = 'PAID' THEN 1 ELSE 0 END), 0)", 'paidOrders')
      .addSelect("COALESCE(SUM(CASE WHEN order.paymentStatus = 'UNPAID' THEN 1 ELSE 0 END), 0)", 'unpaidOrders')
      .addSelect('COALESCE(SUM(order.totalFinalCost), 0)', 'totalFinalCostLak')
      .addSelect('COALESCE(SUM(order.totalSellingAmount), 0)', 'totalSellingAmountLak')
      .addSelect('COALESCE(SUM(order.totalProfit), 0)', 'totalProfitLak')
      .addSelect('COALESCE(SUM(customerOrders.totalPaid), 0)', 'totalPaidAmount')
      .addSelect('COALESCE(SUM(customerOrders.remainingAmount), 0)', 'totalRemainingAmount');

    buildFilters(aggQb);
    const aggRaw = await aggQb.getRawOne<Record<string, string>>();

    return {
      totalOrders: Number(aggRaw?.totalOrders ?? 0),
      arrivedOrders: Number(aggRaw?.arrivedOrders ?? 0),
      notArrivedOrders: Number(aggRaw?.notArrivedOrders ?? 0),
      paidOrders: Number(aggRaw?.paidOrders ?? 0),
      unpaidOrders: Number(aggRaw?.unpaidOrders ?? 0),
      totalFinalCost: aggRaw?.totalFinalCost ?? '0',
      totalSellingAmount: aggRaw?.totalSellingAmount ?? '0',
      totalProfit: aggRaw?.totalProfitLak ?? '0',
    };
  }
}
