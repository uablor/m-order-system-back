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
exports.ArrivalUpdateDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class ArrivalUpdateDto {
    arrivedDate;
    arrivedTime;
    recordedBy;
    notes;
}
exports.ArrivalUpdateDto = ArrivalUpdateDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '2025-02-11' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], ArrivalUpdateDto.prototype, "arrivedDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '14:30:00', description: 'Time of arrival (HH:mm:ss)' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Matches)(/^\d{2}:\d{2}:\d{2}$/, { message: 'arrivedTime must be HH:mm:ss' }),
    __metadata("design:type", String)
], ArrivalUpdateDto.prototype, "arrivedTime", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'User ID who recorded the arrival' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Object)
], ArrivalUpdateDto.prototype, "recordedBy", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.MaxLength)(5000),
    __metadata("design:type", Object)
], ArrivalUpdateDto.prototype, "notes", void 0);
//# sourceMappingURL=arrival-update.dto.js.map