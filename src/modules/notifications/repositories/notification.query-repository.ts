import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseQueryRepository } from '../../../common/base/repositories/base.query-repository';
import { NotificationOrmEntity } from '../entities/notification.orm-entity';
import { fetchWithPagination } from '../../../common/utils/pagination.util';
import { SortDirection } from '../../../common/base/enums/base.query.enum';

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
  ) {
    const repo = this.getRepo(manager);
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

    return fetchWithPagination({
      qb,
      page: options.page ?? 1,
      limit: options.limit ?? 10,
      search: options.search ? { kw: options.search, field: 'recipientContact' } : undefined,
      sort: 'DESC' as SortDirection,
      manager: manager || repo.manager,
    });
  }
}
