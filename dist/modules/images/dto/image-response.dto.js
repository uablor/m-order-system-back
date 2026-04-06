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
exports.ImageResponseDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class ImageResponseDto {
    id;
    merchantId;
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
    createdAt;
    updatedAt;
}
exports.ImageResponseDto = ImageResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], ImageResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ nullable: true }),
    __metadata("design:type", Object)
], ImageResponseDto.prototype, "merchantId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ nullable: true }),
    __metadata("design:type", Object)
], ImageResponseDto.prototype, "uploadedByUser", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Original file name' }),
    __metadata("design:type", String)
], ImageResponseDto.prototype, "originalName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Generated file name' }),
    __metadata("design:type", String)
], ImageResponseDto.prototype, "fileName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'File path in storage' }),
    __metadata("design:type", String)
], ImageResponseDto.prototype, "filePath", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Unique file key for storage' }),
    __metadata("design:type", String)
], ImageResponseDto.prototype, "fileKey", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'File size in bytes' }),
    __metadata("design:type", Number)
], ImageResponseDto.prototype, "fileSize", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'MIME type of the file' }),
    __metadata("design:type", String)
], ImageResponseDto.prototype, "mimeType", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Public URL if available', nullable: true }),
    __metadata("design:type", Object)
], ImageResponseDto.prototype, "publicUrl", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Whether the image is active' }),
    __metadata("design:type", Boolean)
], ImageResponseDto.prototype, "isActive", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Image tags', nullable: true }),
    __metadata("design:type", Object)
], ImageResponseDto.prototype, "tags", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Image description', nullable: true }),
    __metadata("design:type", Object)
], ImageResponseDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Creation timestamp' }),
    __metadata("design:type", Date)
], ImageResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Last update timestamp' }),
    __metadata("design:type", Date)
], ImageResponseDto.prototype, "updatedAt", void 0);
//# sourceMappingURL=image-response.dto.js.map