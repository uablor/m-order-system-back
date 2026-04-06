import { Repository } from 'typeorm';
import { RolePermissionOrmEntity } from '../entities/role-permission.orm-entity';
import { PermissionOrmEntity } from '../../permissions/entities/permission.orm-entity';
export declare class RolePermissionQueryRepository {
    private readonly repository;
    constructor(repository: Repository<RolePermissionOrmEntity>);
    findPermissionsByRoleId(roleId: number): Promise<PermissionOrmEntity[]>;
}
