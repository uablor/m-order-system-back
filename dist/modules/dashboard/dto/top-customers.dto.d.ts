export declare class TopCustomerDto {
    rank: number;
    customerId: number;
    customerName: string;
    customerEmail: string;
    totalBuyAmountLak: number;
    orderCount: number;
    averageOrderAmountLak: number;
}
export declare class TopCustomersResponseDto {
    customers: TopCustomerDto[];
}
