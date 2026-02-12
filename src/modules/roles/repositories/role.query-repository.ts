import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseQueryRepository, PaginatedResult } from '../../../common/base/base.query-repository';
import { RoleOrmEntity } from '../entities/role.orm-entity';

@Injectable()
export class RoleQueryRepository extends BaseQueryRepository<RoleOrmEntity> {
  constructor(
    @InjectRepository(RoleOrmEntity)
    repository: Repository<RoleOrmEntity>,
  ) {
    super(repository);
  }

  async findWithPagination(
    options: { page?: number; limit?: number },
    manager?: import('typeorm').EntityManager,
  ): Promise<PaginatedResult<RoleOrmEntity>> {
    return super.findWithPagination(
      {
        page: options.page,
        limit: options.limit,
        order: { roleName: 'ASC' as const },
      },
      manager,
    );
  }
}
