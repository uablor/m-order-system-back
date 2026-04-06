import { CustomerOrderItemQueryRepository } from '../repositories/customer-order-item.query-repository';
import { CustomerOrderItemRepository } from '../repositories/customer-order-item.repository';
import { CustomerOrderItemListQueryDto } from '../dto/customer-order-item-list-query.dto';
import { CustomerOrderItemResponseDto } from '../dto/customer-order-item-response.dto';
import type { ResponseInterface, ResponseWithPaginationInterface } from '../../../common/base/interfaces/response.interface';
export declare class CustomerOrderItemQueryService {
    private readonly customerOrderItemRepository;
    private readonly customerOrderItemQueryRepository;
    constructor(customerOrderItemRepository: CustomerOrderItemRepository, customerOrderItemQueryRepository: CustomerOrderItemQueryRepository);
    getById(id: number): Promise<CustomerOrderItemResponseDto | null>;
    getByIdOrFail(id: number): Promise<ResponseInterface<CustomerOrderItemResponseDto>>;
    getList(query: CustomerOrderItemListQueryDto): Promise<ResponseWithPaginationInterface<CustomerOrderItemResponseDto>>;
    private toResponse;
}
