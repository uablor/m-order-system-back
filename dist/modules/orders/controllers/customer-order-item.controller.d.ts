import { CustomerOrderItemQueryService } from '../services/customer-order-item-query.service';
import { CustomerOrderItemListQueryDto } from '../dto/customer-order-item-list-query.dto';
import { CustomerOrderItemResponseDto } from '../dto/customer-order-item-response.dto';
export declare class CustomerOrderItemController {
    private readonly customerOrderItemQueryService;
    constructor(customerOrderItemQueryService: CustomerOrderItemQueryService);
    getList(query: CustomerOrderItemListQueryDto): Promise<import("../../../common/base/interfaces/response.interface").ResponseWithPaginationInterface<CustomerOrderItemResponseDto>>;
    getById(id: number): Promise<import("../../../common/base/interfaces/response.interface").ResponseInterface<CustomerOrderItemResponseDto>>;
}
