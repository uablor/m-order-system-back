import { BaseQueryDto } from 'src/common/base/dtos/base.query.dto';
export declare enum ArrivalStatusFilter {
    NOT_ARRIVED = "NOT_ARRIVED",
    ARRIVED = "ARRIVED"
}
export declare enum PaymentStatusFilter {
    UNPAID = "UNPAID",
    PARTIAL = "PARTIAL",
    PAID = "PAID"
}
export declare class OrderListQueryDto extends BaseQueryDto {
    merchantId?: number;
    customerId?: number;
    customerName?: string;
    startDate?: string;
    endDate?: string;
    arrivalStatus?: ArrivalStatusFilter;
    paymentStatus?: PaymentStatusFilter;
}
