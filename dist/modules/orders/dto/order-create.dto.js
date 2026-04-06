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
exports.OrderCreateDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const ARRIVAL_STATUSES = ['NOT_ARRIVED', 'ARRIVED'];
class OrderCreateDto {
    merchantId;
    orderCode;
    orderDate;
    arrivalStatus;
    totalShippingCost;
}
exports.OrderCreateDto = OrderCreateDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], OrderCreateDto.prototype, "merchantId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'ORD-001' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], OrderCreateDto.prototype, "orderCode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2025-02-11' }),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], OrderCreateDto.prototype, "orderDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: ARRIVAL_STATUSES, default: 'NOT_ARRIVED' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsIn)(ARRIVAL_STATUSES),
    __metadata("design:type", String)
], OrderCreateDto.prototype, "arrivalStatus", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Total shipping cost', default: 0 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], OrderCreateDto.prototype, "totalShippingCost", void 0);
//# sourceMappingURL=order-create.dto.js.map