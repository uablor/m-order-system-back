import { OrderItemQueryRepository } from '../repositories/order-item.query-repository';
import { OrderItemRepository } from '../repositories/order-item.repository';
import { OrderItemListQueryDto } from '../dto/order-item-list-query.dto';
import { OrderItemResponseDto } from '../dto/order-item-response.dto';
import type { ResponseInterface, ResponseWithPaginationInterface } from '../../../common/base/interfaces/response.interface';
import type { CurrentUserPayload } from '../../../common/decorators/current-user.decorator';
export declare class OrderItemQueryService {
    private readonly orderItemRepository;
    private readonly orderItemQueryRepository;
    constructor(orderItemRepository: OrderItemRepository, orderItemQueryRepository: OrderItemQueryRepository);
    getById(id: number): Promise<OrderItemResponseDto | null>;
    getByIdOrFail(id: number): Promise<ResponseInterface<OrderItemResponseDto>>;
    getByOrderItemSkuIdOrFail(orderItemSkuId: number): Promise<ResponseInterface<OrderItemResponseDto>>;
    getList(query: OrderItemListQueryDto): Promise<ResponseWithPaginationInterface<OrderItemResponseDto>>;
    getListByMerchant(query: OrderItemListQueryDto, currentUser: CurrentUserPayload): Promise<ResponseWithPaginationInterface<OrderItemResponseDto>>;
    private convertToTargetCurrency;
    private toResponse;
}
