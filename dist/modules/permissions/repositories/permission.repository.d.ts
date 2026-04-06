import { Repository } from 'typeorm';
import { BaseRepository } from '../../../common/base/repositories/base.repository';
import { PermissionOrmEntity } from '../entities/permission.orm-entity';
export declare class PermissionRepository extends BaseRepository<PermissionOrmEntity> {
    constructor(repository: Repository<PermissionOrmEntity>);
}
