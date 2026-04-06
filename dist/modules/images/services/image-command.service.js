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
exports.ImageCommandService = void 0;
const common_1 = require("@nestjs/common");
const image_repository_1 = require("../repositories/image.repository");
const image_query_repository_1 = require("../repositories/image.query-repository");
const upload_service_1 = require("./upload.service");
let ImageCommandService = class ImageCommandService {
    imageRepository;
    imageQueryRepository;
    uploadService;
    constructor(imageRepository, imageQueryRepository, uploadService) {
        this.imageRepository = imageRepository;
        this.imageQueryRepository = imageQueryRepository;
        this.uploadService = uploadService;
    }
    async create(createDto, currentUser) {
        const existingImage = await this.imageRepository.findByFileKey(createDto.fileKey);
        if (existingImage) {
            throw new common_1.BadRequestException('Image with this file key already exists');
        }
        const saved = await this.imageRepository.create({
            ...createDto,
            merchant: { id: currentUser.merchantId },
            uploadedByUser: { id: currentUser.userId },
        });
        return this.toResponse(saved);
    }
    async createFromUpload(files, currentUser) {
        const results = [];
        for (const file of files) {
            const createDto = {
                originalName: file.originalname,
                fileName: file.fileName,
                filePath: file.filePath || '',
                fileKey: file.key,
                fileSize: file.size,
                mimeType: file.mimetype,
                publicUrl: file.url || null,
            };
            const saved = await this.imageRepository.create({
                ...createDto,
                merchant: { id: currentUser.merchantId },
                uploadedByUser: { id: currentUser.userId },
            });
            results.push(this.toResponse(saved));
        }
        return results;
    }
    async createFromUploadForCustomer(files, merchantId) {
        const results = [];
        for (const file of files) {
            const createDto = {
                originalName: file.originalname,
                fileName: file.originalname,
                filePath: '',
                fileKey: file.key,
                fileSize: file.size,
                mimeType: file.mimetype,
                publicUrl: file.url ?? undefined,
            };
            const saved = await this.imageRepository.create({
                ...createDto,
                merchant: { id: merchantId },
                uploadedByUser: null,
            });
            results.push(this.toResponse(saved));
        }
        return results;
    }
    async update(id, updateDto) {
        const entity = await this.imageQueryRepository.findByIdWithRelations(id);
        if (!entity) {
            throw new common_1.NotFoundException('Image not found');
        }
        const updated = await this.imageRepository.update(id, updateDto);
        if (!updated) {
            throw new common_1.NotFoundException('Image not found');
        }
        return this.toResponse(updated);
    }
    async delete(id) {
        const entity = await this.imageQueryRepository.findByIdWithRelations(id);
        if (!entity) {
            throw new common_1.NotFoundException('Image not found');
        }
        await this.uploadService.deleteFile_v2(entity.fileKey);
        await this.imageRepository.delete(id);
    }
    async softDelete(id) {
        const entity = await this.imageQueryRepository.findByIdWithRelations(id);
        if (!entity) {
            throw new common_1.NotFoundException('Image not found');
        }
        const updated = await this.imageRepository.update(id, { isActive: false });
        if (!updated) {
            throw new common_1.NotFoundException('Image not found');
        }
        return this.toResponse(updated);
    }
    async restore(id) {
        const entity = await this.imageQueryRepository.findByIdWithRelations(id);
        if (!entity) {
            throw new common_1.NotFoundException('Image not found');
        }
        const updated = await this.imageRepository.update(id, { isActive: true });
        if (!updated) {
            throw new common_1.NotFoundException('Image not found');
        }
        return this.toResponse(updated);
    }
    toResponse(entity) {
        return {
            id: entity.id,
            merchantId: entity.merchant
                ? {
                    id: entity.merchant.id,
                    shopName: entity.merchant.shopName,
                }
                : null,
            uploadedByUser: entity.uploadedByUser
                ? {
                    id: entity.uploadedByUser.id,
                    fullName: entity.uploadedByUser.fullName,
                    email: entity.uploadedByUser.email,
                }
                : null,
            originalName: entity.originalName,
            fileName: entity.fileName,
            filePath: entity.filePath,
            fileKey: entity.fileKey,
            fileSize: entity.fileSize,
            mimeType: entity.mimeType,
            publicUrl: entity.publicUrl,
            isActive: entity.isActive,
            tags: entity.tags,
            description: entity.description,
            createdAt: entity.createdAt,
            updatedAt: entity.updatedAt,
        };
    }
};
exports.ImageCommandService = ImageCommandService;
exports.ImageCommandService = ImageCommandService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [image_repository_1.ImageRepository,
        image_query_repository_1.ImageQueryRepository,
        upload_service_1.UploadService])
], ImageCommandService);
//# sourceMappingURL=image-command.service.js.map