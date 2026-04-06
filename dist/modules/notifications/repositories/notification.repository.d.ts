import { Repository } from 'typeorm';
import { BaseRepository } from '../../../common/base/repositories/base.repository';
import { NotificationOrmEntity } from '../entities/notification.orm-entity';
export declare class NotificationRepository extends BaseRepository<NotificationOrmEntity> {
    constructor(repository: Repository<NotificationOrmEntity>);
}
