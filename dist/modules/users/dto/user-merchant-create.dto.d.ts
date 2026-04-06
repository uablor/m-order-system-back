export declare class UserMerchantCreateDto {
    email: string;
    password: string;
    fullName: string;
    shopName: string;
    shopLogoUrl?: number;
    shopAddress?: string;
    contactPhone?: string;
    contactEmail?: string;
    contactFacebook?: string;
    contactLine?: string;
    contactWhatsapp?: string;
    defaultCurrency?: 'THB' | 'USD' | 'LAK';
}
