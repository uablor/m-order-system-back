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
exports.PaymentCreateDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class PaymentCreateDto {
    customerOrderId;
    paymentAmount;
    paymentProofImageId;
    customerMessage;
}
exports.PaymentCreateDto = PaymentCreateDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Customer Order ID' }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], PaymentCreateDto.prototype, "customerOrderId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Payment amount' }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], PaymentCreateDto.prototype, "paymentAmount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Payment proof image ID (from upload/files-v2-public)', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], PaymentCreateDto.prototype, "paymentProofImageId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Message from customer', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PaymentCreateDto.prototype, "customerMessage", void 0);
//# sourceMappingURL=payment-create.dto.js.map