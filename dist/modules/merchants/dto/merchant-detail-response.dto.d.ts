import { ImageOrmEntity } from 'src/modules/images/entities/image.orm-entity';
export declare class MerchantFinancialByCurrencyDto {
    baseCurrency: string;
    totalOrders: number;
    totalIncomeLak: number;
    totalExpenseLak: number;
    totalProfitLak: number;
}
export declare class MerchantDetailUserDto {
    id: number;
    email: string;
    fullName: string;
    roleId: number;
    roleName?: string;
    isActive: boolean;
    createdAt: Date;
    lastLogin: Date | null;
}
export declare class MerchantDetailFinancialDto {
    totalOrders: number;
    ordersUnpaid: number;
    ordersPartial: number;
    ordersPaid: number;
    totalIncomeLak: number;
    totalIncomeThb: number;
    totalExpenseLak: number;
    totalExpenseThb: number;
    totalProfitLak: number;
    totalProfitThb: number;
    totalPaidAmount: number;
    totalRemainingAmount: number;
    byCurrency: MerchantFinancialByCurrencyDto[];
}
export declare class MerchantDetailSummaryDto {
    totalCustomers: number;
    activeCustomers: number;
    inactiveCustomers: number;
    customerTypeCustomer: number;
    customerTypeAgent: number;
    financial: MerchantDetailFinancialDto;
}
export declare class MerchantDetailResponseDto {
    id: number;
    ownerUserId: number;
    shopName: string;
    shopLogoUrl: ImageOrmEntity | null;
    shopAddress: string | null;
    contactPhone: string | null;
    contactEmail: string | null;
    contactFacebook: string | null;
    contactLine: string | null;
    contactWhatsapp: string | null;
    defaultCurrency: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    owner: MerchantDetailUserDto | null;
    summary: MerchantDetailSummaryDto;
}
export declare class MerchantResponseDto {
    id: number;
    ownerUserId: number;
    shopName: string;
    shopLogoUrl: string | null;
    shopAddress: string | null;
    contactPhone: string | null;
    contactEmail: string | null;
    contactFacebook: string | null;
    contactLine: string | null;
    contactWhatsapp: string | null;
    defaultCurrency: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}
