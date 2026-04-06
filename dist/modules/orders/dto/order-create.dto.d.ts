export declare class OrderCreateDto {
    merchantId: number;
    orderCode: string;
    orderDate: string;
    arrivalStatus?: 'NOT_ARRIVED' | 'ARRIVED';
    totalShippingCost?: number;
}
