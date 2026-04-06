import { JwtService } from '@nestjs/jwt';
import { UserQueryRepository } from '../../users/repositories/user.query-repository';
import { RolePermissionQueryService } from '../../role-permissions/services/role-permission-query.service';
import { LoginDto } from '../dto/login.dto';
import type { AuthResponseDto } from '../dto/auth-response.dto';
export declare class AuthCommandService {
    private readonly userQueryRepository;
    private readonly rolePermissionQueryService;
    private readonly jwtService;
    constructor(userQueryRepository: UserQueryRepository, rolePermissionQueryService: RolePermissionQueryService, jwtService: JwtService);
    login(dto: LoginDto): Promise<AuthResponseDto>;
}
