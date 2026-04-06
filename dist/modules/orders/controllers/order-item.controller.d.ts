import { OrderItemQueryService } from '../services/order-item-query.service';
import { OrderItemListQueryDto } from '../dto/order-item-list-query.dto';
import { OrderItemResponseDto } from '../dto/order-item-response.dto';
import type { CurrentUserPayload } from '../../../common/decorators/current-user.decorator';
export declare class OrderItemController {
    private readonly orderItemQueryService;
    constructor(orderItemQueryService: OrderItemQueryService);
    getList(query: OrderItemListQueryDto): Promise<import("../../../common/base/interfaces/response.interface").ResponseWithPaginationInterface<OrderItemResponseDto>>;
    getListByMerchant(query: OrderItemListQueryDto, currentUser: CurrentUserPayload): Promise<import("../../../common/base/interfaces/response.interface").ResponseWithPaginationInterface<OrderItemResponseDto>>;
    getById(id: number, filter?: string): Promise<import("../../../common/base/interfaces/response.interface").ResponseInterface<OrderItemResponseDto>>;
}
