import { UserResponseDto } from 'src/modules/users/dto/user-response.dto';
import { OrderItemResponseDto } from './order-item-response.dto';
export declare class CustomerOrderItemResponseDto {
    id: number;
    customerOrderId: number;
    orderItemSkuId: number;
    variant: string | null;
    quantity: number;
    sellingPriceForeign: string;
    purchasePrice: string;
    purchaseTotal: string;
    sellingTotal: string;
    profit: string;
    createdAt: Date;
    updatedAt: Date;
}
export declare class CustomerSnapshotDto {
    id: number;
    customerName: string;
    customerType: string;
}
export declare class CustomerOrderResponseDto {
    id: number;
    orderId: number;
    customerId: number;
    customer: CustomerSnapshotDto | null;
    totalSellingAmount: string;
    paidAmount: string;
    remainingAmount: string;
    targetCurrencyTotalSellingAmount: string;
    targetCurrencyPaidAmount: string;
    targetCurrencyRemainingAmount: string;
    paymentStatus: string;
    customerOrderItems: CustomerOrderItemResponseDto[];
    createdAt: Date;
    updatedAt: Date;
}
export declare class OrderResponseDto {
    id: number;
    merchantId: number;
    createdByUser: UserResponseDto | null;
    orderCode: string;
    orderDate: string;
    arrivalStatus: string;
    arrivedAt: Date | null;
    notifiedAt: Date | null;
    exchangeRateBuy: {
        id: number;
        baseCurrency: string;
        targetCurrency: string;
        rate: string | null;
        rateType: string;
        rateDate: Date;
        isActive: boolean;
    } | null;
    exchangeRateSell: {
        id: number;
        baseCurrency: string;
        targetCurrency: string;
        rate: string | null;
        rateType: string;
        rateDate: Date;
        isActive: boolean;
    } | null;
    shippingExchangeRate: {
        id: number;
        baseCurrency: string;
        targetCurrency: string;
        rate: string | null;
        rateType: string;
        rateDate: Date;
        isActive: boolean;
    } | null;
    exchangeRateBuyValue: string | null;
    exchangeRateSellValue: string | null;
    totalPurchaseCost: string;
    totalShippingCost: string;
    totalCostBeforeDiscount: string;
    totalDiscount: string;
    totalFinalCost: string;
    totalSellingAmount: string;
    totalProfit: string;
    targetCurrencyTotalPurchaseCost: string;
    targetCurrencyTotalShippingCost: string;
    targetCurrencyTotalCostBeforeDiscount: string;
    targetCurrencyTotalDiscount: string;
    targetCurrencyTotalFinalCost: string;
    targetCurrencyTotalSellingAmount: string;
    targetCurrencyTotalProfit: string;
    targetCurrencyTotalShippingCostByShippingExchangeRate: string;
    paymentStatus: string;
    orderItems: OrderItemResponseDto[];
    customerOrders: CustomerOrderResponseDto[];
    createdAt: Date;
    updatedAt: Date;
}
