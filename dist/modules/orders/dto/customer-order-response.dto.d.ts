import { PaymentStatusEnum } from '../../payments/enum/payment.enum';
declare class CustomerOrderItemResponseDto {
    id: number;
    orderItemSkuId: number;
    variant: string | null;
    quantity: number;
    sellingPriceForeign: number;
    purchasePrice: number;
    purchaseTotal: number;
    sellingTotal: number;
    profit: number;
    productName: string | null;
    orderItemId: number | null;
}
export declare class CustomerOrderResponseDto {
    id: number;
    orderId: number;
    orderCode: string | null;
    customerId: number;
    customerName: string;
    customerToken: string;
    totalSellingAmount: number;
    totalPaid: number;
    remainingAmount: number;
    targetCurrencyTotalSellingAmount: number;
    targetCurrencyTotalPaid: number;
    targetCurrencyRemainingAmount: number;
    paymentStatus: PaymentStatusEnum;
    hasPendingPayment: boolean;
    discountType: string | null;
    discountValue: number | null;
    discountAmount: number;
    customerOrderItems: CustomerOrderItemResponseDto[];
    createdAt: Date;
    updatedAt: Date;
}
export {};
