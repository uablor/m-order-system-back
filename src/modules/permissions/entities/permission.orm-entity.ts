import { Column, CreateDateColumn, Entity, PrimaryColumn, UpdateDateColumn } from 'typeorm';
import { BaseOrmEntity } from '../../../common/base/base.orm-entities';

@Entity('permissions')
export class PermissionOrmEntity extends BaseOrmEntity {
  @Column({ name: 'permission_code', unique: true })
  permissionCode: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  description: string | null;
}
