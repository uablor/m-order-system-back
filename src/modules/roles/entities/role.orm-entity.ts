import { Column, CreateDateColumn, Entity, OneToMany, PrimaryColumn, UpdateDateColumn } from 'typeorm';
import { RolePermissionOrmEntity } from '../../role-permissions/entities/role-permission.orm-entity';
import { BaseOrmEntity } from '../../../common/base/base.orm-entities';

@Entity('roles')
export class RoleOrmEntity extends BaseOrmEntity {
  @Column({ name: 'role_name', unique: true })
  roleName: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  description: string | null;

  @OneToMany(() => RolePermissionOrmEntity, (rp) => rp.role)
  rolePermissions: RolePermissionOrmEntity[];
}
