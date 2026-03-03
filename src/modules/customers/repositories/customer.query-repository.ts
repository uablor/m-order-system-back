import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseQueryRepository } from '../../../common/base/repositories/base.query-repository';
import { CustomerOrmEntity } from '../entities/customer.orm-entity';
import { PaginatedResult, PaginationResponse } from '../../../common/base/interfaces/paginted.interface';
import { CurrentUserPayload } from 'src/common/decorators/current-user.decorator';

@Injectable()
export class CustomerQueryRepository extends BaseQueryRepository<CustomerOrmEntity> {
  constructor(
    @InjectRepository(CustomerOrmEntity)
    repository: Repository<CustomerOrmEntity>,
  ) {
    super(repository);
  }

  async findOneByIdWithMerchant(
    id: number,
    currentUser: CurrentUserPayload,
    manager?: import('typeorm').EntityManager,
  ): Promise<CustomerOrmEntity | null> {
    const repo = this.getRepo(manager);
    const qb = repo.createQueryBuilder('customer')
      .leftJoinAndSelect('customer.merchant', 'merchant');

    if (currentUser.merchantId) {
      qb.andWhere('merchant.id = :merchantId', { merchantId: currentUser.merchantId });
    }

    return qb.andWhere('customer.id = :id', { id }).getOne();
  }

  async findWithPagination(
    options: {
      page?: number;
      limit?: number;
      merchantId?: number;
      search?: string;
      customerType?: 'CUSTOMER' | 'AGENT';
      isActive?: boolean;
    },
    manager?: import('typeorm').EntityManager,
  ): Promise<PaginatedResult<CustomerOrmEntity>> {
    const repo = this.getRepo(manager);
    const page = Math.max(1, options.page ?? 1);
    const limit = Math.min(100, Math.max(1, options.limit ?? 10));
    const skip = (page - 1) * limit;
    const search = options.search?.trim();

    const qb = repo.createQueryBuilder('customer')
      .leftJoinAndSelect('customer.merchant', 'merchant')
      .orderBy('customer.createdAt', 'DESC')
      .skip(skip)
      .take(limit);

    if (options.merchantId != null) {
      qb.andWhere('merchant.id = :merchantId', { merchantId: options.merchantId });
    }
    if (search) {
      qb.andWhere(
        '(customer.customerName LIKE :s OR customer.contactPhone LIKE :s OR customer.uniqueToken LIKE :s)',
        { s: `%${search}%` },
      );
    }
    if (options.customerType != null) {
      qb.andWhere('customer.customerType = :customerType', { customerType: options.customerType });
    }
    if (options.isActive != null) {
      qb.andWhere('customer.isActive = :isActive', { isActive: options.isActive });
    }

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
    return { success: true, Code: 200, message: 'Customers fetched successfully', results: data, pagination };
  }

  async getSummary(
    options: { merchantId?: number; search?: string },
    manager?: import('typeorm').EntityManager,
  ): Promise<{
    totalCustomers: number;
    totalActive: number;
    totalInactive: number;
  }> {
    const repo = this.getRepo(manager);
    const qb = repo.createQueryBuilder('customer')
      .leftJoin('customer.merchant', 'merchant')
      .select('COUNT(customer.id)', 'totalCustomers')
      .addSelect(`SUM(CASE WHEN customer.isActive = true THEN 1 ELSE 0 END)`, 'totalActive')
      .addSelect(`SUM(CASE WHEN customer.isActive = false THEN 1 ELSE 0 END)`, 'totalInactive');

    if (options.merchantId != null) {
      qb.andWhere('merchant.id = :merchantId', { merchantId: options.merchantId });
    }
    if (options.search?.trim()) {
      const s = `%${options.search.trim()}%`;
      qb.andWhere('(customer.customerName LIKE :s OR customer.contactPhone LIKE :s)', { s });
    }

    const raw = await qb.getRawOne();
    return {
      totalCustomers: Number(raw?.totalCustomers ?? 0),
      totalActive: Number(raw?.totalActive ?? 0),
      totalInactive: Number(raw?.totalInactive ?? 0),
    };
  }
}
