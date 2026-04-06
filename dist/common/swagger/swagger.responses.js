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
exports.ApiAuthResponseDto = exports.ApiLoginDto = exports.ApiPaginatedResponseDto = exports.ApiPaginationResultDto = exports.ApiResponseDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class ApiResponseDto {
    success;
    Code;
    message;
    results;
}
exports.ApiResponseDto = ApiResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: true, description: 'Whether the request succeeded' }),
    __metadata("design:type", Boolean)
], ApiResponseDto.prototype, "success", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 200, description: 'Response code' }),
    __metadata("design:type", Number)
], ApiResponseDto.prototype, "Code", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Success', description: 'Human-readable message' }),
    __metadata("design:type", String)
], ApiResponseDto.prototype, "message", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Response payload (list or single item)' }),
    __metadata("design:type", Object)
], ApiResponseDto.prototype, "results", void 0);
class ApiPaginationResultDto {
    total;
    page;
    limit;
    totalPages;
    hasNextPage;
    hasPreviousPage;
}
exports.ApiPaginationResultDto = ApiPaginationResultDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 100 }),
    __metadata("design:type", Number)
], ApiPaginationResultDto.prototype, "total", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1 }),
    __metadata("design:type", Number)
], ApiPaginationResultDto.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 10 }),
    __metadata("design:type", Number)
], ApiPaginationResultDto.prototype, "limit", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 10 }),
    __metadata("design:type", Number)
], ApiPaginationResultDto.prototype, "totalPages", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: true }),
    __metadata("design:type", Boolean)
], ApiPaginationResultDto.prototype, "hasNextPage", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: false }),
    __metadata("design:type", Boolean)
], ApiPaginationResultDto.prototype, "hasPreviousPage", void 0);
class ApiPaginatedResponseDto {
    success;
    Code;
    message;
    pagination;
    results;
}
exports.ApiPaginatedResponseDto = ApiPaginatedResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: true }),
    __metadata("design:type", Boolean)
], ApiPaginatedResponseDto.prototype, "success", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 200 }),
    __metadata("design:type", Number)
], ApiPaginatedResponseDto.prototype, "Code", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Success' }),
    __metadata("design:type", String)
], ApiPaginatedResponseDto.prototype, "message", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: ApiPaginationResultDto }),
    __metadata("design:type", ApiPaginationResultDto)
], ApiPaginatedResponseDto.prototype, "pagination", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: 'array', description: 'List of items' }),
    __metadata("design:type", Array)
], ApiPaginatedResponseDto.prototype, "results", void 0);
class ApiLoginDto {
    email;
    password;
}
exports.ApiLoginDto = ApiLoginDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'user@example.com' }),
    __metadata("design:type", String)
], ApiLoginDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'password123' }),
    __metadata("design:type", String)
], ApiLoginDto.prototype, "password", void 0);
class ApiAuthResponseDto {
    success;
    message;
    access_token;
    user;
}
exports.ApiAuthResponseDto = ApiAuthResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: true }),
    __metadata("design:type", Boolean)
], ApiAuthResponseDto.prototype, "success", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Login successful' }),
    __metadata("design:type", String)
], ApiAuthResponseDto.prototype, "message", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'JWT access token',
        example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    }),
    __metadata("design:type", String)
], ApiAuthResponseDto.prototype, "access_token", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Authenticated user info' }),
    __metadata("design:type", Object)
], ApiAuthResponseDto.prototype, "user", void 0);
//# sourceMappingURL=swagger.responses.js.map