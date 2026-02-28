import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseQueryRepository } from '../../../common/base/repositories/base.query-repository';
import { ArrivalOrmEntity } from '../entities/arrival.orm-entity';
import { PaginatedResult, PaginationResponse } from '../../../common/base/interfaces/paginted.interface';

export interface ArrivalFindOptions {
  page?: number;
  limit?: number;
  search?: string;
  merchantId?: number;
  orderId?: number;
  startDate?: string;
  endDate?: string;
  status?: string;
  createdByUserId?: number;
  statusSent?: string;
  arrivalDate?: string;
  arrivalTime?: string;
  arrival?: boolean;
}

@Injectable()
export class ArrivalQueryRepository extends BaseQueryRepository<ArrivalOrmEntity> {
  constructor(
    @InjectRepository(ArrivalOrmEntity)
    repository: Repository<ArrivalOrmEntity>,
  ) {
    super(repository);
  }

  async findWithPagination(
    options: ArrivalFindOptions,
    manager?: import('typeorm').EntityManager,
  ): Promise<PaginatedResult<ArrivalOrmEntity>> {
    const repo = this.getRepo(manager);
    const page = Math.max(1, options.page ?? 1);
    const limit = Math.min(100, Math.max(1, options.limit ?? 10));
    const skip = (page - 1) * limit;

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


    qb.orderBy('arrival.createdAt', 'DESC').skip(skip).take(limit);

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
    return { success: true, Code: 200, message: 'Arrivals fetched successfully', results: data, pagination };
  }
}
