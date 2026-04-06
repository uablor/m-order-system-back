import { TransactionService } from '../../../common/transaction/transaction.service';
import { ExchangeRateRepository } from '../repositories/exchange-rate.repository';
import { MerchantRepository } from '../../merchants/repositories/merchant.repository';
import { ExchangeRateCreateDto, ExchangeRateCreateManyDto } from '../dto/exchange-rate-create.dto';
import { ExchangeRateUpdateDto } from '../dto/exchange-rate-update.dto';
import { CurrentUserPayload } from 'src/common/decorators/current-user.decorator';
import { Cache } from '@nestjs/cache-manager';
export declare class ExchangeRateCommandService {
    private readonly transactionService;
    private readonly exchangeRateRepository;
    private readonly merchantRepository;
    private cacheManager;
    constructor(transactionService: TransactionService, exchangeRateRepository: ExchangeRateRepository, merchantRepository: MerchantRepository, cacheManager: Cache);
    create(dto: ExchangeRateCreateDto, currentUser: CurrentUserPayload): Promise<{
        id: number;
    }>;
    createMany(dto: ExchangeRateCreateManyDto, currentUser: CurrentUserPayload): Promise<{
        ids: number[];
    }>;
    update(id: number, dto: ExchangeRateUpdateDto, currentUser?: CurrentUserPayload): Promise<void>;
    delete(id: number): Promise<void>;
    private clearExchangeRateCache;
}
