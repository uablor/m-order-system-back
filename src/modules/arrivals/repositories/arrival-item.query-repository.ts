import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {  Repository } from 'typeorm';
import { BaseQueryRepository } from '../../../common/base/repositories/base.query-repository';
import { ArrivalItemOrmEntity } from '../entities/arrival-item.orm-entity';
import { fetchWithPagination } from '../../../common/utils/pagination.util';
import { PaginatedResult } from '../../../common/base/interfaces/paginted.interface';
import { ArrivalItemListQueryDto } from '../dto/arrival-item-list-query.dto';
import { SortDirection } from '../../../common/base/enums/base.query.enum';

@Injectable()
export class ArrivalItemQueryRepository extends BaseQueryRepository<ArrivalItemOrmEntity> {
  constructor(
    @InjectRepository(ArrivalItemOrmEntity)
    repository: Repository<ArrivalItemOrmEntity>,
  ) {
    super(repository);
  }

  async findWithPagination(
    options: ArrivalItemListQueryDto,
    manager?: import('typeorm').EntityManager,
  ): Promise<PaginatedResult<ArrivalItemOrmEntity>> {
    const repo = this.getRepo(manager);
    const qb = repo
      .createQueryBuilder('arrivalItem')
      .leftJoinAndSelect('arrivalItem.arrival', 'arrival')
      .leftJoinAndSelect('arrivalItem.orderItem', 'orderItem');

    if (options.arrivalId != null) {
      qb.andWhere('arrival.id = :arrivalId', { arrivalId: options.arrivalId });
    }

    if (options.orderItemId != null) {
      qb.andWhere('orderItem.id = :orderItemId', { orderItemId: options.orderItemId });
    }

    return fetchWithPagination({
      qb,
      page: options.page ?? 1,
      limit: options.limit ?? 10,
      search: { kw: options.search, field: options.searchField ?? 'id' },
      manager: manager || repo.manager,
      sort: options.sort ?? SortDirection.ASC,
    });
  }
}
