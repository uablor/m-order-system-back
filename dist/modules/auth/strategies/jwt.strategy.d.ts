import { ConfigService } from '@nestjs/config';
import type { CurrentUserPayload } from '../../../common/decorators/current-user.decorator';
import { UserQueryService } from '../../users/services/user-query.service';
export interface JwtPayload {
    userId: number;
    email: string;
    roleId: number;
    roleName?: string;
    merchantId?: number | null;
    permissions?: string[];
    iat?: number;
    exp?: number;
}
declare const JwtStrategy_base: new (...args: any) => any;
export declare class JwtStrategy extends JwtStrategy_base {
    private readonly configService;
    private readonly userQueryService;
    constructor(configService: ConfigService, userQueryService: UserQueryService);
    validate(payload: JwtPayload): Promise<CurrentUserPayload>;
}
export {};
