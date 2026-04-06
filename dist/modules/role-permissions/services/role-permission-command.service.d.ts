import { TransactionService } from '../../../common/transaction/transaction.service';
import { RolePermissionRepository } from '../repositories/role-permission.repository';
import { RoleRepository } from '../../roles/repositories/role.repository';
import { PermissionRepository } from '../../permissions/repositories/permission.repository';
export declare class RolePermissionCommandService {
    private readonly rolePermissionRepository;
    private readonly roleRepository;
    private readonly permissionRepository;
    private readonly transactionService;
    constructor(rolePermissionRepository: RolePermissionRepository, roleRepository: RoleRepository, permissionRepository: PermissionRepository, transactionService: TransactionService);
    assign(roleId: number, permissionId: number): Promise<void>;
    unassign(roleId: number, permissionId: number): Promise<void>;
}
