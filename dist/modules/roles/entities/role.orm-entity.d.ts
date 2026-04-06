import { RolePermissionOrmEntity } from '../../role-permissions/entities/role-permission.orm-entity';
import { BaseOrmEntity } from '../../../common/base/enities/base.orm-entities';
export declare class RoleOrmEntity extends BaseOrmEntity {
    roleName: string;
    description: string | null;
    rolePermissions: RolePermissionOrmEntity[];
}
