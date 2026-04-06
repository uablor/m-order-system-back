import { TransactionService } from '../../../common/transaction/transaction.service';
import { ArrivalItemRepository } from '../repositories/arrival-item.repository';
import { ArrivalItemUpdateDto } from '../dto/arrival-item-update.dto';
export declare class ArrivalItemCommandService {
    private readonly transactionService;
    private readonly arrivalItemRepository;
    constructor(transactionService: TransactionService, arrivalItemRepository: ArrivalItemRepository);
    update(id: number, dto: ArrivalItemUpdateDto): Promise<void>;
    delete(id: number): Promise<void>;
}
