import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseQueryRepository } from '../../../common/base/repositories/base.query-repository';
import { ArrivalOrmEntity } from '../entities/arrival.orm-entity';
import { PaginatedResult, PaginationResponse } from '../../../common/base/interfaces/paginted.interface';

export interface ArrivalFindOptions {
  page?: number;
  limit?: number;
  merchantId?: number;
  orderId?: number;
  startDate?: string;
  endDate?: string;
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
      .leftJoinAndSelect('arrival.recordedByUser', 'recordedByUser');

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
