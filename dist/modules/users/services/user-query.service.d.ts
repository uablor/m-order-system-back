import { UserQueryRepository } from '../repositories/user.query-repository';
import { UserListQueryDto } from '../dto/user-list-query.dto';
import { UserResponseDto } from '../dto/user-response.dto';
import type { ResponseInterface, ResponseWithPaginationInterface } from '../../../common/base/interfaces/response.interface';
import { TransactionService } from 'src/common/transaction/transaction.service';
export declare class UserQueryService {
    private readonly userQueryRepository;
    private readonly transactionService;
    constructor(userQueryRepository: UserQueryRepository, transactionService: TransactionService);
    getById(id: number): Promise<UserResponseDto | null>;
    getByIdOrFail(id: number): Promise<ResponseInterface<UserResponseDto>>;
    getList(query: UserListQueryDto, merchantId?: number): Promise<ResponseWithPaginationInterface<UserResponseDto>>;
    getSummary(query: UserListQueryDto, merchantId?: number): Promise<{
        totalUsers: number;
        totalActive: number;
        totalInactive: number;
    }>;
    private toResponse;
}
