export declare class OrderUpdateDto {
    orderCode?: string;
    orderDate?: string;
    arrivalStatus?: 'NOT_ARRIVED' | 'ARRIVED';
    arrivedAt?: string;
    notifiedAt?: string;
    totalShippingCost?: number;
}
