export declare class MerchantResponseDto {
    id: number;
    ownerUserId: number;
    shopName: string;
    shopLogoUrl: {
        id: number;
        fileKey: string;
        originalName: string;
        publicUrl: string | null;
    } | null;
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
