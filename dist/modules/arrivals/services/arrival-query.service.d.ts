import { ArrivalQueryRepository } from '../repositories/arrival.query-repository';
import { ArrivalRepository } from '../repositories/arrival.repository';
import { ArrivalListQueryDto } from '../dto/arrival-list-query.dto';
import { ArrivalResponseDto } from '../dto/arrival-response.dto';
import type { ResponseInterface, ResponseWithPaginationInterface } from '../../../common/base/interfaces/response.interface';
import { ArrivalOrmEntity } from '../entities/arrival.orm-entity';
export declare class ArrivalQueryService {
    private readonly arrivalRepository;
    private readonly arrivalQueryRepository;
    constructor(arrivalRepository: ArrivalRepository, arrivalQueryRepository: ArrivalQueryRepository);
    getById(id: number): Promise<ArrivalResponseDto | null>;
    getByIdOrFail(id: number): Promise<ResponseInterface<ArrivalResponseDto>>;
    getByIdWithItems(id: number): Promise<ArrivalResponseDto | null>;
    getList(query: ArrivalListQueryDto): Promise<ResponseWithPaginationInterface<ArrivalOrmEntity>>;
    getListByMerchant(query: ArrivalListQueryDto, currentUser: import('../../../common/decorators/current-user.decorator').CurrentUserPayload): Promise<ResponseWithPaginationInterface<ArrivalResponseDto>>;
    getSummary(query: ArrivalListQueryDto): Promise<{
        totalArrivals: number;
    }>;
    getSummaryByMerchant(query: ArrivalListQueryDto, currentUser: import('../../../common/decorators/current-user.decorator').CurrentUserPayload): Promise<{
        totalArrivals: number;
    }>;
    private toResponse;
}
