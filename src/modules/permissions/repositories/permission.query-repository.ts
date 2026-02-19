import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseQueryRepository } from '../../../common/base/repositories/base.query-repository';
import { PermissionOrmEntity } from '../entities/permission.orm-entity';
import { PaginatedResult } from '../../../common/base/interfaces/paginted.interface';

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
    manager: import('typeorm').EntityManager,
  ): Promise<PaginatedResult<PermissionOrmEntity>> {
    return super.findWithPagination(
      {
        page: options.page,
        limit: options.limit,
      },
      manager,
    );
  }
}
