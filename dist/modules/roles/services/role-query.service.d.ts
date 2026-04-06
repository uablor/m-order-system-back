import { RoleQueryRepository } from '../repositories/role.query-repository';
import { RoleListQueryDto } from '../dto/role-list-query.dto';
import { RoleResponseDto } from '../dto/role-response.dto';
import type { ResponseInterface, ResponseWithPaginationInterface } from '../../../common/base/interfaces/response.interface';
import { TransactionService } from 'src/common/transaction/transaction.service';
export declare class RoleQueryService {
    private readonly roleQueryRepository;
    private readonly transactionService;
    constructor(roleQueryRepository: RoleQueryRepository, transactionService: TransactionService);
    getById(id: number): Promise<RoleResponseDto | null>;
    getByIdOrFail(id: number): Promise<ResponseInterface<RoleResponseDto>>;
    getList(query: RoleListQueryDto): Promise<ResponseWithPaginationInterface<RoleResponseDto>>;
    private toResponse;
}
