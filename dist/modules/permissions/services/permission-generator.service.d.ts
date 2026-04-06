import { DiscoveryService, Reflector } from '@nestjs/core';
import { PermissionRepository } from '../repositories/permission.repository';
import { TransactionService } from '../../../common/transaction/transaction.service';
import { GeneratePermissionsResult, GeneratedPermission } from '../interface/generted-permssion.interfacet';
export declare class PermissionGeneratorService {
    private readonly discoveryService;
    private readonly reflector;
    private readonly permissionRepository;
    private readonly transactionService;
    constructor(discoveryService: DiscoveryService, reflector: Reflector, permissionRepository: PermissionRepository, transactionService: TransactionService);
    generateFromControllers(): Promise<GeneratePermissionsResult>;
    discoverControllerPermissions(): GeneratedPermission[];
    private getControllerPath;
    private derivePathFromClassName;
    private getRouteMethodNames;
}
