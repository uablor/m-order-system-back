import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { RolePermissionOrmEntity } from '../entities/role-permission.orm-entity';

@Injectable()
export class RolePermissionRepository {
  constructor(
    @InjectRepository(RolePermissionOrmEntity)
    private readonly repository: Repository<RolePermissionOrmEntity>,
  ) {}

  async add(roleId: string, permissionId: string, manager?: EntityManager): Promise<RolePermissionOrmEntity> {
    const repo = manager ? manager.getRepository(RolePermissionOrmEntity) : this.repository;
    const entity = repo.create({ roleId, permissionId });
    return repo.save(entity);
  }

  async remove(roleId: string, permissionId: string, manager?: EntityManager): Promise<boolean> {
    const repo = manager ? manager.getRepository(RolePermissionOrmEntity) : this.repository;
    const result = await repo.delete({ roleId, permissionId });
    return (result.affected ?? 0) > 0;
  }

  async exists(roleId: string, permissionId: string, manager?: EntityManager): Promise<boolean> {
    const repo = manager ? manager.getRepository(RolePermissionOrmEntity) : this.repository;
    const count = await repo.count({ where: { roleId, permissionId } });
    return count > 0;
  }
}
