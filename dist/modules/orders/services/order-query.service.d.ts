import { OrderQueryRepository } from '../repositories/order.query-repository';
import { OrderRepository } from '../repositories/order.repository';
import { OrderListQueryDto } from '../dto/order-list-query.dto';
import { OrderResponseDto } from '../dto/order-response.dto';
import type { ResponseInterface, ResponseWithPaginationInterface } from '../../../common/base/interfaces/response.interface';
export declare class OrderQueryService {
    private readonly orderRepository;
    private readonly orderQueryRepository;
    constructor(orderRepository: OrderRepository, orderQueryRepository: OrderQueryRepository);
    getById(id: number, withRelations?: boolean): Promise<OrderResponseDto | null>;
    getByIdOrFail(id: number): Promise<ResponseInterface<OrderResponseDto>>;
    getByIdWithItems(id: number): Promise<OrderResponseDto | null>;
    getList(query: OrderListQueryDto): Promise<ResponseWithPaginationInterface<OrderResponseDto>>;
    getListByMerchant(query: OrderListQueryDto, currentUser: import('../../../common/decorators/current-user.decorator').CurrentUserPayload): Promise<ResponseWithPaginationInterface<OrderResponseDto>>;
    getSummary(query: OrderListQueryDto): Promise<{
        totalOrders: number;
        arrivedOrders: number;
        notArrivedOrders: number;
        paidOrders: number;
        unpaidOrders: number;
    }>;
    getSummaryByMerchant(query: OrderListQueryDto, currentUser: import('../../../common/decorators/current-user.decorator').CurrentUserPayload): Promise<{
        totalOrders: number;
        arrivedOrders: number;
        notArrivedOrders: number;
        paidOrders: number;
        unpaidOrders: number;
    }>;
    private convertToTargetCurrency;
    private toResponse;
}
