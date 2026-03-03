import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseQueryRepository } from '../../../common/base/repositories/base.query-repository';
import { ArrivalOrmEntity } from '../entities/arrival.orm-entity';
import { fetchWithPagination } from '../../../common/utils/pagination.util';
import { PaginatedResult, PaginationResponse } from '../../../common/base/interfaces/paginted.interface';
import { SortDirection } from '../../../common/base/enums/base.query.enum';
import { ArrivalListQueryDto } from '../dto/arrival-list-query.dto';

@Injectable()
export class ArrivalQueryRepository extends BaseQueryRepository<ArrivalOrmEntity> {
  constructor(
    @InjectRepository(ArrivalOrmEntity)
    repository: Repository<ArrivalOrmEntity>,
  ) {
    super(repository);
  }
  async findWithPagination(
    options: ArrivalListQueryDto,
    manager?: import('typeorm').EntityManager,
  ): Promise<PaginatedResult<ArrivalOrmEntity>> {
    const repo = this.getRepo(manager);
    const qb = repo
      .createQueryBuilder('arrival')
      .leftJoinAndSelect('arrival.order', 'order')
      .leftJoinAndSelect('arrival.merchant', 'merchant')
      .leftJoinAndSelect('arrival.recordedByUser', 'recordedByUser')
      .leftJoinAndSelect('arrival.arrivalItems', 'arrivalItems')
      .leftJoinAndSelect('arrivalItems.orderItem', 'orderItem');

    if (options.merchantId != null) {
      qb.andWhere('merchant.id = :merchantId', { merchantId: options.merchantId });
    }

    if (options.orderId != null) {
      qb.andWhere('order.id = :orderId', { orderId: options.orderId });
    }

    if (options.orderItemId != null) {
      qb.andWhere(
        'EXISTS (SELECT 1 FROM arrival_items ai WHERE ai.arrival_id = arrival.id AND ai.order_item_id = :orderItemId)',
        { orderItemId: options.orderItemId },
      );
    }

    if (options.startDate) {
      qb.andWhere('DATE(arrival.arrivedDate) >= :startDate', { startDate: options.startDate });
    }

    if (options.endDate) {
      qb.andWhere('DATE(arrival.arrivedDate) <= :endDate', { endDate: options.endDate });
    }

    if (options.search) {
      const searchVal = `%${options.search}%`;
      if (options.searchField === 'notes') {
        qb.andWhere('arrival.notes LIKE :search', { search: searchVal });
      } else {
        qb.andWhere('order.orderCode LIKE :search', { search: searchVal });
      }
    }

    // Enable createdByUserId filter since recordedByUser relation exists
    if (options.createdByUserId != null) {
      qb.andWhere('recordedByUser.id = :createdByUserId', { createdByUserId: options.createdByUserId });
    }

    // Add arrival date filter
    if (options.arrivalDate) {
      qb.andWhere('DATE(arrival.arrivedDate) = :arrivalDate', { arrivalDate: options.arrivalDate });
    }

    // Add arrival time filter
    if (options.arrivalTime) {
      qb.andWhere('arrival.arrivedTime = :arrivalTime', { arrivalTime: options.arrivalTime });
    }

    // Add arrival boolean filter (filter for arrivals that exist)
    if (options.arrival !== undefined) {
      if (options.arrival) {
        // Filter for records that have arrival data
        qb.andWhere('arrival.arrivedDate IS NOT NULL AND arrival.arrivedTime IS NOT NULL');
      } else {
        // Filter for records that don't have arrival data
        qb.andWhere('arrival.arrivedDate IS NULL OR arrival.arrivedTime IS NULL');
      }
    }

    if (options.customerName) {
      qb.andWhere(
        `EXISTS (
          SELECT 1 FROM customer_orders co
          INNER JOIN customers c ON c.id = co.customer_id
          WHERE co.order_id = order.id AND c.customer_name LIKE :customerName
        )`,
        { customerName: `%${options.customerName}%` },
      );
    }

    // ไม่ส่ง search ไป fetchWithPagination เพราะ search ใช้ relation (order.orderCode)
    // และ pagination util จะ prefix ด้วย alias ทำให้ผิดพลาด — เรา handle search เองด้านบนแล้ว
    return fetchWithPagination({
      qb,
      page: options.page ?? 1,
      search: undefined,
      limit: options.limit ?? 10,
      manager: manager || repo.manager,
      sort: options.sort || SortDirection.DESC,
    });
  }

  async getSummary(
    options: ArrivalListQueryDto,
    manager?: import('typeorm').EntityManager,
  ): Promise<{ totalArrivals: number }> {
    const repo = this.getRepo(manager);
    const qb = repo
      .createQueryBuilder('arrival')
      .leftJoin('arrival.order', 'order')
      .leftJoin('arrival.merchant', 'merchant')
      .leftJoin('arrival.recordedByUser', 'recordedByUser')
      .select('COUNT(DISTINCT arrival.id)', 'totalArrivals');

    if (options.merchantId != null) {
      qb.andWhere('merchant.id = :merchantId', { merchantId: options.merchantId });
    }
    if (options.orderId != null) {
      qb.andWhere('order.id = :orderId', { orderId: options.orderId });
    }
    if (options.orderItemId != null) {
      qb.andWhere(
        'EXISTS (SELECT 1 FROM arrival_items ai WHERE ai.arrival_id = arrival.id AND ai.order_item_id = :orderItemId)',
        { orderItemId: options.orderItemId },
      );
    }
    if (options.startDate) {
      qb.andWhere('DATE(arrival.arrivedDate) >= :startDate', { startDate: options.startDate });
    }
    if (options.endDate) {
      qb.andWhere('DATE(arrival.arrivedDate) <= :endDate', { endDate: options.endDate });
    }
    if (options.search) {
      const searchVal = `%${options.search}%`;
      if (options.searchField === 'notes') {
        qb.andWhere('arrival.notes LIKE :search', { search: searchVal });
      } else {
        qb.andWhere('order.orderCode LIKE :search', { search: searchVal });
      }
    }
    if (options.createdByUserId != null) {
      qb.andWhere('recordedByUser.id = :createdByUserId', { createdByUserId: options.createdByUserId });
    }
    if (options.arrivalDate) {
      qb.andWhere('DATE(arrival.arrivedDate) = :arrivalDate', { arrivalDate: options.arrivalDate });
    }
    if (options.arrivalTime) {
      qb.andWhere('arrival.arrivedTime = :arrivalTime', { arrivalTime: options.arrivalTime });
    }
    if (options.arrival !== undefined) {
      if (options.arrival) {
        qb.andWhere('arrival.arrivedDate IS NOT NULL AND arrival.arrivedTime IS NOT NULL');
      } else {
        qb.andWhere('arrival.arrivedDate IS NULL OR arrival.arrivedTime IS NULL');
      }
    }
    if (options.customerName) {
      qb.andWhere(
        `EXISTS (
          SELECT 1 FROM customer_orders co
          INNER JOIN customers c ON c.id = co.customer_id
          WHERE co.order_id = order.id AND c.customer_name LIKE :customerName
        )`,
        { customerName: `%${options.customerName}%` },
      );
    }

    const raw = await qb.getRawOne<Record<string, string>>();
    return { totalArrivals: Number(raw?.totalArrivals ?? 0) };
  }
}
