import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, ILike, Repository } from 'typeorm';
import { BaseQueryRepository, PaginatedResult } from '../../../common/base/base.query-repository';
import { UserOrmEntity } from '../entities/user.orm-entity';

export interface UserListOptions {
  page?: number;
  limit?: number;
  isActive?: boolean;
  search?: string;
}

@Injectable()
export class UserQueryRepository extends BaseQueryRepository<UserOrmEntity> {
  constructor(
    @InjectRepository(UserOrmEntity)
    repository: Repository<UserOrmEntity>,
  ) {
    super(repository);
  }

  async findWithPagination(
    options: UserListOptions,
    manager?: import('typeorm').EntityManager,
  ): Promise<PaginatedResult<UserOrmEntity>> {
    const where: FindOptionsWhere<UserOrmEntity> = {};
    if (options.isActive !== undefined) {
      where.isActive = options.isActive;
    }
    if (options.search) {
      where.email = ILike(`%${options.search}%`);
    }
    return super.findWithPagination(
      {
        page: options.page,
        limit: options.limit,
        where: Object.keys(where).length ? where : undefined,
        order: { createdAt: 'DESC' as const },
      },
      manager,
    );
  }
}
