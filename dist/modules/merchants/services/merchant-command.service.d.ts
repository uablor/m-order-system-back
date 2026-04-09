import { TransactionService } from '../../../common/transaction/transaction.service';
import { MerchantRepository } from '../repositories/merchant.repository';
import { MerchantCreateDto } from '../dto/merchant-create.dto';
import { MerchantUpdateDto } from '../dto/merchant-update.dto';
import { ImageQueryRepository } from 'src/modules/images/repositories/image.query-repository';
import { AcitveDto } from 'src/common/base/dtos/active.dto';
export declare class MerchantCommandService {
    private readonly merchantRepository;
    private readonly transactionService;
    private readonly imageQueryRepository;
    constructor(merchantRepository: MerchantRepository, transactionService: TransactionService, imageQueryRepository: ImageQueryRepository);
    create(ownerUserId: number, dto: MerchantCreateDto): Promise<{
        id: number;
    }>;
    update(id: number, dto: MerchantUpdateDto): Promise<void>;
    updateActive(id: number, dto: AcitveDto): Promise<void>;
    delete(id: number): Promise<void>;
}
