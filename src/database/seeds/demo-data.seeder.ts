import { hashPassword } from '../../common/utils/password.util';
import { CustomerOrmEntity } from '../../modules/customers/entities/customer.orm-entity';
import { CustomerRepository } from '../../modules/customers/repositories/customer.repository';
import { MerchantOrmEntity } from '../../modules/merchants/entities/merchant.orm-entity';
import { MerchantRepository } from '../../modules/merchants/repositories/merchant.repository';
import { UserOrmEntity } from '../../modules/users/entities/user.orm-entity';
import { UserRepository } from '../../modules/users/repositories/user.repository';
import type { SeededRoles } from './role.seeder';

export const DEMO_ADMIN_EMAIL = 'admin@admin.com';
export const DEMO_ADMIN_PASSWORD = 'Admin@123';

export const DEMO_MERCHANT1_EMAIL = 'merchant1@admin.com';
export const DEMO_MERCHANT1_PASSWORD = 'Merchant@123';

export const DEMO_MERCHANT2_EMAIL = 'merchant2@admin.com';
export const DEMO_MERCHANT2_PASSWORD = 'Merchant@123';

export interface DemoSeedResult {
  adminUserId: number;
  merchant1: { userId: number; merchantId: number };
  merchant2: { userId: number; merchantId: number };
}

async function ensureUser(
  userRepository: UserRepository,
  params: { email: string; password: string; fullName: string; roleId: number; isActive?: boolean },
): Promise<UserOrmEntity> {
  const existing = await userRepository.findOneBy({ email: params.email });
  if (existing) {
    console.log(`User "${params.email}" already exists.`);
    return existing;
  }

  const passwordHash = await hashPassword(params.password);
  const created = await userRepository.create({
    email: params.email,
    passwordHash,
    fullName: params.fullName,
    roleId: params.roleId,
    isActive: params.isActive ?? true,
  } as Partial<UserOrmEntity>);

  console.log(`User "${params.email}" created (password: ${params.password}).`);
  return created;
}

async function ensureMerchant(
  merchantRepository: MerchantRepository,
  params: {
    ownerUserId: number;
    shopName: string;
    contactPhone?: string | null;
    contactEmail?: string | null;
    shopAddress?: string | null;
    defaultCurrency?: 'THB' | 'USD' | 'LAK';
    isActive?: boolean;
  },
): Promise<MerchantOrmEntity> {
  const existing = await merchantRepository.findOneByOwnerUserId(params.ownerUserId);
  if (existing) {
    console.log(`Merchant for ownerUserId=${params.ownerUserId} already exists.`);
    return existing;
  }

  const created = await merchantRepository.create({
    ownerUserId: params.ownerUserId,
    shopName: params.shopName,
    shopLogoUrl: null,
    shopAddress: params.shopAddress ?? null,
    contactPhone: params.contactPhone ?? null,
    contactEmail: params.contactEmail ?? null,
    contactFacebook: null,
    contactLine: null,
    contactWhatsapp: null,
    defaultCurrency: params.defaultCurrency ?? 'LAK',
    isActive: params.isActive ?? true,
  } as Partial<MerchantOrmEntity>);

  console.log(`Merchant "${params.shopName}" created (ownerUserId=${params.ownerUserId}).`);
  return created;
}

async function ensureCustomer(
  customerRepository: CustomerRepository,
  params: {
    uniqueToken: string;
    merchantId: number;
    customerName: string;
    customerType: 'CUSTOMER' | 'AGENT';
    contactPhone?: string | null;
    preferredContactMethod?: 'PHONE' | 'FACEBOOK' | 'WHATSAPP' | 'LINE' | null;
    shippingAddress?: string | null;
    isActive?: boolean;
  },
): Promise<CustomerOrmEntity> {
  const existing = await customerRepository.findOneBy({ uniqueToken: params.uniqueToken });
  if (existing) {
    console.log(`Customer token "${params.uniqueToken}" already exists.`);
    return existing;
  }

  const created = await customerRepository.create({
    merchant: { id: params.merchantId } as any,
    customerName: params.customerName,
    customerType: params.customerType,
    shippingAddress: params.shippingAddress ?? null,
    shippingProvider: null,
    shippingSource: null,
    shippingDestination: null,
    paymentTerms: null,
    contactPhone: params.contactPhone ?? null,
    contactFacebook: null,
    contactWhatsapp: null,
    contactLine: null,
    preferredContactMethod: params.preferredContactMethod ?? null,
    uniqueToken: params.uniqueToken,
    isActive: params.isActive ?? true,
  } as Partial<CustomerOrmEntity>);

  console.log(
    `Customer "${params.customerName}" created (merchantId=${params.merchantId}, token=${params.uniqueToken}).`,
  );
  return created;
}

