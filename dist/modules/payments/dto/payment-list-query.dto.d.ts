import { BaseQueryDto } from '../../../common/base/dtos/base.query.dto';
export declare class PaymentListQueryDto extends BaseQueryDto {
    status?: string;
    customerOrderId?: number;
    customerId?: number;
    merchantId?: number;
    paymentDateFrom?: Date;
    paymentDateTo?: Date;
    readAt?: Date | null;
}
