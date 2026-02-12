import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseQueryRepository, PaginatedResult } from '../../../common/base/base.query-repository';
import { PermissionOrmEntity } from '../entities/permission.orm-entity';

@Injectable()
export class PermissionQueryRepository extends BaseQueryRepository<PermissionOrmEntity> {
  constructor(
    @InjectRepository(PermissionOrmEntity)
    repository: Repository<PermissionOrmEntity>,
  ) {
    super(repository);
  }

  async findWithPagination(
    options: { page?: number; limit?: number },
    manager?: import('typeorm').EntityManager,
  ): Promise<PaginatedResult<PermissionOrmEntity>> {
    return super.findWithPagination(
      {
        page: options.page,
        limit: options.limit,
        order: { permissionCode: 'ASC' as const },
      },
      manager,
    );
  }
}
