import { BaseQueryDto } from 'src/common/base/dtos/base.query.dto';
export declare class MerchantListQueryDto extends BaseQueryDto {
}
export type MerchantListOptionsQueryDto = BaseQueryDto & {
    ownerUserId?: number;
};
