import { OrderCommandService } from '../services/order-command.service';
import { OrderQueryService } from '../services/order-query.service';
import { CreateFullOrderDto } from '../dto/create-full-order.dto';
import { OrderCreateDto } from '../dto/order-create.dto';
import { OrderUpdateDto } from '../dto/order-update.dto';
import { OrderListQueryDto } from '../dto/order-list-query.dto';
import { OrderResponseDto } from '../dto/order-response.dto';
import type { CurrentUserPayload } from '../../../common/decorators/current-user.decorator';
export declare class OrderController {
    private readonly orderCommandService;
    private readonly orderQueryService;
    constructor(orderCommandService: OrderCommandService, orderQueryService: OrderQueryService);
    merchantCreateFull(dto: CreateFullOrderDto, currentUser: CurrentUserPayload): Promise<{
        success: true;
        order: object;
        message: string;
    }>;
    merchantCreate(dto: OrderCreateDto, currentUser?: CurrentUserPayload): Promise<{
        id: number;
    }>;
    adminGetList(query: OrderListQueryDto): Promise<import("../../../common/base/interfaces/response.interface").ResponseWithPaginationInterface<OrderResponseDto>>;
    adminGetSummary(query: OrderListQueryDto): Promise<{
        totalOrders: number;
        arrivedOrders: number;
        notArrivedOrders: number;
        paidOrders: number;
        unpaidOrders: number;
    }>;
    merchantGetList(query: OrderListQueryDto, currentUser: CurrentUserPayload): Promise<import("../../../common/base/interfaces/response.interface").ResponseWithPaginationInterface<OrderResponseDto>>;
    merchantGetSummary(query: OrderListQueryDto, currentUser: CurrentUserPayload): Promise<{
        totalOrders: number;
        arrivedOrders: number;
        notArrivedOrders: number;
        paidOrders: number;
        unpaidOrders: number;
    }>;
    getById(id: number): Promise<import("../../../common/base/interfaces/response.interface").ResponseInterface<OrderResponseDto>>;
    merchantUpdate(id: number, dto: OrderUpdateDto): Promise<void>;
    adminDelete(id: number): Promise<void>;
}
