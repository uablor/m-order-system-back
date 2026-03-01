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

    if (options.startDate) {
      qb.andWhere('DATE(arrival.arrivedDate) >= :startDate', { startDate: options.startDate });
    }

    if (options.endDate) {
      qb.andWhere('DATE(arrival.arrivedDate) <= :endDate', { endDate: options.endDate });
    }

    if (options.search) {
      qb.andWhere('order.orderCode LIKE :search', { search: `%${options.search}%` });
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

    return fetchWithPagination({
      qb,
      page: options.page ?? 1,
      search: options.search ? { kw: options.search, field: options.searchField || 'order.orderCode' } : undefined,
      limit: options.limit ?? 10,
      manager: manager || repo.manager,
      sort: options.sort || SortDirection.DESC,
    });
  }
}
