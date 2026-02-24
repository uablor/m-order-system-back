import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseQueryRepository } from '../../../common/base/repositories/base.query-repository';
import { NotificationOrmEntity } from '../entities/notification.orm-entity';
import { PaginatedResult, PaginationResponse } from '../../../common/base/interfaces/paginted.interface';

@Injectable()
export class NotificationQueryRepository extends BaseQueryRepository<NotificationOrmEntity> {
  constructor(
    @InjectRepository(NotificationOrmEntity)
    repository: Repository<NotificationOrmEntity>,
  ) {
    super(repository);
  }

  async findWithPagination(
    options: {
      page?: number;
      limit?: number;
      merchantId?: number;
      customerId?: number;
      notificationType?: string;
      status?: string;
      search?: string;
      startDate?: string;
      endDate?: string;
    },
    manager?: import('typeorm').EntityManager,
  ): Promise<PaginatedResult<NotificationOrmEntity>> {
    const repo = this.getRepo(manager);
    const page = Math.max(1, options.page ?? 1);
    const limit = Math.min(100, Math.max(1, options.limit ?? 10));
    const skip = (page - 1) * limit;

    const qb = repo
      .createQueryBuilder('notification')
      .leftJoinAndSelect('notification.merchant', 'merchant')
      .leftJoinAndSelect('notification.customer', 'customer');

    if (options.merchantId != null) {
      qb.andWhere('merchant.id = :merchantId', { merchantId: options.merchantId });
    }
    if (options.customerId != null) {
      qb.andWhere('customer.id = :customerId', { customerId: options.customerId });
    }
    if (options.notificationType) {
      qb.andWhere('notification.notificationType = :notificationType', {
        notificationType: options.notificationType,
      });
    }
    if (options.status) {
      qb.andWhere('notification.status = :status', { status: options.status });
    }
    if (options.search) {
      qb.andWhere(
        '(notification.recipientContact LIKE :search OR notification.messageContent LIKE :search)',
        { search: `%${options.search}%` },
      );
    }
    if (options.startDate) {
      qb.andWhere('DATE(notification.sentAt) >= :startDate', { startDate: options.startDate });
    }
    if (options.endDate) {
      qb.andWhere('DATE(notification.sentAt) <= :endDate', { endDate: options.endDate });
    }

    qb.orderBy('notification.createdAt', 'DESC').skip(skip).take(limit);

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
      message: 'Notifications fetched successfully',
      results: data,
      pagination,
    };
  }
}
