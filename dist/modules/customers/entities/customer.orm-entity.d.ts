import { BaseOrmEntity } from '../../../common/base/enities/base.orm-entities';
import { MerchantOrmEntity } from '../../merchants/entities/merchant.orm-entity';
export type CustomerType = 'CUSTOMER' | 'AGENT';
export type PreferredContactMethod = 'PHONE' | 'FACEBOOK' | 'WHATSAPP' | 'LINE';
export declare class CustomerOrmEntity extends BaseOrmEntity {
    merchant: MerchantOrmEntity;
    customerName: string;
    customerType: CustomerType;
    shippingAddress: string | null;
    shippingProvider: string | null;
    shippingSource: string | null;
    shippingDestination: string | null;
    paymentTerms: string | null;
    contactPhone: string | null;
    contactFacebook: string | null;
    contactWhatsapp: string | null;
    contactLine: string | null;
    preferredContactMethod: PreferredContactMethod | null;
    uniqueToken: string;
    isActive: boolean;
}
