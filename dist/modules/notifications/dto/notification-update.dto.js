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
exports.NotificationUpdateDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const notification_enum_1 = require("../enum/notification.enum");
class NotificationUpdateDto {
    status;
    retryCount;
    lastRetryAt;
    sentAt;
    errorMessage;
}
exports.NotificationUpdateDto = NotificationUpdateDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: notification_enum_1.NotificationStatus }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsIn)(Object.values(notification_enum_1.NotificationStatus)),
    __metadata("design:type", String)
], NotificationUpdateDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ minimum: 0 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], NotificationUpdateDto.prototype, "retryCount", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", Object)
], NotificationUpdateDto.prototype, "lastRetryAt", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", Object)
], NotificationUpdateDto.prototype, "sentAt", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.MaxLength)(2000),
    __metadata("design:type", Object)
], NotificationUpdateDto.prototype, "errorMessage", void 0);
//# sourceMappingURL=notification-update.dto.js.map