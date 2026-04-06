import { Repository } from 'typeorm';
import { BaseQueryRepository } from '../../../common/base/repositories/base.query-repository';
import { ArrivalOrmEntity } from '../entities/arrival.orm-entity';
import { PaginatedResult } from '../../../common/base/interfaces/paginted.interface';
import { ArrivalListQueryDto } from '../dto/arrival-list-query.dto';
export declare class ArrivalQueryRepository extends BaseQueryRepository<ArrivalOrmEntity> {
    constructor(repository: Repository<ArrivalOrmEntity>);
    findWithPagination(options: ArrivalListQueryDto, manager?: import('typeorm').EntityManager): Promise<PaginatedResult<ArrivalOrmEntity>>;
    getSummary(options: ArrivalListQueryDto, manager?: import('typeorm').EntityManager): Promise<{
        totalArrivals: number;
    }>;
}
