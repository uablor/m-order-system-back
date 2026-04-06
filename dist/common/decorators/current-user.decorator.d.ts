export interface CurrentUserPayload {
    userId: number;
    email: string;
    roleId: number;
    roleName?: string;
    merchantId?: number | null;
    permissions?: string[];
}
export declare const CurrentUser: (...dataOrPipes: (keyof CurrentUserPayload | import("@nestjs/common").PipeTransform<any, any> | import("@nestjs/common").Type<import("@nestjs/common").PipeTransform<any, any>> | undefined)[]) => ParameterDecorator;
