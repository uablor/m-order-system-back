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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MerchantRepository = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const merchant_orm_entity_1 = require("../entities/merchant.orm-entity");
let MerchantRepository = class MerchantRepository {
    repository;
    constructor(repository) {
        this.repository = repository;
    }
    getRepo(manager) {
        return manager
            ? manager.getRepository(merchant_orm_entity_1.MerchantOrmEntity)
            : this.repository;
    }
    async create(data, manager) {
        const repo = this.getRepo(manager);
        const entity = repo.create(data);
        return repo.save(entity);
    }
    async update(id, data, manager) {
        const repo = this.getRepo(manager);
        await repo.update({ id }, data);
        return repo.findOne({ where: { id } });
    }
    async delete(id, manager) {
        const repo = this.getRepo(manager);
        const result = await repo.delete({ id });
        return (result.affected ?? 0) > 0;
    }
    async findOneById(id, manager) {
        return this.getRepo(manager).findOne({ where: { id } });
    }
    async findOneByOwnerUserId(ownerUserId, manager) {
        return this.getRepo(manager).findOne({ where: { ownerUserId } });
    }
    async setActive(id, isActive, manager) {
        const repo = this.getRepo(manager);
        await repo.update({ id }, { isActive });
    }
};
exports.MerchantRepository = MerchantRepository;
exports.MerchantRepository = MerchantRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(merchant_orm_entity_1.MerchantOrmEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], MerchantRepository);
//# sourceMappingURL=merchant.repository.js.map