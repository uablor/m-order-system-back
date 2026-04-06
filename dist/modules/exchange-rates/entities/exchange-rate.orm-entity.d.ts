import { BaseOrmEntity } from '../../../common/base/enities/base.orm-entities';
import { MerchantOrmEntity } from '../../merchants/entities/merchant.orm-entity';
import { UserOrmEntity } from '../../users/entities/user.orm-entity';
export type ExchangeRateType = 'BUY' | 'SELL';
export declare class ExchangeRateOrmEntity extends BaseOrmEntity {
    merchant: MerchantOrmEntity;
    baseCurrency: string;
    targetCurrency: string;
    rateType: ExchangeRateType;
    rate: number;
    isActive: boolean;
    rateDate: Date;
    createdByUser: UserOrmEntity | null;
}
