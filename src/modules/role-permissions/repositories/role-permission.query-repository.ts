import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RolePermissionOrmEntity } from '../entities/role-permission.orm-entity';
import { PermissionOrmEntity } from '../../permissions/entities/permission.orm-entity';

@Injectable()
export class RolePermissionQueryRepository {
  constructor(
    @InjectRepository(RolePermissionOrmEntity)
    private readonly repository: Repository<RolePermissionOrmEntity>,
  ) {}

  async findPermissionsByRoleId(roleId: string): Promise<PermissionOrmEntity[]> {
    const rows = await this.repository.find({
      where: { roleId },
      relations: ['permission'],
    });
    return rows.map((rp) => rp.permission).filter(Boolean);
  }
}
