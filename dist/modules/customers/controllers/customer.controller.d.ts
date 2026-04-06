import { CustomerCommandService } from '../services/customer-command.service';
import { CustomerQueryService } from '../services/customer-query.service';
import { CustomerCreateDto } from '../dto/customer-create.dto';
import { CustomerUpdateDto } from '../dto/customer-update.dto';
import { CustomerListQueryDto } from '../dto/customer-list-query.dto';
import { CustomerResponseDto } from '../dto/customer-response.dto';
import { type CurrentUserPayload } from 'src/common/decorators/current-user.decorator';
export declare class CustomerController {
    protected readonly commandService: CustomerCommandService;
    protected readonly queryService: CustomerQueryService;
    constructor(commandService: CustomerCommandService, queryService: CustomerQueryService);
    merchantCreate(dto: CustomerCreateDto): Promise<{
        id: number;
    }>;
    merchantGetList(query: CustomerListQueryDto, currentUser: CurrentUserPayload): Promise<import("../../../common/base/interfaces/response.interface").ResponseWithPaginationInterface<CustomerResponseDto> & {
        summary: any;
    }>;
    adminGetList(query: CustomerListQueryDto): Promise<import("../../../common/base/interfaces/response.interface").ResponseWithPaginationInterface<CustomerResponseDto> & {
        summary: any;
    }>;
    getById(id: number, currentUser: CurrentUserPayload): Promise<import("../../../common/base/interfaces/response.interface").ResponseInterface<CustomerResponseDto>>;
    merchantUpdate(id: number, dto: CustomerUpdateDto): Promise<void>;
    adminDelete(id: number): Promise<void>;
}
