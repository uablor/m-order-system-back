import { RoleRepository } from '../../modules/roles/repositories/role.repository';
import { RoleOrmEntity } from '../../modules/roles/entities/role.orm-entity';
import { EntityManager } from 'typeorm';
export declare const SUPERADMIN_ROLE_NAME = "superadmin";
export declare const ADMIN_ROLE_NAME = "admin";
export declare const ADMIN_MERCHANT_ROLE_NAME = "admin_merchant";
export declare const EMPLOYEE_MERCHANT_ROLE_NAME = "employee_merchant";
export interface SeededRoles {
    superadmin: RoleOrmEntity;
    admin: RoleOrmEntity;
    admin_merchant: RoleOrmEntity;
    employee_merchant: RoleOrmEntity;
}
export declare function runRoleSeeder(roleRepository: RoleRepository, manager?: EntityManager): Promise<SeededRoles>;