/**
 * Seed demo data for testing:
 * - 1 admin user
 * - 2 merchants (with owner users)
 * - customers for each merchant
 */
export async function runDemoDataSeeder(
  userRepository: UserRepository,
  merchantRepository: MerchantRepository,
  customerRepository: CustomerRepository,
  roles: SeededRoles,
): Promise<DemoSeedResult> {
  // 1) Admin user
  const adminUser = await ensureUser(userRepository, {
    email: DEMO_ADMIN_EMAIL,
    password: DEMO_ADMIN_PASSWORD,
    fullName: 'Admin',
    roleId: roles.admin.id,
  });

  // 2) Merchant 1 (owner user + merchant)
  const merchant1Owner = await ensureUser(userRepository, {
    email: DEMO_MERCHANT1_EMAIL,
    password: DEMO_MERCHANT1_PASSWORD,
    fullName: 'Merchant One',
    roleId: roles.admin_merchant.id,
  });
  const merchant1 = await ensureMerchant(merchantRepository, {
    ownerUserId: merchant1Owner.id,
    shopName: 'ຮ້ານທົດລອງ 1 / ร้านทดสอบ 1',
    contactPhone: '02012345678',
    contactEmail: DEMO_MERCHANT1_EMAIL,
    shopAddress: 'Vientiane / กรุงเทพฯ',
    defaultCurrency: 'LAK',
  });

  // 3) Merchant 2
  const merchant2Owner = await ensureUser(userRepository, {
    email: DEMO_MERCHANT2_EMAIL,
    password: DEMO_MERCHANT2_PASSWORD,
    fullName: 'Merchant Two',
    roleId: roles.admin_merchant.id,
  });
  const merchant2 = await ensureMerchant(merchantRepository, {
    ownerUserId: merchant2Owner.id,
    shopName: 'Demo Shop 2',
    contactPhone: '02087654321',
    contactEmail: DEMO_MERCHANT2_EMAIL,
    shopAddress: 'Luang Prabang / เชียงใหม่',
    defaultCurrency: 'THB',
  });

  // 4) Customers for merchant 1
  await ensureCustomer(customerRepository, {
    uniqueToken: 'demo-m1-c1',
    merchantId: merchant1.id,
    customerName: 'ນາງ ພອນພິມ (Khun Pornpim)',
    customerType: 'CUSTOMER',
    contactPhone: '02011112222',
    preferredContactMethod: 'PHONE',
    shippingAddress: 'ວຽງຈັນ / Vientiane',
  });
  await ensureCustomer(customerRepository, {
    uniqueToken: 'demo-m1-c2',
    merchantId: merchant1.id,
    customerName: 'คุณสมชาย',
    customerType: 'CUSTOMER',
    contactPhone: '0812345678',
    preferredContactMethod: 'PHONE',
    shippingAddress: 'กรุงเทพฯ',
  });
  await ensureCustomer(customerRepository, {
    uniqueToken: 'demo-m1-a1',
    merchantId: merchant1.id,
    customerName: 'Agent Suda',
    customerType: 'AGENT',
    contactPhone: '0899999999',
    preferredContactMethod: 'WHATSAPP',
    shippingAddress: 'เชียงราย',
  });

  // 5) Customers for merchant 2
  await ensureCustomer(customerRepository, {
    uniqueToken: 'demo-m2-c1',
    merchantId: merchant2.id,
    customerName: 'ທ້າວ ວິໄລ (Vilay)',
    customerType: 'CUSTOMER',
    contactPhone: '02033334444',
    preferredContactMethod: 'LINE',
    shippingAddress: 'ຫຼວງພຣະບາງ',
  });
  await ensureCustomer(customerRepository, {
    uniqueToken: 'demo-m2-c2',
    merchantId: merchant2.id,
    customerName: 'คุณอรทัย',
    customerType: 'CUSTOMER',
    contactPhone: '0822222222',
    preferredContactMethod: 'PHONE',
    shippingAddress: 'เชียงใหม่',
  });

  return {
    adminUserId: adminUser.id,
    merchant1: { userId: merchant1Owner.id, merchantId: merchant1.id },
    merchant2: { userId: merchant2Owner.id, merchantId: merchant2.id },
  };
}

