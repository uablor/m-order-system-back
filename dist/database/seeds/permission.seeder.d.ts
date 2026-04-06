import { PermissionRepository } from 'src/modules/permissions/repositories/permission.repository';
import { EntityManager } from 'typeorm';
export declare const SUPERADMIN_PERMISSIONS: string[];
export declare const ADMIN_PERMISSIONS: string[];
export declare function runPermissionSeeder(permissionRepo: PermissionRepository, manager?: EntityManager): Promise<void>;
