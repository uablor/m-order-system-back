export declare class CustomerUpdateDto {
    customerName?: string;
    customerType?: 'CUSTOMER' | 'AGENT';
    shippingAddress?: string;
    shippingProvider?: string;
    shippingSource?: string;
    shippingDestination?: string;
    paymentTerms?: string;
    contactPhone?: string;
    contactFacebook?: string;
    contactWhatsapp?: string;
    contactLine?: string;
    preferredContactMethod?: 'PHONE' | 'FACEBOOK' | 'WHATSAPP' | 'LINE';
    uniqueToken?: string;
    isActive?: boolean;
}
