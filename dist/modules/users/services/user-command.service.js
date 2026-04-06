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
exports.UserCommandService = void 0;
const common_1 = require("@nestjs/common");
const password_util_1 = require("../../../common/utils/password.util");
const transaction_service_1 = require("../../../common/transaction/transaction.service");
const user_repository_1 = require("../repositories/user.repository");
const role_repository_1 = require("../../roles/repositories/role.repository");
const merchant_repository_1 = require("../../merchants/repositories/merchant.repository");
const role_seeder_1 = require("../../../database/seeds/role.seeder");
const image_query_repository_1 = require("../../images/repositories/image.query-repository");
let UserCommandService = class UserCommandService {
    userRepository;
    roleRepository;
    merchantRepository;
    transactionService;
    imageQueryRepository;
    constructor(userRepository, roleRepository, merchantRepository, transactionService, imageQueryRepository) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.merchantRepository = merchantRepository;
        this.transactionService = transactionService;
        this.imageQueryRepository = imageQueryRepository;
    }
    async create(dto, auth) {
        return this.transactionService.run(async (manager) => {
            const existing = await this.userRepository.findOneBy({ email: dto.email }, manager);
            if (existing) {
                throw new common_1.ConflictException('User with this email already exists');
            }
            const passwordHash = await (0, password_util_1.hashPassword)(dto.password);
            const roleName = auth?.merchantId
                ? role_seeder_1.EMPLOYEE_MERCHANT_ROLE_NAME
                : role_seeder_1.ADMIN_ROLE_NAME;
            const role = await this.roleRepository.findOneBy({ roleName }, manager);
            if (!role) {
                throw new common_1.NotFoundException('Role not found');
            }
            const entity = await this.userRepository.create({
                email: dto.email,
                passwordHash,
                fullName: dto.fullName,
                roleId: role.id,
                role,
                isActive: dto.isActive ?? true,
                ...(auth?.merchantId && { merchantId: auth.merchantId }),
            }, manager);
            return { id: entity.id };
        });
    }
    async createUserWithMerchant(dto) {
        return this.transactionService.run(async (manager) => {
            const existing = await this.userRepository.findOneBy({ email: dto.email }, manager);
            if (existing) {
                throw new common_1.ConflictException('User with this email already exists');
            }
            let shopLogoUrl = null;
            if (dto.shopLogoUrl) {
                shopLogoUrl = await this.imageQueryRepository.findByIdWithRelations(Number(dto.shopLogoUrl), manager);
                if (!shopLogoUrl) {
                    throw new common_1.NotFoundException('Image not found');
                }
            }
            const passwordHash = await (0, password_util_1.hashPassword)(dto.password);
            const role = await this.roleRepository.findOneBy({ roleName: role_seeder_1.ADMIN_MERCHANT_ROLE_NAME }, manager);
            if (!role) {
                throw new common_1.NotFoundException('Role not found');
            }
            const userEntity = await this.userRepository.create({
                email: dto.email,
                passwordHash,
                fullName: dto.fullName,
                roleId: role.id,
                role,
            }, manager);
            const merchantEntity = await this.merchantRepository.create({
                ownerUserId: userEntity.id,
                shopName: dto.shopName ?? userEntity.fullName ?? '',
                shopLogoUrlId: dto.shopLogoUrl ? Number(dto.shopLogoUrl) : null,
                shopLogoUrl: shopLogoUrl ? shopLogoUrl : null,
                shopAddress: dto.shopAddress ?? null,
                contactPhone: dto.contactPhone ?? null,
                contactEmail: dto.contactEmail ?? null,
                contactFacebook: dto.contactFacebook ?? null,
                contactLine: dto.contactLine ?? null,
                contactWhatsapp: dto.contactWhatsapp ?? null,
                defaultCurrency: dto.defaultCurrency ?? 'LAK',
                isActive: true,
            }, manager);
            await this.userRepository.update(userEntity.id, {
                merchantId: merchantEntity.id,
                merchant: merchantEntity,
            }, manager);
            return {
                userId: userEntity.id,
                merchantId: merchantEntity.id,
            };
        });
    }
    async update(id, dto, currentUser) {
        await this.transactionService.run(async (manager) => {
            const existing = await this.userRepository.findOneById(id, manager, {
                relations: ['role'],
            });
            if (!existing) {
                throw new common_1.NotFoundException('User not found');
            }
            if (dto.email !== undefined) {
                const duplicate = await this.userRepository.findOneBy({ email: dto.email }, manager, { relations: ['role'] });
                if (duplicate && duplicate.id !== id) {
                    throw new common_1.ConflictException('User with this email already exists');
                }
            }
            if (dto.roleId !== undefined) {
                const role = await this.roleRepository.findOneById(dto.roleId, manager);
                if (!role)
                    throw new common_1.NotFoundException('Role not found');
            }
            const updateData = {
                ...(dto.email !== undefined && { email: dto.email }),
                ...(dto.fullName !== undefined && { fullName: dto.fullName }),
                ...(dto.roleId !== undefined && { roleId: dto.roleId }),
                ...(dto.isActive !== undefined && { isActive: dto.isActive }),
            };
            await this.userRepository.update(id, updateData, manager);
        });
    }
    async delete(id) {
        await this.transactionService.run(async (manager) => {
            const found = await this.userRepository.findOneById(id, manager, {
                relations: ['role', 'merchant'],
            });
            if (!found) {
                throw new common_1.NotFoundException('User not found');
            }
            if (found.role?.roleName === role_seeder_1.SUPERADMIN_ROLE_NAME) {
                throw new common_1.ForbiddenException('Cannot delete a superadmin user');
            }
            const ownedMerchant = await this.merchantRepository.findOneByOwnerUserId(found.id, manager);
            if (ownedMerchant) {
                throw new common_1.ConflictException('Cannot delete user who owns a merchant. Remove or reassign the merchant first.');
            }
            await this.userRepository.delete(id, manager);
        });
    }
    async setActive(id, dto) {
        await this.update(id, { isActive: dto.isActive });
    }
    async changePassword(id, dto) {
        await this.transactionService.run(async (manager) => {
            const found = await this.userRepository.findOneById(id, manager, {
                relations: ['role', 'merchant'],
            });
            if (!found)
                throw new common_1.NotFoundException('User not found');
            const match = await (0, password_util_1.comparePassword)(dto.currentPassword, found.passwordHash);
            if (!match)
                throw new common_1.BadRequestException('Invalid current password');
            found.passwordHash = await (0, password_util_1.hashPassword)(dto.password);
            await this.userRepository.update(id, found, manager);
        });
    }
};
exports.UserCommandService = UserCommandService;
exports.UserCommandService = UserCommandService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [user_repository_1.UserRepository,
        role_repository_1.RoleRepository,
        merchant_repository_1.MerchantRepository,
        transaction_service_1.TransactionService,
        image_query_repository_1.ImageQueryRepository])
], UserCommandService);
//# sourceMappingURL=user-command.service.js.map