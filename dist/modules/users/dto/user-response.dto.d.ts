export declare class UserResponseDto {
    id: number;
    email: string;
    fullName: string;
    roleId: number;
    roleName?: string;
    merchantId?: number | null;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    lastLogin: Date | null;
}
