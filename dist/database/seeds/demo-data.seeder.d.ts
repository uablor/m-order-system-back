import { CustomerRepository } from '../../modules/customers/repositories/customer.repository';
import { MerchantRepository } from '../../modules/merchants/repositories/merchant.repository';
import { UserRepository } from '../../modules/users/repositories/user.repository';
import type { SeededRoles } from './role.seeder';
export declare const DEMO_ADMIN_EMAIL = "admin@admin.com";
export declare const DEMO_ADMIN_PASSWORD = "Admin@123";
export declare const DEMO_MERCHANT1_EMAIL = "merchant1@admin.com";
export declare const DEMO_MERCHANT1_PASSWORD = "Merchant@123";
export declare const DEMO_MERCHANT2_EMAIL = "merchant2@admin.com";
export declare const DEMO_MERCHANT2_PASSWORD = "Merchant@123";
export interface DemoSeedResult {
    adminUserId: number;
    merchant1: {
        userId: number;
        merchantId: number;
    };
    merchant2: {
        userId: number;
        merchantId: number;
    };
}
export declare function runDemoDataSeeder(userRepository: UserRepository, merchantRepository: MerchantRepository, customerRepository: CustomerRepository, roles: SeededRoles): Promise<DemoSeedResult>;
