import { EntityManager, Repository } from 'typeorm';
import { RolePermissionOrmEntity } from '../entities/role-permission.orm-entity';
export declare class RolePermissionRepository {
    private readonly repository;
    constructor(repository: Repository<RolePermissionOrmEntity>);
    add(roleId: number, permissionId: number, manager?: EntityManager): Promise<RolePermissionOrmEntity>;
    remove(roleId: number, permissionId: number, manager?: EntityManager): Promise<boolean>;
    exists(roleId: number, permissionId: number, manager?: EntityManager): Promise<boolean>;
}
