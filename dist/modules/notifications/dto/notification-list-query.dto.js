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
exports.NotificationListQueryDto = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const swagger_1 = require("@nestjs/swagger");
const NOTIFICATION_TYPES = ['ARRIVAL', 'PAYMENT', 'REMINDER'];
const STATUSES = ['SENT', 'FAILED'];
class NotificationListQueryDto {
    page = 1;
    limit = 10;
    merchantId;
    customerId;
    notificationType;
    status;
    search;
    startDate;
    endDate;
}
exports.NotificationListQueryDto = NotificationListQueryDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Page number', default: 1, minimum: 1 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], NotificationListQueryDto.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Items per page', default: 10, minimum: 1, maximum: 100 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(100),
    __metadata("design:type", Number)
], NotificationListQueryDto.prototype, "limit", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Filter by merchant ID' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], NotificationListQueryDto.prototype, "merchantId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Filter by customer ID' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], NotificationListQueryDto.prototype, "customerId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: NOTIFICATION_TYPES }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsIn)(NOTIFICATION_TYPES),
    __metadata("design:type", Object)
], NotificationListQueryDto.prototype, "notificationType", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: STATUSES }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsIn)(STATUSES),
    __metadata("design:type", Object)
], NotificationListQueryDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Search by recipient contact or message content' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], NotificationListQueryDto.prototype, "search", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Filter from date (YYYY-MM-DD)' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], NotificationListQueryDto.prototype, "startDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Filter to date (YYYY-MM-DD)' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], NotificationListQueryDto.prototype, "endDate", void 0);
//# sourceMappingURL=notification-list-query.dto.js.map