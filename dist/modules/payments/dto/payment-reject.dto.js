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
exports.PaymentBulkRejectDto = exports.PaymentRejectDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class PaymentRejectDto {
    rejectReason;
}
exports.PaymentRejectDto = PaymentRejectDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Reason for rejection' }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PaymentRejectDto.prototype, "rejectReason", void 0);
class PaymentBulkRejectDto {
    paymentIds;
    rejectReason;
}
exports.PaymentBulkRejectDto = PaymentBulkRejectDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Payment IDs to reject', type: [Number] }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], PaymentBulkRejectDto.prototype, "paymentIds", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Reason for rejection' }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PaymentBulkRejectDto.prototype, "rejectReason", void 0);
//# sourceMappingURL=payment-reject.dto.js.map