import { MerchantQueryRepository } from '../repositories/merchant.query-repository';
import { MerchantRepository } from '../repositories/merchant.repository';
import { MerchantListQueryDto } from '../dto/merchant-list-query.dto';
import { MerchantResponseDto } from '../dto/merchant-response.dto';
import { MerchantDetailResponseDto } from '../dto/merchant-detail-response.dto';
import type { ResponseInterface, ResponseWithPaginationInterface } from '../../../common/base/interfaces/response.interface';
import { TransactionService } from 'src/common/transaction/transaction.service';
export declare class MerchantQueryService {
    private readonly merchantRepository;
    private readonly merchantQueryRepository;
    private readonly transactionService;
    constructor(merchantRepository: MerchantRepository, merchantQueryRepository: MerchantQueryRepository, transactionService: TransactionService);
    getById(id: number): Promise<MerchantResponseDto | null>;
    getByIdOrFail(id: number): Promise<ResponseInterface<MerchantResponseDto>>;
    getList(query: MerchantListQueryDto): Promise<ResponseWithPaginationInterface<MerchantResponseDto>>;
    findMerchantDetail(userId: number): Promise<ResponseInterface<MerchantResponseDto>>;
    getDetailById(id: number): Promise<ResponseInterface<MerchantDetailResponseDto>>;
    private toResponse;
}
