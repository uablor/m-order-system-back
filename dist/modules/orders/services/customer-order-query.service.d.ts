import { CustomerOrderQueryRepository } from '../repositories/customer-order.query-repository';
import { CustomerOrderRepository } from '../repositories/customer-order.repository';
import { CustomerOrderListQueryDto, TokenQueryDto } from '../dto/customer-order-list-query.dto';
import { CustomerOrderResponseDto } from '../dto/customer-order-response.dto';
import type { ResponseInterface, ResponseWithPaginationInterface } from '../../../common/base/interfaces/response.interface';
import { DataSource } from 'typeorm';
export declare class CustomerOrderQueryService {
    private readonly customerOrderRepository;
    private readonly customerOrderQueryRepository;
    private readonly dataSource;
    constructor(customerOrderRepository: CustomerOrderRepository, customerOrderQueryRepository: CustomerOrderQueryRepository, dataSource: DataSource);
    getById(id: number): Promise<CustomerOrderResponseDto | null>;
    getByIdOrFail(id: number): Promise<ResponseInterface<CustomerOrderResponseDto>>;
    getList(query: CustomerOrderListQueryDto): Promise<ResponseWithPaginationInterface<CustomerOrderResponseDto>>;
    getSummary(dto: TokenQueryDto): Promise<any[]>;
    private toResponse;
}
