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
exports.CustomerCreateDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const CUSTOMER_TYPES = ['CUSTOMER', 'AGENT'];
const PREFERRED_CONTACT = ['PHONE', 'FACEBOOK', 'WHATSAPP', 'LINE'];
class CustomerCreateDto {
    merchantId;
    customerName;
    customerType;
    shippingAddress;
    shippingProvider;
    shippingSource;
    shippingDestination;
    paymentTerms;
    contactPhone;
    contactFacebook;
    contactWhatsapp;
    contactLine;
    preferredContactMethod;
    uniqueToken;
    isActive;
}
exports.CustomerCreateDto = CustomerCreateDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Merchant ID', example: 1 }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CustomerCreateDto.prototype, "merchantId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Customer Name' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(1),
    (0, class_validator_1.MaxLength)(255),
    __metadata("design:type", String)
], CustomerCreateDto.prototype, "customerName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: CUSTOMER_TYPES }),
    (0, class_validator_1.IsIn)(CUSTOMER_TYPES),
    __metadata("design:type", String)
], CustomerCreateDto.prototype, "customerType", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CustomerCreateDto.prototype, "shippingAddress", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], CustomerCreateDto.prototype, "shippingProvider", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(255),
    __metadata("design:type", String)
], CustomerCreateDto.prototype, "shippingSource", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(255),
    __metadata("design:type", String)
], CustomerCreateDto.prototype, "shippingDestination", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CustomerCreateDto.prototype, "paymentTerms", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(50),
    __metadata("design:type", String)
], CustomerCreateDto.prototype, "contactPhone", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CustomerCreateDto.prototype, "contactFacebook", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(50),
    __metadata("design:type", String)
], CustomerCreateDto.prototype, "contactWhatsapp", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CustomerCreateDto.prototype, "contactLine", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: PREFERRED_CONTACT }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsIn)(PREFERRED_CONTACT),
    __metadata("design:type", String)
], CustomerCreateDto.prototype, "preferredContactMethod", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'If omitted, a unique token will be generated' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(255),
    __metadata("design:type", String)
], CustomerCreateDto.prototype, "uniqueToken", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ default: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CustomerCreateDto.prototype, "isActive", void 0);
//# sourceMappingURL=customer-create.dto.js.map