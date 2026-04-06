import { ExchangeRateQueryRepository } from '../repositories/exchange-rate.query-repository';
import { ExchangeRateListQueryDto } from '../dto/exchange-rate-list-query.dto';
import { ExchangeRateResponseDto } from '../dto/exchange-rate-response.dto';
import type { ResponseInterface, ResponseWithPaginationInterface } from '../../../common/base/interfaces/response.interface';
import { TransactionService } from 'src/common/transaction/transaction.service';
import { CurrentUserPayload } from 'src/common/decorators/current-user.decorator';
export declare class ExchangeRateQueryService {
    private readonly exchangeRateQueryRepository;
    private readonly transactionService;
    constructor(exchangeRateQueryRepository: ExchangeRateQueryRepository, transactionService: TransactionService);
    getById(id: number): Promise<ExchangeRateResponseDto | null>;
    getByIdOrFail(id: number): Promise<ResponseInterface<ExchangeRateResponseDto>>;
    getList(query: ExchangeRateListQueryDto, currentUser?: CurrentUserPayload): Promise<ResponseWithPaginationInterface<ExchangeRateResponseDto>>;
    getTodayRates(currentUser: CurrentUserPayload): Promise<ResponseInterface<ExchangeRateResponseDto[]>>;
    private toResponse;
}
