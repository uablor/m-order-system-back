export declare class CreateArrivalItemDto {
    orderItemId: number;
    arrivedQuantity: number;
    condition?: 'OK' | 'DAMAGED' | 'LOST';
    notes?: string;
}
export declare class CreateArrivalDto {
    orderId: number;
    notes?: string;
    arrivalItems: CreateArrivalItemDto[];
}
