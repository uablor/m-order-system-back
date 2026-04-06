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
exports.CreateNotificationMultipleDto = exports.CreateNotificationDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class CreateNotificationDto {
    customerOrderIds;
    message;
    customerId;
    language;
}
exports.CreateNotificationDto = CreateNotificationDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Array of customer order IDs to create notifications for',
        example: [123, 124, 125],
    }),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], CreateNotificationDto.prototype, "customerOrderIds", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Custom message for the notification',
        example: 'Your orders have arrived!',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateNotificationDto.prototype, "message", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Customer ID',
        example: 1,
    }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateNotificationDto.prototype, "customerId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: ['en', 'th', 'la'] }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsIn)(['en', 'th', 'la']),
    __metadata("design:type", String)
], CreateNotificationDto.prototype, "language", void 0);
class CreateNotificationMultipleDto {
    notifications;
    language;
}
exports.CreateNotificationMultipleDto = CreateNotificationMultipleDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Array of notification data',
        example: [
            {
                customerOrderIds: [123, 124, 125],
                message: 'Your orders have arrived!',
                customerId: 1,
            },
        ],
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], CreateNotificationMultipleDto.prototype, "notifications", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: ['en', 'th', 'la'], description: 'Language for notification message template' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsIn)(['en', 'th', 'la']),
    __metadata("design:type", String)
], CreateNotificationMultipleDto.prototype, "language", void 0);
//# sourceMappingURL=create-notification.dto.js.map