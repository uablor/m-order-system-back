import { ArrivalCommandService } from '../services/arrival-command.service';
import { ArrivalQueryService } from '../services/arrival-query.service';
import { CreateArrivalDto } from '../dto/create-arrival.dto';
import { CreateMultipleArrivalsDto } from '../dto/create-multiple-arrivals.dto';
import { ArrivalUpdateDto } from '../dto/arrival-update.dto';
import { ArrivalListQueryDto } from '../dto/arrival-list-query.dto';
import { ArrivalResponseDto } from '../dto/arrival-response.dto';
import type { CurrentUserPayload } from '../../../common/decorators/current-user.decorator';
export declare class ArrivalController {
    private readonly arrivalCommandService;
    private readonly arrivalQueryService;
    constructor(arrivalCommandService: ArrivalCommandService, arrivalQueryService: ArrivalQueryService);
    merchantCreate(dto: CreateArrivalDto, currentUser: CurrentUserPayload): Promise<{
        success: true;
        arrival: object;
        message: string;
    }>;
    merchantCreateMultiple(dto: CreateMultipleArrivalsDto, currentUser: CurrentUserPayload): Promise<{
        success: true;
        arrivals: object[];
        message: string;
        processedOrders: number;
        failedOrders: Array<{
            orderId: number;
            error: string;
        }>;
        notifications: Array<{
            recipientContact: string;
            notificationLink: string | null;
            language: string | null;
            customer?: {
                customerName?: string;
            } | null;
            relatedOrders: number[] | null;
        }>;
    }>;
    adminGetList(query: ArrivalListQueryDto): Promise<import("../../../common/base/interfaces/response.interface").ResponseWithPaginationInterface<import("../entities/arrival.orm-entity").ArrivalOrmEntity>>;
    adminGetSummary(query: ArrivalListQueryDto): Promise<{
        totalArrivals: number;
    }>;
    merchantGetList(query: ArrivalListQueryDto, currentUser: CurrentUserPayload): Promise<import("../../../common/base/interfaces/response.interface").ResponseWithPaginationInterface<ArrivalResponseDto>>;
    merchantGetSummary(query: ArrivalListQueryDto, currentUser: CurrentUserPayload): Promise<{
        totalArrivals: number;
    }>;
    getById(id: number): Promise<import("../../../common/base/interfaces/response.interface").ResponseInterface<ArrivalResponseDto>>;
    merchantUpdate(id: number, dto: ArrivalUpdateDto): Promise<void>;
    adminDelete(id: number): Promise<void>;
}
