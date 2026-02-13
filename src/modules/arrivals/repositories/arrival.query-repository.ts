import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { BaseQueryRepository } from '../../../common/base/repositories/base.query-repository';
import { ArrivalOrmEntity } from '../entities/arrival.orm-entity';
import { PaginatedResult, PaginationResponse } from '../../../common/base/interfaces/paginted.interface';

@Injectable()
export class ArrivalQueryRepository extends BaseQueryRepository<ArrivalOrmEntity> {
  constructor(
    @InjectRepository(ArrivalOrmEntity)
    repository: Repository<ArrivalOrmEntity>,
  ) {
    super(repository);
  }

  async findWithPagination(
    options: { page?: number; limit?: number; merchantId?: number; orderId?: number },
    manager?: import('typeorm').EntityManager,
  ): Promise<PaginatedResult<ArrivalOrmEntity>> {
    const repo = this.getRepo(manager);
    const page = Math.max(1, options.page ?? 1);
    const limit = Math.min(100, Math.max(1, options.limit ?? 10));
    const skip = (page - 1) * limit;
    const where: FindOptionsWhere<ArrivalOrmEntity> = {};
    if (options.merchantId != null) where.merchant = { id: options.merchantId };
    if (options.orderId != null) where.order = { id: options.orderId };
    const [data, total] = await repo.findAndCount({
      where: Object.keys(where).length ? where : undefined,
      relations: ['order', 'merchant', 'recordedByUser'],
      order: { createdAt: 'DESC' as const },
      skip,
      take: limit,
    });
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
