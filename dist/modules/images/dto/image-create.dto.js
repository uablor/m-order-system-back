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
exports.ImageCreateDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class ImageCreateDto {
    originalName;
    fileName;
    filePath;
    fileKey;
    fileSize;
    mimeType;
    publicUrl;
    tags;
    description;
}
exports.ImageCreateDto = ImageCreateDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Original file name' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ImageCreateDto.prototype, "originalName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Generated file name' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ImageCreateDto.prototype, "fileName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'File path in storage' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ImageCreateDto.prototype, "filePath", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Unique file key for storage' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ImageCreateDto.prototype, "fileKey", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'File size in bytes' }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], ImageCreateDto.prototype, "fileSize", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'MIME type of the file' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ImageCreateDto.prototype, "mimeType", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Public URL if available' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ImageCreateDto.prototype, "publicUrl", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Image tags' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], ImageCreateDto.prototype, "tags", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Image description' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ImageCreateDto.prototype, "description", void 0);
//# sourceMappingURL=image-create.dto.js.map