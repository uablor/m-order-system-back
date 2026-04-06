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
exports.PermissionCommandService = void 0;
const common_1 = require("@nestjs/common");
const transaction_service_1 = require("../../../common/transaction/transaction.service");
const permission_repository_1 = require("../repositories/permission.repository");
let PermissionCommandService = class PermissionCommandService {
    permissionRepository;
    transactionService;
    constructor(permissionRepository, transactionService) {
        this.permissionRepository = permissionRepository;
        this.transactionService = transactionService;
    }
    async create(dto) {
        return this.transactionService.run(async (manager) => {
            const existing = await this.permissionRepository.findOneBy({ permissionCode: dto.permissionCode }, manager);
            if (existing) {
                throw new common_1.ConflictException('Permission with this code already exists');
            }
            const entity = await this.permissionRepository.create({
                permissionCode: dto.permissionCode,
                description: dto.description ?? null,
            }, manager);
            return { id: entity.id };
        });
    }
    async update(id, dto) {
        await this.transactionService.run(async (manager) => {
            const existing = await this.permissionRepository.findOneById(id, manager);
            if (!existing) {
                throw new common_1.NotFoundException('Permission not found');
            }
            if (dto.permissionCode !== undefined) {
                const duplicate = await this.permissionRepository.findOneBy({ permissionCode: dto.permissionCode }, manager);
                if (duplicate && duplicate.id !== id) {
                    throw new common_1.ConflictException('Permission with this code already exists');
                }
            }
            await this.permissionRepository.update(id, {
                ...(dto.permissionCode !== undefined && { permissionCode: dto.permissionCode }),
                ...(dto.description !== undefined && { description: dto.description }),
            }, manager);
        });
    }
    async delete(id) {
        await this.transactionService.run(async (manager) => {
            const found = await this.permissionRepository.findOneById(id, manager);
            if (!found) {
                throw new common_1.NotFoundException('Permission not found');
            }
            await this.permissionRepository.delete(id, manager);
        });
    }
};
exports.PermissionCommandService = PermissionCommandService;
exports.PermissionCommandService = PermissionCommandService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [permission_repository_1.PermissionRepository,
        transaction_service_1.TransactionService])
], PermissionCommandService);
//# sourceMappingURL=permission-command.service.js.map