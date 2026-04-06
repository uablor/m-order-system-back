export declare class AuthUserDto {
    userId: number;
    email: string;
    fullName: string;
    roleId: number;
    roleName?: string;
    merchantId?: number | null;
    permissions?: string[];
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    lastLogin: Date | null;
}
export declare class AuthResponseDto {
    success: boolean;
    message: string;
    access_token: string;
    user?: AuthUserDto;
}
