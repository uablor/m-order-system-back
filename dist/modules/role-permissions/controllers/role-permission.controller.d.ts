import { RolePermissionCommandService } from '../services/role-permission-command.service';
import { RolePermissionQueryService } from '../services/role-permission-query.service';
import { AssignPermissionDto } from '../dto/assign-permission.dto';
export declare class RolePermissionController {
    private readonly commandService;
    private readonly queryService;
    constructor(commandService: RolePermissionCommandService, queryService: RolePermissionQueryService);
    adminAssign(dto: AssignPermissionDto): Promise<{
        success: boolean;
    }>;
    adminUnassign(roleId: number, permissionId: number): Promise<void>;
    adminGetByRoleId(roleId: number): Promise<import("../../../common/base/interfaces/response.interface").ResponseInterface<import("../../permissions/dto/permission-response.dto").PermissionResponseDto[]>>;
}
