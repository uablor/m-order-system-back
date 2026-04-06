import { TransactionService } from '../../../common/transaction/transaction.service';
import { PermissionRepository } from '../repositories/permission.repository';
import { PermissionCreateDto } from '../dto/permission-create.dto';
import { PermissionUpdateDto } from '../dto/permission-update.dto';
export declare class PermissionCommandService {
    private readonly permissionRepository;
    private readonly transactionService;
    constructor(permissionRepository: PermissionRepository, transactionService: TransactionService);
    create(dto: PermissionCreateDto): Promise<{
        id: number;
    }>;
    update(id: number, dto: PermissionUpdateDto): Promise<void>;
    delete(id: number): Promise<void>;
}
