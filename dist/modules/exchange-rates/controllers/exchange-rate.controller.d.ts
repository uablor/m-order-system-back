import { ExchangeRateCommandService } from '../services/exchange-rate-command.service';
import { ExchangeRateQueryService } from '../services/exchange-rate-query.service';
import { ExchangeRateCreateDto, ExchangeRateCreateManyDto } from '../dto/exchange-rate-create.dto';
import { ExchangeRateUpdateDto } from '../dto/exchange-rate-update.dto';
import { ExchangeRateListQueryDto } from '../dto/exchange-rate-list-query.dto';
import { ExchangeRateResponseDto } from '../dto/exchange-rate-response.dto';
import type { CurrentUserPayload } from '../../../common/decorators/current-user.decorator';
export declare class ExchangeRateController {
    private readonly commandService;
    private readonly queryService;
    constructor(commandService: ExchangeRateCommandService, queryService: ExchangeRateQueryService);
    merchantCreate(dto: ExchangeRateCreateDto, currentUser: CurrentUserPayload): Promise<{
        id: number;
    }>;
    merchantCreateMany(dto: ExchangeRateCreateManyDto, currentUser: CurrentUserPayload): Promise<{
        ids: number[];
    }>;
    adminGetList(query: ExchangeRateListQueryDto): Promise<import("../../../common/base/interfaces/response.interface").ResponseWithPaginationInterface<ExchangeRateResponseDto>>;
    merchantGetList(query: ExchangeRateListQueryDto, currentUser: CurrentUserPayload): Promise<import("../../../common/base/interfaces/response.interface").ResponseWithPaginationInterface<ExchangeRateResponseDto>>;
    merchantGetTodayRates(currentUser: CurrentUserPayload): Promise<import("../../../common/base/interfaces/response.interface").ResponseInterface<ExchangeRateResponseDto[]>>;
    getById(id: number): Promise<import("../../../common/base/interfaces/response.interface").ResponseInterface<ExchangeRateResponseDto>>;
    adminUpdate(id: number, dto: ExchangeRateUpdateDto): Promise<void>;
    merchantUpdate(id: number, dto: ExchangeRateUpdateDto, currentUser: CurrentUserPayload): Promise<void>;
    adminDelete(id: number): Promise<void>;
}
