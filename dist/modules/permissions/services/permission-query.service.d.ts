import { PermissionQueryRepository } from '../repositories/permission.query-repository';
import { PermissionListQueryDto } from '../dto/permission-list-query.dto';
import { PermissionResponseDto } from '../dto/permission-response.dto';
import type { ResponseInterface, ResponseWithPaginationInterface } from '../../../common/base/interfaces/response.interface';
import { TransactionService } from 'src/common/transaction/transaction.service';
export declare class PermissionQueryService {
    private readonly permissionQueryRepository;
    private readonly transactionService;
    constructor(permissionQueryRepository: PermissionQueryRepository, transactionService: TransactionService);
    getById(id: number): Promise<PermissionResponseDto | null>;
    getByIdOrFail(id: number): Promise<ResponseInterface<PermissionResponseDto>>;
    getList(query: PermissionListQueryDto): Promise<ResponseWithPaginationInterface<PermissionResponseDto>>;
    private toResponse;
}
