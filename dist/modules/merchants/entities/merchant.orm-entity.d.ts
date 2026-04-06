import { BaseOrmEntity } from '../../../common/base/enities/base.orm-entities';
import { UserOrmEntity } from '../../users/entities/user.orm-entity';
import { ImageOrmEntity } from '../../images/entities/image.orm-entity';
export type DefaultCurrency = 'THB' | 'USD' | 'LAK';
export declare class MerchantOrmEntity extends BaseOrmEntity {
    ownerUserId: number;
    ownerUser: UserOrmEntity;
    shopName: string;
    shopLogoUrlId: number | null;
    shopLogoUrl: ImageOrmEntity;
    shopAddress: string | null;
    contactPhone: string | null;
    contactEmail: string | null;
    contactFacebook: string | null;
    contactLine: string | null;
    contactWhatsapp: string | null;
    defaultCurrency: DefaultCurrency;
    isActive: boolean;
}
