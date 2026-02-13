import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { BaseQueryRepository } from '../../../common/base/repositories/base.query-repository';
import { OrderItemOrmEntity } from '../entities/order-item.orm-entity';
import { PaginatedResult, PaginationResponse } from '../../../common/base/interfaces/paginted.interface';

@Injectable()
export class OrderItemQueryRepository extends BaseQueryRepository<OrderItemOrmEntity> {
  constructor(
    @InjectRepository(OrderItemOrmEntity)
    repository: Repository<OrderItemOrmEntity>,
  ) {
    super(repository);
  }

  async findWithPagination(
    options: { page?: number; limit?: number; orderId?: number },
    manager?: import('typeorm').EntityManager,
  ): Promise<PaginatedResult<OrderItemOrmEntity>> {
    const repo = this.getRepo(manager);
    const page = Math.max(1, options.page ?? 1);
    const limit = Math.min(100, Math.max(1, options.limit ?? 10));
    const skip = (page - 1) * limit;
    const where: FindOptionsWhere<OrderItemOrmEntity> = {};
    if (options.orderId != null) where.order = { id: options.orderId };
    const [data, total] = await repo.findAndCount({
      where: Object.keys(where).length ? where : undefined,
      relations: ['order'],
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
    return { success: true, Code: 200, message: 'Order items fetched successfully', results: data, pagination };
  }
}
