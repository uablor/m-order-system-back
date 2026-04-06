import { TransactionService } from '../../../common/transaction/transaction.service';
import { CustomerRepository } from '../repositories/customer.repository';
import { MerchantRepository } from '../../merchants/repositories/merchant.repository';
import { CustomerCreateDto } from '../dto/customer-create.dto';
import { CustomerUpdateDto } from '../dto/customer-update.dto';
export declare class CustomerCommandService {
    private readonly customerRepository;
    private readonly merchantRepository;
    private readonly transactionService;
    constructor(customerRepository: CustomerRepository, merchantRepository: MerchantRepository, transactionService: TransactionService);
    create(dto: CustomerCreateDto): Promise<{
        id: number;
    }>;
    update(id: number, dto: CustomerUpdateDto): Promise<void>;
    delete(id: number): Promise<void>;
}
