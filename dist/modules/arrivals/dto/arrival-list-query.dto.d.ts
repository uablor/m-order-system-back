import { BaseQueryDto } from 'src/common/base/dtos/base.query.dto';
export declare class ArrivalListQueryDto extends BaseQueryDto {
    merchantId?: number;
    orderId?: number;
    orderItemId?: number;
    startDate?: string;
    endDate?: string;
    createdByUserId?: number;
    arrivalDate?: string;
    arrivalTime?: string;
    arrival?: boolean;
    customerId?: number;
    notification?: boolean;
}
