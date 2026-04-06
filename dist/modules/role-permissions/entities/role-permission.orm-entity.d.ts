import { PermissionOrmEntity } from '../../permissions/entities/permission.orm-entity';
import { RoleOrmEntity } from '../../roles/entities/role.orm-entity';
import { BaseOrmEntity } from '../../../common/base/enities/base.orm-entities';
export declare class RolePermissionOrmEntity extends BaseOrmEntity {
    roleId: number;
    permissionId: number;
    role: RoleOrmEntity;
    permission: PermissionOrmEntity;
}
