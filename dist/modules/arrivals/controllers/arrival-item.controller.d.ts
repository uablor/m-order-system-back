import { ArrivalItemCommandService } from '../services/arrival-item-command.service';
import { ArrivalItemQueryService } from '../services/arrival-item-query.service';
import { ArrivalItemUpdateDto } from '../dto/arrival-item-update.dto';
import { ArrivalItemListQueryDto } from '../dto/arrival-item-list-query.dto';
import { ArrivalItemResponseDto } from '../dto/arrival-item-response.dto';
export declare class ArrivalItemController {
    private readonly arrivalItemCommandService;
    private readonly arrivalItemQueryService;
    constructor(arrivalItemCommandService: ArrivalItemCommandService, arrivalItemQueryService: ArrivalItemQueryService);
    merchantGetList(query: ArrivalItemListQueryDto): Promise<import("../../../common/base/interfaces/response.interface").ResponseWithPaginationInterface<ArrivalItemResponseDto>>;
    getById(id: number): Promise<import("../../../common/base/interfaces/response.interface").ResponseInterface<ArrivalItemResponseDto>>;
    merchantUpdate(id: number, dto: ArrivalItemUpdateDto): Promise<void>;
    adminDelete(id: number): Promise<void>;
}
