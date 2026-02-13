import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { BaseQueryRepository } from '../../../common/base/repositories/base.query-repository';
import { ArrivalItemOrmEntity } from '../entities/arrival-item.orm-entity';
import { PaginatedResult, PaginationResponse } from '../../../common/base/interfaces/paginted.interface';

@Injectable()
export class ArrivalItemQueryRepository extends BaseQueryRepository<ArrivalItemOrmEntity> {
  constructor(
    @InjectRepository(ArrivalItemOrmEntity)
    repository: Repository<ArrivalItemOrmEntity>,
  ) {
    super(repository);
  }

  async findWithPagination(
    options: { page?: number; limit?: number; arrivalId?: number; orderItemId?: number },
    manager?: import('typeorm').EntityManager,
  ): Promise<PaginatedResult<ArrivalItemOrmEntity>> {
    const repo = this.getRepo(manager);
    const page = Math.max(1, options.page ?? 1);
    const limit = Math.min(100, Math.max(1, options.limit ?? 10));
    const skip = (page - 1) * limit;
    const where: FindOptionsWhere<ArrivalItemOrmEntity> = {};
    if (options.arrivalId != null) where.arrival = { id: options.arrivalId };
    if (options.orderItemId != null) where.orderItem = { id: options.orderItemId };
    const [data, total] = await repo.findAndCount({
      where: Object.keys(where).length ? where : undefined,
      relations: ['arrival', 'orderItem'],
      order: { id: 'ASC' as const },
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
    return { success: true, Code: 200, message: 'Arrival items fetched successfully', results: data, pagination };
  }
}
