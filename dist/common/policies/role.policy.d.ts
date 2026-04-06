import { CurrentUserPayload } from '../decorators/current-user.decorator';
export declare const ADMIN_ROLE = "ADMIN";
export declare function canCreateRole(user: CurrentUserPayload): boolean;
export declare function canAssignPermission(user: CurrentUserPayload): boolean;
export declare function canUpdateUser(user: CurrentUserPayload, targetUserId: number): boolean;
export declare function canDeleteUser(user: CurrentUserPayload, targetUserId: number): boolean;
