import { UserQueryRepository } from '../../users/repositories/user.query-repository';
import { RolePermissionQueryService } from '../../role-permissions/services/role-permission-query.service';
import type { AuthUserDto } from '../dto/auth-response.dto';
import type { ResponseInterface } from '../../../common/base/interfaces/response.interface';
export declare class AuthQueryService {
    private readonly userQueryRepository;
    private readonly rolePermissionQueryService;
    constructor(userQueryRepository: UserQueryRepository, rolePermissionQueryService: RolePermissionQueryService);
    getProfile(userId: number): Promise<ResponseInterface<AuthUserDto>>;
}
