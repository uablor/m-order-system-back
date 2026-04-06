import { BaseQueryDto } from 'src/common/base/dtos/base.query.dto';
export declare class TokenQueryDto {
    customerToken?: string;
    notificationToken?: string;
}
declare const CustomerOrderListQueryDto_base: import("@nestjs/common").Type<BaseQueryDto & TokenQueryDto>;
export declare class CustomerOrderListQueryDto extends CustomerOrderListQueryDto_base {
    notificationStatus?: string;
    merchantId?: number;
    orderId?: number;
    orderCode?: string;
    customerOrderId?: number;
    customerId?: number;
    customerName?: string;
    isArrived?: boolean;
    startDate?: string;
    endDate?: string;
    paymentStatus?: string;
}
export {};
