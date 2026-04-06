import { CustomerOrderQueryService } from '../services/customer-order-query.service';
import { CustomerOrderListQueryDto, TokenQueryDto } from '../dto/customer-order-list-query.dto';
import { CustomerOrderResponseDto } from '../dto/customer-order-response.dto';
import type { CurrentUserPayload } from '../../../common/decorators/current-user.decorator';
export declare class CustomerOrderController {
    private readonly customerOrderQueryService;
    constructor(customerOrderQueryService: CustomerOrderQueryService);
    getList(query: CustomerOrderListQueryDto, currentUser: CurrentUserPayload): Promise<import("../../../common/base/interfaces/response.interface").ResponseWithPaginationInterface<CustomerOrderResponseDto>>;
    getByToken(query: CustomerOrderListQueryDto): Promise<import("../../../common/base/interfaces/response.interface").ResponseWithPaginationInterface<CustomerOrderResponseDto>>;
    getSummaryByToken(query: TokenQueryDto): Promise<any[]>;
    getById(id: number): Promise<import("../../../common/base/interfaces/response.interface").ResponseInterface<CustomerOrderResponseDto>>;
}
