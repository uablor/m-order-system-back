import { BaseQueryDto } from 'src/common/base/dtos/base.query.dto';
export declare class UserListQueryDto extends BaseQueryDto {
    isActive?: boolean;
    startDate?: string;
    endDate?: string;
    merchantId?: number;
}
export type UserListQueryOptions = UserListQueryDto;
