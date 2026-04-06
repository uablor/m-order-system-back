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
exports.UploadController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const swagger_1 = require("@nestjs/swagger");
const upload_service_1 = require("../services/upload.service");
const image_command_service_1 = require("../services/image-command.service");
const upload_response_dto_1 = require("../dto/upload-response.dto");
const current_user_decorator_1 = require("../../../common/decorators/current-user.decorator");
const public_decorator_1 = require("../../../common/decorators/public.decorator");
const image_response_dto_1 = require("../dto/image-response.dto");
const customer_repository_1 = require("../../customers/repositories/customer.repository");
let UploadController = class UploadController {
    uploadService;
    imageCommandService;
    customerRepository;
    constructor(uploadService, imageCommandService, customerRepository) {
        this.uploadService = uploadService;
        this.imageCommandService = imageCommandService;
        this.customerRepository = customerRepository;
    }
    async uploadFiles(files, currentUser) {
        if (!files || files.length === 0) {
            throw new common_1.BadRequestException('No files provided');
        }
        const uploadedFiles = await this.uploadService.uploadFiles(files);
        let images = [];
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const uploadedFile = uploadedFiles[i];
            if (uploadedFile) {
                const imageRecord = await this.imageCommandService.createFromUpload([{
                        originalname: file.originalname,
                        fileName: file.originalname,
                        filePath: '',
                        key: uploadedFile.key,
                        size: file.size,
                        mimetype: file.mimetype,
                        url: null
                    }], {
                    userId: currentUser.userId,
                    merchantId: currentUser.merchantId,
                });
                images.push(...imageRecord);
            }
        }
        return images;
    }
    async uploadFilesV2(files, currentUser) {
        if (!files || files.length === 0) {
            throw new common_1.BadRequestException('No files provided');
        }
        const uploadedFiles = await this.uploadService.uploadFiles_v2(files);
        let images = [];
        console.log('uploadedFiles', uploadedFiles);
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const uploadedFile = uploadedFiles.uploaded?.[i];
            console.log('uploadedFile', uploadedFile);
            if (uploadedFile) {
                const imageRecord = await this.imageCommandService.createFromUpload([{
                        originalname: file.originalname,
                        fileName: file.originalname,
                        filePath: '',
                        key: uploadedFile.key,
                        size: file.size,
                        mimetype: file.mimetype,
                        url: uploadedFile.url
                    }], {
                    userId: currentUser.userId,
                    merchantId: currentUser.merchantId,
                });
                console.log('imageRecord', imageRecord);
                images.push(...imageRecord);
            }
        }
        console.log('images', images);
        return images;
    }
    async deleteFile(deleteDto) {
        if (!deleteDto.key) {
            throw new common_1.BadRequestException('File key is required');
        }
        return this.uploadService.deleteFile(deleteDto.key);
    }
    async deleteFileV2(deleteDto) {
        if (!deleteDto.key) {
            throw new common_1.BadRequestException('File key is required');
        }
        return this.uploadService.deleteFile_v2(deleteDto.key);
    }
    async deleteFileById(id) {
        const imageId = parseInt(id);
        if (isNaN(imageId)) {
            throw new common_1.BadRequestException('Invalid image ID');
        }
        await this.imageCommandService.delete(imageId);
        return { message: 'Image deleted successfully' };
    }
    async uploadFilesV2Public(files, body) {
        if (!files || files.length === 0) {
            throw new common_1.BadRequestException('No files provided');
        }
        const customerToken = (body?.customerToken ?? '').trim();
        if (!customerToken) {
            throw new common_1.BadRequestException('customerToken is required');
        }
        const customer = await this.customerRepository.findOneBy({ uniqueToken: customerToken }, undefined, { relations: ['merchant'] });
        if (!customer) {
            throw new common_1.NotFoundException('Customer not found for the provided token');
        }
        const merchantId = customer.merchant?.id;
        if (!merchantId) {
            throw new common_1.BadRequestException('Customer has no associated merchant');
        }
        const uploadedFiles = await this.uploadService.uploadFiles_v2(files);
        const images = [];
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const uploadedFile = uploadedFiles.uploaded?.[i];
            if (uploadedFile) {
                const imageRecord = await this.imageCommandService.createFromUploadForCustomer([{
                        originalname: file.originalname,
                        key: uploadedFile.key,
                        size: file.size,
                        mimetype: file.mimetype,
                        url: uploadedFile.url,
                    }], merchantId);
                images.push(...imageRecord);
            }
        }
        return images;
    }
};
exports.UploadController = UploadController;
__decorate([
    (0, common_1.Post)('files'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FilesInterceptor)('files')),
    (0, swagger_1.ApiOperation)({ summary: 'Upload multiple files' }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiBody)({
        description: 'Files to upload',
        type: upload_response_dto_1.UploadFilesDto,
    }),
    (0, swagger_1.ApiBearerAuth)('BearerAuth'),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Files uploaded successfully', type: [image_response_dto_1.ImageResponseDto] }),
    __param(0, (0, common_1.UploadedFiles)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array, Object]),
    __metadata("design:returntype", Promise)
], UploadController.prototype, "uploadFiles", null);
__decorate([
    (0, common_1.Post)('files-v2'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FilesInterceptor)('files')),
    (0, swagger_1.ApiOperation)({ summary: 'Upload multiple files (v2 with URLs)' }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiBody)({
        description: 'Files to upload',
        type: upload_response_dto_1.UploadFilesDto,
    }),
    (0, swagger_1.ApiBearerAuth)('BearerAuth'),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Files uploaded successfully', type: [image_response_dto_1.ImageResponseDto] }),
    __param(0, (0, common_1.UploadedFiles)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array, Object]),
    __metadata("design:returntype", Promise)
], UploadController.prototype, "uploadFilesV2", null);
__decorate([
    (0, common_1.Delete)('file'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete file by key' }),
    (0, swagger_1.ApiBearerAuth)('BearerAuth'),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'File deleted successfully' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UploadController.prototype, "deleteFile", null);
__decorate([
    (0, common_1.Delete)('file-v2'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete file by key (v2 with better error handling)' }),
    (0, swagger_1.ApiBearerAuth)('BearerAuth'),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'File deletion result', type: upload_response_dto_1.DeleteFileResponseDto }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UploadController.prototype, "deleteFileV2", null);
__decorate([
    (0, common_1.Delete)('file-v2/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete file by image ID' }),
    (0, swagger_1.ApiBearerAuth)('BearerAuth'),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Image deleted successfully' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UploadController.prototype, "deleteFileById", null);
__decorate([
    (0, common_1.Post)('files-v2-public'),
    (0, public_decorator_1.Public)(),
    (0, common_1.UseInterceptors)((0, platform_express_1.FilesInterceptor)('files')),
    (0, swagger_1.ApiOperation)({ summary: 'Upload files (public — for customer payment slip, requires customerToken)' }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiBody)({
        description: 'Files + customerToken (form-data)',
        schema: {
            type: 'object',
            properties: {
                files: { type: 'array', items: { type: 'string', format: 'binary' } },
                customerToken: { type: 'string', description: 'Customer unique token from URL' },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Files uploaded successfully', type: [image_response_dto_1.ImageResponseDto] }),
    __param(0, (0, common_1.UploadedFiles)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array, Object]),
    __metadata("design:returntype", Promise)
], UploadController.prototype, "uploadFilesV2Public", null);
exports.UploadController = UploadController = __decorate([
    (0, swagger_1.ApiTags)('Upload'),
    (0, common_1.Controller)('upload'),
    __metadata("design:paramtypes", [upload_service_1.UploadService,
        image_command_service_1.ImageCommandService,
        customer_repository_1.CustomerRepository])
], UploadController);
//# sourceMappingURL=upload.controller.js.map