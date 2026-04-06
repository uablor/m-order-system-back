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
exports.ArrivalItemResponseDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class ArrivalItemResponseDto {
    id;
    arrivalId;
    orderItemId;
    arrivedQuantity;
    condition;
    notes;
    createdAt;
    updatedAt;
}
exports.ArrivalItemResponseDto = ArrivalItemResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], ArrivalItemResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], ArrivalItemResponseDto.prototype, "arrivalId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], ArrivalItemResponseDto.prototype, "orderItemId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], ArrivalItemResponseDto.prototype, "arrivedQuantity", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: ['OK', 'DAMAGED', 'LOST'], nullable: true }),
    __metadata("design:type", Object)
], ArrivalItemResponseDto.prototype, "condition", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ nullable: true }),
    __metadata("design:type", Object)
], ArrivalItemResponseDto.prototype, "notes", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], ArrivalItemResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], ArrivalItemResponseDto.prototype, "updatedAt", void 0);
//# sourceMappingURL=arrival-item-response.dto.js.map