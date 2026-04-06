"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEMO_MERCHANT2_PASSWORD = exports.DEMO_MERCHANT2_EMAIL = exports.DEMO_MERCHANT1_PASSWORD = exports.DEMO_MERCHANT1_EMAIL = exports.DEMO_ADMIN_PASSWORD = exports.DEMO_ADMIN_EMAIL = void 0;
exports.runDemoDataSeeder = runDemoDataSeeder;
const password_util_1 = require("../../common/utils/password.util");
exports.DEMO_ADMIN_EMAIL = 'admin@admin.com';
exports.DEMO_ADMIN_PASSWORD = 'Admin@123';
exports.DEMO_MERCHANT1_EMAIL = 'merchant1@admin.com';
exports.DEMO_MERCHANT1_PASSWORD = 'Merchant@123';
exports.DEMO_MERCHANT2_EMAIL = 'merchant2@admin.com';
exports.DEMO_MERCHANT2_PASSWORD = 'Merchant@123';
async function ensureUser(userRepository, params) {
    const existing = await userRepository.findOneBy({ email: params.email });
    if (existing) {
        console.log(`User "${params.email}" already exists.`);
        return existing;
    }
    const passwordHash = await (0, password_util_1.hashPassword)(params.password);
    const created = await userRepository.create({
        email: params.email,
        passwordHash,
        fullName: params.fullName,
        roleId: params.roleId,
        isActive: params.isActive ?? true,
    });
    console.log(`User "${params.email}" created (password: ${params.password}).`);
    return created;
}
async function ensureMerchant(merchantRepository, params) {
    const existing = await merchantRepository.findOneByOwnerUserId(params.ownerUserId);
    if (existing) {
        console.log(`Merchant for ownerUserId=${params.ownerUserId} already exists.`);
        return existing;
    }
    const created = await merchantRepository.create({
        ownerUserId: params.ownerUserId,
        shopName: params.shopName,
        shopLogoUrl: undefined,
        shopAddress: params.shopAddress ?? null,
        contactPhone: params.contactPhone ?? null,
        contactEmail: params.contactEmail ?? null,
        contactFacebook: null,
        contactLine: null,
        contactWhatsapp: null,
        defaultCurrency: params.defaultCurrency ?? 'LAK',
        isActive: params.isActive ?? true,
    });
    console.log(`Merchant "${params.shopName}" created (ownerUserId=${params.ownerUserId}).`);
    return created;
}
async function ensureCustomer(customerRepository, params) {
    const existing = await customerRepository.findOneBy({ uniqueToken: params.uniqueToken });
    if (existing) {
        console.log(`Customer token "${params.uniqueToken}" already exists.`);
        return existing;
    }
    const created = await customerRepository.create({
        merchant: { id: params.merchantId },
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
    });
    console.log(`Customer "${params.customerName}" created (merchantId=${params.merchantId}, token=${params.uniqueToken}).`);
    return created;
}
async function runDemoDataSeeder(userRepository, merchantRepository, customerRepository, roles) {
    const adminUser = await ensureUser(userRepository, {
        email: exports.DEMO_ADMIN_EMAIL,
        password: exports.DEMO_ADMIN_PASSWORD,
        fullName: 'Admin',
        roleId: roles.admin.id,
    });
    const merchant1Owner = await ensureUser(userRepository, {
        email: exports.DEMO_MERCHANT1_EMAIL,
        password: exports.DEMO_MERCHANT1_PASSWORD,
        fullName: 'Merchant One',
        roleId: roles.admin_merchant.id,
    });
    const merchant1 = await ensureMerchant(merchantRepository, {
        ownerUserId: merchant1Owner.id,
        shopName: 'ຮ້ານທົດລອງ 1 / ร้านทดสอบ 1',
        contactPhone: '02012345678',
        contactEmail: exports.DEMO_MERCHANT1_EMAIL,
        shopAddress: 'Vientiane / กรุงเทพฯ',
        defaultCurrency: 'LAK',
    });
    const merchant2Owner = await ensureUser(userRepository, {
        email: exports.DEMO_MERCHANT2_EMAIL,
        password: exports.DEMO_MERCHANT2_PASSWORD,
        fullName: 'Merchant Two',
        roleId: roles.admin_merchant.id,
    });
    const merchant2 = await ensureMerchant(merchantRepository, {
        ownerUserId: merchant2Owner.id,
        shopName: 'Demo Shop 2',
        contactPhone: '02087654321',
        contactEmail: exports.DEMO_MERCHANT2_EMAIL,
        shopAddress: 'Luang Prabang / เชียงใหม่',
        defaultCurrency: 'THB',
    });
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
//# sourceMappingURL=demo-data.seeder.js.map