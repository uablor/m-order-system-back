import { Repository } from 'typeorm';
import { BaseRepository } from '../../../common/base/repositories/base.repository';
import { RoleOrmEntity } from '../entities/role.orm-entity';
export declare class RoleRepository extends BaseRepository<RoleOrmEntity> {
    constructor(repository: Repository<RoleOrmEntity>);
}
