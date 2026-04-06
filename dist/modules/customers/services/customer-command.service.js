"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomerCommandService = void 0;
const common_1 = require("@nestjs/common");
const transaction_service_1 = require("../../../common/transaction/transaction.service");
const customer_repository_1 = require("../repositories/customer.repository");
const merchant_repository_1 = require("../../merchants/repositories/merchant.repository");
const generate_unique_token_utils_1 = require("../../../common/utils/generate-unique-token.utils");
let CustomerCommandService = class CustomerCommandService {
    customerRepository;
    merchantRepository;
    transactionService;
    constructor(customerRepository, merchantRepository, transactionService) {
        this.customerRepository = customerRepository;
        this.merchantRepository = merchantRepository;
        this.transactionService = transactionService;
    }
    async create(dto) {
        return this.transactionService.run(async (manager) => {
            const merchant = await this.merchantRepository.findOneById(dto.merchantId, manager);
            if (!merchant) {
                throw new common_1.NotFoundException('Merchant not found');
            }
            let uniqueToken = dto.uniqueToken ?? (0, generate_unique_token_utils_1.generateUniqueToken)();
            if (dto.uniqueToken) {
                const existingByToken = await this.customerRepository.findOneBy({ uniqueToken }, manager);
                if (existingByToken) {
                    throw new common_1.ConflictException('Unique token already exists');
                }
            }
            else {
                let exists = await this.customerRepository.findOneBy({ uniqueToken }, manager);
                while (exists) {
                    uniqueToken = (0, generate_unique_token_utils_1.generateUniqueToken)();
                    exists = await this.customerRepository.findOneBy({ uniqueToken }, manager);
                }
            }
            const entity = await this.customerRepository.create({
                merchant,
                customerName: dto.customerName,
                customerType: dto.customerType,
                shippingAddress: dto.shippingAddress ?? null,
                shippingProvider: dto.shippingProvider ?? null,
                shippingSource: dto.shippingSource ?? null,
                shippingDestination: dto.shippingDestination ?? null,
                paymentTerms: dto.paymentTerms ?? null,
                contactPhone: dto.contactPhone ?? null,
                contactFacebook: dto.contactFacebook ?? null,
                contactWhatsapp: dto.contactWhatsapp ?? null,
                contactLine: dto.contactLine ?? null,
                preferredContactMethod: dto.preferredContactMethod ?? null,
                uniqueToken,
                isActive: dto.isActive ?? true,
            }, manager);
            return { id: entity.id };
        });
    }
    async update(id, dto) {
        await this.transactionService.run(async (manager) => {
            const existing = await this.customerRepository.findOneById(id, manager);
            if (!existing) {
                throw new common_1.NotFoundException('Customer not found');
            }
            if (dto.uniqueToken !== undefined) {
                const duplicate = await this.customerRepository.findOneBy({ uniqueToken: dto.uniqueToken }, manager);
                if (duplicate && duplicate.id !== id) {
                    throw new common_1.ConflictException('Unique token already in use');
                }
            }
            const updateData = {
                ...(dto.customerName !== undefined && { customerName: dto.customerName }),
                ...(dto.customerType !== undefined && { customerType: dto.customerType }),
                ...(dto.shippingAddress !== undefined && { shippingAddress: dto.shippingAddress }),
                ...(dto.shippingProvider !== undefined && { shippingProvider: dto.shippingProvider }),
                ...(dto.shippingSource !== undefined && { shippingSource: dto.shippingSource }),
                ...(dto.shippingDestination !== undefined && { shippingDestination: dto.shippingDestination }),
                ...(dto.paymentTerms !== undefined && { paymentTerms: dto.paymentTerms }),
                ...(dto.contactPhone !== undefined && { contactPhone: dto.contactPhone }),
                ...(dto.contactFacebook !== undefined && { contactFacebook: dto.contactFacebook }),
                ...(dto.contactWhatsapp !== undefined && { contactWhatsapp: dto.contactWhatsapp }),
                ...(dto.contactLine !== undefined && { contactLine: dto.contactLine }),
                ...(dto.preferredContactMethod !== undefined && { preferredContactMethod: dto.preferredContactMethod }),
                ...(dto.uniqueToken !== undefined && { uniqueToken: dto.uniqueToken }),
                ...(dto.isActive !== undefined && { isActive: dto.isActive }),
            };
            await this.customerRepository.update(id, updateData, manager);
        });
    }
    async delete(id) {
        await this.transactionService.run(async (manager) => {
            const found = await this.customerRepository.findOneById(id, manager);
            if (!found) {
                throw new common_1.NotFoundException('Customer not found');
            }
            await this.customerRepository.delete(id, manager);
        });
    }
};
exports.CustomerCommandService = CustomerCommandService;
exports.CustomerCommandService = CustomerCommandService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [customer_repository_1.CustomerRepository,
        merchant_repository_1.MerchantRepository,
        transaction_service_1.TransactionService])
], CustomerCommandService);
//# sourceMappingURL=customer-command.service.js.map