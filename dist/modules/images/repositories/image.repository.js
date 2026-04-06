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
exports.ImageRepository = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const base_repository_1 = require("../../../common/base/repositories/base.repository");
const image_orm_entity_1 = require("../entities/image.orm-entity");
let ImageRepository = class ImageRepository extends base_repository_1.BaseRepository {
    constructor(repository) {
        super(repository);
    }
    async findByFileKey(fileKey) {
        return this.repository.findOne({
            where: { fileKey },
            relations: ['merchant', 'uploadedByUser'],
        });
    }
    async findByMerchant(merchantId) {
        return this.repository.find({
            where: { merchant: { id: merchantId } },
            relations: ['merchant', 'uploadedByUser'],
            order: { createdAt: 'DESC' },
        });
    }
    async findByUploadedBy(userId) {
        return this.repository.find({
            where: { uploadedByUser: { id: userId } },
            relations: ['merchant', 'uploadedByUser'],
            order: { createdAt: 'DESC' },
        });
    }
    async findByMimeType(mimeType) {
        return this.repository.find({
            where: { mimeType },
            relations: ['merchant', 'uploadedByUser'],
            order: { createdAt: 'DESC' },
        });
    }
    async findByTags(tags) {
        return this.repository
            .createQueryBuilder('image')
            .where('image.tags && :tags', { tags })
            .leftJoinAndSelect('image.merchant', 'merchant')
            .leftJoinAndSelect('image.uploadedByUser', 'uploadedByUser')
            .orderBy('image.createdAt', 'DESC')
            .getMany();
    }
    async findActive() {
        return this.repository.find({
            where: { isActive: true },
            relations: ['merchant', 'uploadedByUser'],
            order: { createdAt: 'DESC' },
        });
    }
};
exports.ImageRepository = ImageRepository;
exports.ImageRepository = ImageRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(image_orm_entity_1.ImageOrmEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], ImageRepository);
//# sourceMappingURL=image.repository.js.map