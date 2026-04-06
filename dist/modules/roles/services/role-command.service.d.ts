import { TransactionService } from '../../../common/transaction/transaction.service';
import { RoleRepository } from '../repositories/role.repository';
import { RoleCreateDto } from '../dto/role-create.dto';
import { RoleUpdateDto } from '../dto/role-update.dto';
export declare class RoleCommandService {
    private readonly roleRepository;
    private readonly transactionService;
    constructor(roleRepository: RoleRepository, transactionService: TransactionService);
    create(dto: RoleCreateDto): Promise<{
        id: number;
    }>;
    update(id: number, dto: RoleUpdateDto): Promise<void>;
    delete(id: number): Promise<void>;
}
