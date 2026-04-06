import { ArrivalItemQueryRepository } from '../repositories/arrival-item.query-repository';
import { ArrivalItemRepository } from '../repositories/arrival-item.repository';
import { ArrivalItemListQueryDto } from '../dto/arrival-item-list-query.dto';
import { ArrivalItemResponseDto } from '../dto/arrival-item-response.dto';
import type { ResponseInterface, ResponseWithPaginationInterface } from '../../../common/base/interfaces/response.interface';
export declare class ArrivalItemQueryService {
    private readonly arrivalItemRepository;
    private readonly arrivalItemQueryRepository;
    constructor(arrivalItemRepository: ArrivalItemRepository, arrivalItemQueryRepository: ArrivalItemQueryRepository);
    getById(id: number): Promise<ArrivalItemResponseDto | null>;
    getByIdOrFail(id: number): Promise<ResponseInterface<ArrivalItemResponseDto>>;
    getList(query: ArrivalItemListQueryDto): Promise<ResponseWithPaginationInterface<ArrivalItemResponseDto>>;
    private toResponse;
}
