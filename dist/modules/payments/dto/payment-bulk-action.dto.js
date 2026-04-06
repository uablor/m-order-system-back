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
exports.PaymentBulkActionDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class PaymentBulkActionDto {
    paymentIds;
    rejectReason;
}
exports.PaymentBulkActionDto = PaymentBulkActionDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Payment IDs to process', type: [Number] }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsNumber)({}, { each: true }),
    __metadata("design:type", Array)
], PaymentBulkActionDto.prototype, "paymentIds", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Reason for rejection (required only for reject action)', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PaymentBulkActionDto.prototype, "rejectReason", void 0);
//# sourceMappingURL=payment-bulk-action.dto.js.map