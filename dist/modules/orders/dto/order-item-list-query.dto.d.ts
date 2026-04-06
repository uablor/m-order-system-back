import { BaseQueryDto } from 'src/common/base/dtos/base.query.dto';
export declare class OrderItemListQueryDto extends BaseQueryDto {
    orderId?: number;
    merchantId?: number;
    orderItemSkuId?: number;
}
