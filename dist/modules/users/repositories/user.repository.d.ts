import { Repository } from 'typeorm';
import { BaseRepository } from '../../../common/base/repositories/base.repository';
import { UserOrmEntity } from '../entities/user.orm-entity';
export declare class UserRepository extends BaseRepository<UserOrmEntity> {
    constructor(repository: Repository<UserOrmEntity>);
}
