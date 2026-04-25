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
exports.MerchantCommandService = void 0;
const common_1 = require("@nestjs/common");
const transaction_service_1 = require("../../../common/transaction/transaction.service");
const merchant_repository_1 = require("../repositories/merchant.repository");
const image_query_repository_1 = require("../../images/repositories/image.query-repository");
let MerchantCommandService = class MerchantCommandService {
    merchantRepository;
    transactionService;
    imageQueryRepository;
    constructor(merchantRepository, transactionService, imageQueryRepository) {
        this.merchantRepository = merchantRepository;
        this.transactionService = transactionService;
        this.imageQueryRepository = imageQueryRepository;
    }
    async create(ownerUserId, dto) {
        return this.transactionService.run(async (manager) => {
            let image = null;
            if (dto.shopLogoUrl) {
                image = await this.imageQueryRepository.findByIdWithRelations(Number(dto.shopLogoUrl));
                if (!image) {
                    throw new common_1.NotFoundException('Image not found');
                }
            }
            const entity = await this.merchantRepository.create({
                ownerUserId,
                shopName: dto.shopName,
                shopLogoUrlId: dto.shopLogoUrl ? Number(dto.shopLogoUrl) : null,
                shopLogoUrl: image ? image : null,
                shopAddress: dto.shopAddress ?? null,
                contactPhone: dto.contactPhone ?? null,
                contactEmail: dto.contactEmail ?? null,
                contactFacebook: dto.contactFacebook ?? null,
                contactLine: dto.contactLine ?? null,
                contactWhatsapp: dto.contactWhatsapp ?? null,
                defaultCurrency: dto.defaultCurrency ?? 'THB',
                isActive: dto.isActive ?? true,
            }, manager);
            return { id: entity.id };
        });
    }
    async update(id, dto) {
        await this.transactionService.run(async (manager) => {
            const existing = await this.merchantRepository.findOneById(id, manager);
            if (!existing) {
                throw new common_1.NotFoundException('Merchant not found');
            }
            let image = null;
            if (dto.shopLogoUrl) {
                image = await this.imageQueryRepository.findByIdWithRelations(Number(dto.shopLogoUrl));
                if (!image) {
                    throw new common_1.NotFoundException('Image not found');
                }
            }
            const updateData = {
                ...(dto.shopName !== undefined && { shopName: dto.shopName }),
                ...(dto.shopLogoUrl !== undefined && { shopLogoUrlId: dto.shopLogoUrl ? Number(dto.shopLogoUrl) : null }),
                ...(dto.shopAddress !== undefined && { shopAddress: dto.shopAddress }),
                ...(dto.contactPhone !== undefined && { contactPhone: dto.contactPhone }),
                ...(dto.contactEmail !== undefined && { contactEmail: dto.contactEmail }),
                ...(dto.contactFacebook !== undefined && { contactFacebook: dto.contactFacebook }),
                ...(dto.contactLine !== undefined && { contactLine: dto.contactLine }),
                ...(dto.contactWhatsapp !== undefined && { contactWhatsapp: dto.contactWhatsapp }),
                ...(dto.defaultCurrency !== undefined && { defaultCurrency: dto.defaultCurrency }),
                ...(dto.isActive !== undefined && { isActive: dto.isActive }),
            };
            await this.merchantRepository.update(id, updateData, manager);
        });
    }
    async updateActive(id, dto) {
        await this.transactionService.run(async (manager) => {
            const existing = await this.merchantRepository.findOneById(id, manager);
            if (!existing) {
                throw new common_1.NotFoundException('Merchant not found');
            }
            const isActive = dto.isActive ?? true;
            await this.merchantRepository.setActive(id, isActive, manager);
        });
    }
    async delete(id) {
        await this.transactionService.run(async (manager) => {
            const found = await this.merchantRepository.findOneById(id, manager);
            if (!found) {
                throw new common_1.NotFoundException('Merchant not found');
            }
            await this.merchantRepository.delete(id, manager);
        });
    }
};
exports.MerchantCommandService = MerchantCommandService;
exports.MerchantCommandService = MerchantCommandService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [merchant_repository_1.MerchantRepository,
        transaction_service_1.TransactionService,
        image_query_repository_1.ImageQueryRepository])
], MerchantCommandService);
//# sourceMappingURL=merchant-command.service.js.map