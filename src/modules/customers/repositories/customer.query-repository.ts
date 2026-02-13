import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { BaseQueryRepository } from '../../../common/base/repositories/base.query-repository';
import { CustomerOrmEntity } from '../entities/customer.orm-entity';
import { PaginatedResult, PaginationResponse } from '../../../common/base/interfaces/paginted.interface';

@Injectable()
export class CustomerQueryRepository extends BaseQueryRepository<CustomerOrmEntity> {
  constructor(
    @InjectRepository(CustomerOrmEntity)
    repository: Repository<CustomerOrmEntity>,
  ) {
    super(repository);
  }

  async findOneByIdWithMerchant(id: number): Promise<CustomerOrmEntity | null> {
    return this.repository.findOne({
      where: { id },
      relations: ['merchant'],
    });
  }

  async findWithPagination(
    options: { page?: number; limit?: number; merchantId?: number },
    manager?: import('typeorm').EntityManager,
  ): Promise<PaginatedResult<CustomerOrmEntity>> {
    const repo = this.getRepo(manager);
    const page = Math.max(1, options.page ?? 1);
    const limit = Math.min(100, Math.max(1, options.limit ?? 10));
    const skip = (page - 1) * limit;
    const where: FindOptionsWhere<CustomerOrmEntity> = {};
    if (options.merchantId != null) {
      where.merchant = { id: options.merchantId };
    }
    const [data, total] = await repo.findAndCount({
      where: Object.keys(where).length ? where : undefined,
      relations: ['merchant'],
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
    return { success: true, Code: 200, message: 'Customers fetched successfully', results: data, pagination };
  }
}
