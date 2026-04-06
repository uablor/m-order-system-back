export declare class CustomerResponseDto {
    id: number;
    merchantId: number;
    customerName: string;
    customerType: string;
    shippingAddress: string | null;
    shippingProvider: string | null;
    shippingSource: string | null;
    shippingDestination: string | null;
    paymentTerms: string | null;
    contactPhone: string | null;
    contactFacebook: string | null;
    contactWhatsapp: string | null;
    contactLine: string | null;
    preferredContactMethod: string | null;
    uniqueToken: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}
