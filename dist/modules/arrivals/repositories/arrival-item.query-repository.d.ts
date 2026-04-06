import { Repository } from 'typeorm';
import { BaseQueryRepository } from '../../../common/base/repositories/base.query-repository';
import { ArrivalItemOrmEntity } from '../entities/arrival-item.orm-entity';
import { PaginatedResult } from '../../../common/base/interfaces/paginted.interface';
import { ArrivalItemListQueryDto } from '../dto/arrival-item-list-query.dto';
export declare class ArrivalItemQueryRepository extends BaseQueryRepository<ArrivalItemOrmEntity> {
    constructor(repository: Repository<ArrivalItemOrmEntity>);
    findWithPagination(options: ArrivalItemListQueryDto, manager?: import('typeorm').EntityManager): Promise<PaginatedResult<ArrivalItemOrmEntity>>;
}
