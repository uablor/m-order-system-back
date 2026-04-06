import { CustomerQueryRepository } from '../repositories/customer.query-repository';
import { CustomerListQueryDto } from '../dto/customer-list-query.dto';
import { CustomerResponseDto } from '../dto/customer-response.dto';
import type { ResponseInterface, ResponseWithPaginationInterface } from '../../../common/base/interfaces/response.interface';
import { CurrentUserPayload } from 'src/common/decorators/current-user.decorator';
export declare class CustomerQueryService {
    private readonly customerQueryRepository;
    constructor(customerQueryRepository: CustomerQueryRepository);
    getById(id: number, auth: CurrentUserPayload, manager?: import('typeorm').EntityManager): Promise<CustomerResponseDto | null>;
    getByIdOrFail(id: number, auth: CurrentUserPayload, manager?: import('typeorm').EntityManager): Promise<ResponseInterface<CustomerResponseDto>>;
    getList(query: CustomerListQueryDto, currentUser?: CurrentUserPayload): Promise<ResponseWithPaginationInterface<CustomerResponseDto> & {
        summary: any;
    }>;
    private toResponse;
}
