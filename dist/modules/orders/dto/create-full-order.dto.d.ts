export declare class CreateFullOrderItemSkuDto {
    orderItemSkuIndex: number;
    variant: string;
    quantity: number;
    purchasePrice: number;
    sellingPriceForeign: number;
    exchangeRateBuyId?: number;
    exchangeRateSellId?: number;
}
export declare class CreateFullOrderItemDto {
    Index: number;
    productName: string;
    skus: CreateFullOrderItemSkuDto[];
    discountType?: 'PERCENT' | 'FIX';
    discountValue?: number;
    imageId?: number;
    shippingPrice?: number;
}
export declare class CreateFullCustomerOrderItemDto {
    orderItemIndex: number;
    skuIndex: number;
    quantity: number;
    sellingPriceForeign?: number;
}
export declare class CreateFullCustomerOrderDto {
    customerId: number;
    items: CreateFullCustomerOrderItemDto[];
}
export declare class CreateFullOrderDto {
    orderCode: string;
    shippingExchangeRateId?: number;
    items: CreateFullOrderItemDto[];
    customerOrders: CreateFullCustomerOrderDto[];
}
