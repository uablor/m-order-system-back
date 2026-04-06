import { AuthCommandService } from '../services/auth-command.service';
import { AuthQueryService } from '../services/auth-query.service';
import { LoginDto } from '../dto/login.dto';
import { AuthResponseDto } from '../dto/auth-response.dto';
import type { CurrentUserPayload } from '../../../common/decorators/current-user.decorator';
export declare class AuthController {
    private readonly commandService;
    private readonly queryService;
    constructor(commandService: AuthCommandService, queryService: AuthQueryService);
    login(dto: LoginDto): Promise<AuthResponseDto>;
    me(user: CurrentUserPayload): Promise<import("../../../common/base/interfaces/response.interface").ResponseInterface<import("../dto/auth-response.dto").AuthUserDto>>;
}
