import { Entity, ManyToOne, JoinColumn, Column } from 'typeorm';
import { PermissionOrmEntity } from '../../permissions/entities/permission.orm-entity';
import { RoleOrmEntity } from '../../roles/entities/role.orm-entity';
import { BaseOrmEntity } from 'src/common/base/base.orm-entities';

@Entity('role_permissions')
export class RolePermissionOrmEntity extends BaseOrmEntity {
  @Column({ name: 'role_id', type: 'number' })
  roleId: number;

  @Column({ name: 'permission_id', type: 'number' })
  permissionId: number;

  @ManyToOne(() => RoleOrmEntity, (role) => role.rolePermissions, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'role_id' })
  role: RoleOrmEntity;

  @ManyToOne(() => PermissionOrmEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'permission_id' })
  permission: PermissionOrmEntity;
}
