export declare const PERMISSIONS_KEY = "permissions";
export interface RequirePermissionsOptions {
    permissions?: string[];
    auto?: boolean;
}
export declare const RequirePermissions: (options: string[] | RequirePermissionsOptions) => import("@nestjs/common").CustomDecorator<string>;
export declare const RequireAutoPermission: () => import("@nestjs/common").CustomDecorator<string>;
