import { RolePermissionQueryRepository } from '../repositories/role-permission.query-repository';
import { PermissionResponseDto } from '../../permissions/dto/permission-response.dto';
import type { ResponseInterface } from '../../../common/base/interfaces/response.interface';
export declare class RolePermissionQueryService {
    private readonly rolePermissionQueryRepository;
    constructor(rolePermissionQueryRepository: RolePermissionQueryRepository);
    getPermissionsByRoleId(roleId: number): Promise<ResponseInterface<PermissionResponseDto[]>>;
}
