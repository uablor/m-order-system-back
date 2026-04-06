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
exports.ImageOrmEntity = void 0;
const typeorm_1 = require("typeorm");
const base_orm_entities_1 = require("../../../common/base/enities/base.orm-entities");
const merchant_orm_entity_1 = require("../../merchants/entities/merchant.orm-entity");
const user_orm_entity_1 = require("../../users/entities/user.orm-entity");
let ImageOrmEntity = class ImageOrmEntity extends base_orm_entities_1.BaseOrmEntity {
    merchant;
    uploadedByUser;
    originalName;
    fileName;
    filePath;
    fileKey;
    fileSize;
    mimeType;
    publicUrl;
    isActive;
    tags;
    description;
};
exports.ImageOrmEntity = ImageOrmEntity;
__decorate([
    (0, typeorm_1.ManyToOne)(() => merchant_orm_entity_1.MerchantOrmEntity, { onDelete: 'CASCADE', nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'merchant_id' }),
    __metadata("design:type", merchant_orm_entity_1.MerchantOrmEntity)
], ImageOrmEntity.prototype, "merchant", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_orm_entity_1.UserOrmEntity, { onDelete: 'SET NULL', nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'uploaded_by' }),
    __metadata("design:type", Object)
], ImageOrmEntity.prototype, "uploadedByUser", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'original_name', type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], ImageOrmEntity.prototype, "originalName", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'file_name', type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], ImageOrmEntity.prototype, "fileName", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'file_path', type: 'varchar', length: 500 }),
    __metadata("design:type", String)
], ImageOrmEntity.prototype, "filePath", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'file_key', type: 'varchar', length: 500, unique: true }),
    __metadata("design:type", String)
], ImageOrmEntity.prototype, "fileKey", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'file_size', type: 'bigint' }),
    __metadata("design:type", Number)
], ImageOrmEntity.prototype, "fileSize", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'mime_type', type: 'varchar', length: 100 }),
    __metadata("design:type", String)
], ImageOrmEntity.prototype, "mimeType", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'public_url', type: 'varchar', length: 500, nullable: true }),
    __metadata("design:type", Object)
], ImageOrmEntity.prototype, "publicUrl", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_active', type: 'boolean', default: true }),
    __metadata("design:type", Boolean)
], ImageOrmEntity.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'tags', type: 'json', nullable: true }),
    __metadata("design:type", Object)
], ImageOrmEntity.prototype, "tags", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'description', type: 'text', nullable: true }),
    __metadata("design:type", Object)
], ImageOrmEntity.prototype, "description", void 0);
exports.ImageOrmEntity = ImageOrmEntity = __decorate([
    (0, typeorm_1.Entity)('images')
], ImageOrmEntity);
//# sourceMappingURL=image.orm-entity.js.map