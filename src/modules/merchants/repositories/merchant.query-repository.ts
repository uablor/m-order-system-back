import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseQueryRepository } from '../../../common/base/repositories/base.query-repository';
import { MerchantOrmEntity } from '../entities/merchant.orm-entity';
import { PaginatedResult } from '../../../common/base/interfaces/paginted.interface';
import {
  MerchantListOptionsQueryDto,
  MerchantListQueryDto,
} from '../dto/merchant-list-query.dto';

@Injectable()
export class MerchantQueryRepository extends BaseQueryRepository<MerchantOrmEntity> {
  constructor(
    @InjectRepository(MerchantOrmEntity)
    repository: Repository<MerchantOrmEntity>,
  ) {
    super(repository);
  }

  async findWithPagination(
    options: MerchantListOptionsQueryDto,
    manager: import('typeorm').EntityManager,
  ): Promise<PaginatedResult<MerchantOrmEntity>> {
    return super.findWithPagination(
      {
        ...options,
      },
      manager,
    );
  }

  async findMerchantDetail(
    id: number,
    manager: import('typeorm').EntityManager,
  ): Promise<MerchantOrmEntity | null> {
    const repo = this.getRepo(manager);
    const qb = repo.createQueryBuilder('entity');
    qb.where('entity.id = :id', { id });
    qb.leftJoinAndSelect('entity.ownerUser', 'ownerUser');
    return qb.getOne();
  }
}
