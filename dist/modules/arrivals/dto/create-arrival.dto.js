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
exports.CreateArrivalDto = exports.CreateArrivalItemDto = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const swagger_1 = require("@nestjs/swagger");
const CONDITIONS = ['OK', 'DAMAGED', 'LOST'];
class CreateArrivalItemDto {
    orderItemId;
    arrivedQuantity;
    condition;
    notes;
}
exports.CreateArrivalItemDto = CreateArrivalItemDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Order item ID' }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateArrivalItemDto.prototype, "orderItemId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Quantity arrived', minimum: 1 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], CreateArrivalItemDto.prototype, "arrivedQuantity", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: CONDITIONS }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsIn)(CONDITIONS),
    __metadata("design:type", String)
], CreateArrivalItemDto.prototype, "condition", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateArrivalItemDto.prototype, "notes", void 0);
class CreateArrivalDto {
    orderId;
    notes;
    arrivalItems;
}
exports.CreateArrivalDto = CreateArrivalDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Order ID' }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateArrivalDto.prototype, "orderId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateArrivalDto.prototype, "notes", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [CreateArrivalItemDto] }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => CreateArrivalItemDto),
    __metadata("design:type", Array)
], CreateArrivalDto.prototype, "arrivalItems", void 0);
//# sourceMappingURL=create-arrival.dto.js.map