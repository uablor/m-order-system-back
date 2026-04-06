export declare class ArrivalItemResponseDto {
    id: number;
    arrivalId: number;
    orderItemId: number;
    orderItem?: {
        id: number;
        productName: string;
        variant: string | null;
        quantity: number;
        purchasePrice: number;
        purchaseTotal: number;
        shippingPrice: number;
        totalCostBeforeDiscount: number;
        discountType: string | null;
        discountValue: number | null;
        discountAmount: number | null;
        finalCost: number;
        sellingPriceForeign: number | null;
        sellingTotal: number | null;
        profit: number | null;
    } | null;
    arrivedQuantity: number;
    condition: string | null;
    notes: string | null;
    createdAt: Date;
    updatedAt: Date;
}
export declare class ArrivalResponseDto {
    id: number;
    orderId: number;
    order?: {
        id: number;
        orderCode: string;
        orderDate: string;
        totalAmount: number;
        currency: string;
        status: string;
        paymentStatus: string;
        customer: {
            id: number;
            customerName: string;
            contactPhone: string | null;
            contactWhatsapp: string | null;
            contactFacebook: string | null;
            preferredContactMethod: 'PHONE' | 'FACEBOOK' | 'WHATSAPP' | 'LINE' | null;
        } | null;
        customerOrders?: {
            id: number;
            customerId: number;
        }[];
    } | null;
    merchantId: number;
    arrivedDate: string;
    arrivedTime: string;
    recordedBy: number | null;
    recordedByUser?: {
        id: number;
        fullName: string;
        email: string;
    } | null;
    notes: string | null;
    arrivalItems?: ArrivalItemResponseDto[];
    createdAt: Date;
    updatedAt: Date;
}
