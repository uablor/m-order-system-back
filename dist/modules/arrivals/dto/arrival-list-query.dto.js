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
exports.ArrivalListQueryDto = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const swagger_1 = require("@nestjs/swagger");
const base_query_dto_1 = require("../../../common/base/dtos/base.query.dto");
class ArrivalListQueryDto extends base_query_dto_1.BaseQueryDto {
    merchantId;
    orderId;
    orderItemId;
    startDate;
    endDate;
    createdByUserId;
    arrivalDate;
    arrivalTime;
    arrival;
    customerId;
    notification;
}
exports.ArrivalListQueryDto = ArrivalListQueryDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Filter by merchant ID' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], ArrivalListQueryDto.prototype, "merchantId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Filter by order ID' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], ArrivalListQueryDto.prototype, "orderId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Filter by order item ID (arrivals that contain this order item)' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], ArrivalListQueryDto.prototype, "orderItemId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Start date filter (YYYY-MM-DD)', example: '2025-01-01' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], ArrivalListQueryDto.prototype, "startDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'End date filter (YYYY-MM-DD)', example: '2025-12-31' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], ArrivalListQueryDto.prototype, "endDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Filter by created by user ID' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], ArrivalListQueryDto.prototype, "createdByUserId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Filter by arrival date (YYYY-MM-DD)', example: '2025-01-01' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], ArrivalListQueryDto.prototype, "arrivalDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Filter by arrival time (HH:mm)', example: '14:30' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ArrivalListQueryDto.prototype, "arrivalTime", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: Boolean, description: 'Filter by arrival', example: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    (0, class_transformer_1.Transform)(({ value }) => {
        if (value === 'true')
            return true;
        if (value === 'false')
            return false;
        return value;
    }),
    __metadata("design:type", Boolean)
], ArrivalListQueryDto.prototype, "arrival", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Filter by customer ID' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], ArrivalListQueryDto.prototype, "customerId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Filter by notification status' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    (0, class_transformer_1.Transform)(({ value }) => {
        if (value === 'true')
            return true;
        if (value === 'false')
            return false;
        return value;
    }),
    __metadata("design:type", Boolean)
], ArrivalListQueryDto.prototype, "notification", void 0);
//# sourceMappingURL=arrival-list-query.dto.js.map