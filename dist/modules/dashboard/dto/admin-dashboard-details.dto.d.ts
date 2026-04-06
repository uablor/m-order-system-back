export declare class TopMerchantDto {
    id: number;
    shopName: string;
    totalOrders: number;
    ownerUser: string;
    ownerUserEmail: string;
}
export declare class RecentUserDto {
    id: number;
    fullName: string;
    email: string;
    lastLogin: Date;
    merchant?: {
        id: number;
        shopName: string;
    };
}
export declare class AdminDashboardDetailsResponseDto {
    topMerchants: TopMerchantDto[];
    recentUserLogins: RecentUserDto[];
}
