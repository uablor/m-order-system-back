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
exports.RoleCommandService = void 0;
const common_1 = require("@nestjs/common");
const transaction_service_1 = require("../../../common/transaction/transaction.service");
const role_repository_1 = require("../repositories/role.repository");
let RoleCommandService = class RoleCommandService {
    roleRepository;
    transactionService;
    constructor(roleRepository, transactionService) {
        this.roleRepository = roleRepository;
        this.transactionService = transactionService;
    }
    async create(dto) {
        return this.transactionService.run(async (manager) => {
            const existing = await this.roleRepository.findOneBy({ roleName: dto.roleName }, manager);
            if (existing) {
                throw new common_1.ConflictException('Role with this name already exists');
            }
            const entity = await this.roleRepository.create({
                roleName: dto.roleName,
                description: dto.description ?? null,
            }, manager);
            return { id: entity.id };
        });
    }
    async update(id, dto) {
        await this.transactionService.run(async (manager) => {
            const existing = await this.roleRepository.findOneById(id, manager);
            if (!existing) {
                throw new common_1.NotFoundException('Role not found');
            }
            if (dto.roleName !== undefined) {
                const duplicate = await this.roleRepository.findOneBy({ roleName: dto.roleName }, manager);
                if (duplicate && duplicate.id !== id) {
                    throw new common_1.ConflictException('Role with this name already exists');
                }
            }
            await this.roleRepository.update(id, {
                ...(dto.roleName !== undefined && { roleName: dto.roleName }),
                ...(dto.description !== undefined && { description: dto.description }),
            }, manager);
        });
    }
    async delete(id) {
        await this.transactionService.run(async (manager) => {
            const found = await this.roleRepository.findOneById(id, manager);
            if (!found) {
                throw new common_1.NotFoundException('Role not found');
            }
            await this.roleRepository.delete(id, manager);
        });
    }
};
exports.RoleCommandService = RoleCommandService;
exports.RoleCommandService = RoleCommandService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [role_repository_1.RoleRepository,
        transaction_service_1.TransactionService])
], RoleCommandService);
//# sourceMappingURL=role-command.service.js.map