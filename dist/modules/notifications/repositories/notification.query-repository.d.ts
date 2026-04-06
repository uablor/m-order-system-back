import { Repository } from 'typeorm';
import { BaseQueryRepository } from '../../../common/base/repositories/base.query-repository';
import { NotificationOrmEntity } from '../entities/notification.orm-entity';
export declare class NotificationQueryRepository extends BaseQueryRepository<NotificationOrmEntity> {
    constructor(repository: Repository<NotificationOrmEntity>);
    findWithPagination(options: {
        page?: number;
        limit?: number;
        merchantId?: number;
        customerId?: number;
        notificationType?: string;
        status?: string;
        search?: string;
        startDate?: string;
        endDate?: string;
    }, manager?: import('typeorm').EntityManager): Promise<import("../../../common/base/interfaces/response.interface").ResponseWithPaginationInterface<NotificationOrmEntity>>;
    findCustomerOrderBy(id: number[], manager?: import('typeorm').EntityManager): Promise<NotificationOrmEntity[]>;
}
