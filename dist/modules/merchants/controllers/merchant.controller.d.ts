import { MerchantCommandService } from '../services/merchant-command.service';
import { MerchantQueryService } from '../services/merchant-query.service';
import { MerchantCreateDto } from '../dto/merchant-create.dto';
import { MerchantUpdateDto } from '../dto/merchant-update.dto';
import { MerchantListQueryDto } from '../dto/merchant-list-query.dto';
import { MerchantResponseDto } from '../dto/merchant-response.dto';
import { MerchantDetailResponseDto } from '../dto/merchant-detail-response.dto';
import type { CurrentUserPayload } from '../../../common/decorators/current-user.decorator';
import { MerchantGetPriceCurrencySummaryDto } from 'src/modules/dashboard/dto/merchant-price-currency-summary.dto';
import { DashboardQueryService } from 'src/modules/dashboard/services/dashboard-query.service';
import { AcitveDto } from 'src/common/base/dtos/active.dto';
export declare class MerchantController {
    protected readonly commandService: MerchantCommandService;
    protected readonly queryService: MerchantQueryService;
    protected readonly dashboardQueryService: DashboardQueryService;
    constructor(commandService: MerchantCommandService, queryService: MerchantQueryService, dashboardQueryService: DashboardQueryService);
    adminCreate(dto: MerchantCreateDto, currentUser: CurrentUserPayload): Promise<{
        id: number;
    }>;
    adminGetList(query: MerchantListQueryDto): Promise<import("../../../common/base/interfaces/response.interface").ResponseWithPaginationInterface<MerchantResponseDto>>;
    merchantGetDetail(currentUser: CurrentUserPayload): Promise<import("../../../common/base/interfaces/response.interface").ResponseInterface<MerchantResponseDto>>;
    getDetailById(id: number): Promise<import("../../../common/base/interfaces/response.interface").ResponseInterface<MerchantDetailResponseDto>>;
    adminGetMerchantPriceCurrencySummary(currentUser: CurrentUserPayload): Promise<import("../../../common/base/interfaces/response.interface").ResponseInterface<any[]>>;
    adminGetMerchantPriceCurrencySummaryByDate(body: MerchantGetPriceCurrencySummaryDto): Promise<import("../../../common/base/interfaces/response.interface").ResponseInterface<any>>;
    getById(id: number): Promise<import("../../../common/base/interfaces/response.interface").ResponseInterface<MerchantResponseDto>>;
    adminUpdate(id: number, dto: MerchantUpdateDto): Promise<void>;
    merchantUpdate(dto: MerchantUpdateDto, currentUser: CurrentUserPayload): Promise<void>;
    adminUpdateActive(id: number, dto: AcitveDto): Promise<void>;
    adminDelete(id: number): Promise<void>;
}
