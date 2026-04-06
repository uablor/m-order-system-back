import { RolePermissionRepository } from '../../modules/role-permissions/repositories/role-permission.repository';
import { PermissionQueryRepository } from '../../modules/permissions/repositories/permission.query-repository';
import { EntityManager } from 'typeorm';
export declare function assignAllPermissionsToRole(roleId: number, rolePermissionRepository: RolePermissionRepository, permissionQueryRepository: PermissionQueryRepository, manager: EntityManager): Promise<number>;
export declare function assignPermissionsToRoleByPrefixes(roleId: number, prefixes: string[], rolePermissionRepository: RolePermissionRepository, permissionQueryRepository: PermissionQueryRepository, manager: EntityManager): Promise<number>;
export declare function isMerchantAccessible(permissionCode: string): boolean;
export declare function assignMerchantPermissionsToRole(roleId: number, rolePermissionRepository: RolePermissionRepository, permissionQueryRepository: PermissionQueryRepository, manager: EntityManager): Promise<number>;
export declare function runRolePermissionSeeder(roleId: number, rolePermissionRepository: RolePermissionRepository, permissionQueryRepository: PermissionQueryRepository, manager: EntityManager): Promise<number>;
