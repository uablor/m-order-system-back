import { RoleOrmEntity } from '../../roles/entities/role.orm-entity';
import { BaseOrmEntity } from '../../../common/base/enities/base.orm-entities';
import { MerchantOrmEntity } from 'src/modules/merchants/entities/merchant.orm-entity';
export declare class UserOrmEntity extends BaseOrmEntity {
    email: string;
    passwordHash: string;
    fullName: string;
    roleId: number;
    role: RoleOrmEntity;
    merchantId?: number | null;
    merchant?: MerchantOrmEntity | null;
    isActive: boolean;
    lastLogin: Date | null;
}
