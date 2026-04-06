export declare class CustomerListQueryDto {
    page?: number;
    limit?: number;
    merchantId?: number;
    search?: string;
    customerType?: 'CUSTOMER' | 'AGENT';
    isActive?: boolean;
}
