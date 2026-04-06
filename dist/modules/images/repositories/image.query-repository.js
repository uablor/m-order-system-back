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
exports.ImageQueryRepository = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const base_query_repository_1 = require("../../../common/base/repositories/base.query-repository");
const image_orm_entity_1 = require("../entities/image.orm-entity");
const pagination_util_1 = require("../../../common/utils/pagination.util");
const base_query_enum_1 = require("../../../common/base/enums/base.query.enum");
let ImageQueryRepository = class ImageQueryRepository extends base_query_repository_1.BaseQueryRepository {
    constructor(repository) {
        super(repository);
    }
    async findWithPagination(options, manager) {
        const repo = this.getRepo(manager);
        const qb = repo
            .createQueryBuilder('image')
            .leftJoinAndSelect('image.merchant', 'merchant')
            .leftJoinAndSelect('image.uploadedByUser', 'uploadedByUser');
        if (options.merchantId != null) {
            qb.andWhere('merchant.id = :merchantId', { merchantId: options.merchantId });
        }
        if (options.uploadedByUserId != null) {
            qb.andWhere('uploadedByUser.id = :uploadedByUserId', { uploadedByUserId: options.uploadedByUserId });
        }
        if (options.mimeType != null) {
            qb.andWhere('image.mimeType = :mimeType', { mimeType: options.mimeType });
        }
        if (options.tags != null && options.tags.length > 0) {
            qb.andWhere('image.tags && :tags', { tags: options.tags });
        }
        if (options.isActive !== undefined) {
            qb.andWhere('image.isActive = :isActive', { isActive: options.isActive });
        }
        if (options.minFileSize != null) {
            qb.andWhere('image.fileSize >= :minFileSize', { minFileSize: options.minFileSize });
        }
        if (options.maxFileSize != null) {
            qb.andWhere('image.fileSize <= :maxFileSize', { maxFileSize: options.maxFileSize });
        }
        if (options.search) {
            qb.andWhere('(image.originalName ILIKE :search OR image.description ILIKE :search)', { search: `%${options.search}%` });
        }
        return (0, pagination_util_1.fetchWithPagination)({
            qb,
            page: options.page ?? 1,
            limit: options.limit ?? 10,
            manager: manager || repo.manager,
            sort: options.sort || base_query_enum_1.SortDirection.DESC,
            search: options.search ? { kw: options.search, field: 'image.originalName' } : undefined,
        });
    }
    async findByIdWithRelations(id, manager) {
        return this.getRepo(manager).findOne({
            where: { id },
            relations: ['merchant', 'uploadedByUser'],
        });
    }
    async findByFileKeyWithRelations(fileKey, manager) {
        return this.getRepo(manager).findOne({
            where: { fileKey },
            relations: ['merchant', 'uploadedByUser'],
        });
    }
};
exports.ImageQueryRepository = ImageQueryRepository;
exports.ImageQueryRepository = ImageQueryRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(image_orm_entity_1.ImageOrmEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], ImageQueryRepository);
//# sourceMappingURL=image.query-repository.js.map