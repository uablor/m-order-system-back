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
exports.AuthResponseDto = exports.AuthUserDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class AuthUserDto {
    userId;
    email;
    fullName;
    roleId;
    roleName;
    merchantId;
    permissions;
    isActive;
    createdAt;
    updatedAt;
    lastLogin;
}
exports.AuthUserDto = AuthUserDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], AuthUserDto.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], AuthUserDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], AuthUserDto.prototype, "fullName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], AuthUserDto.prototype, "roleId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], AuthUserDto.prototype, "roleName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Merchant ID if user is linked to a merchant',
    }),
    __metadata("design:type", Object)
], AuthUserDto.prototype, "merchantId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        type: [String],
        description: 'Permission codes (e.g. arrival-items:delete)',
    }),
    __metadata("design:type", Array)
], AuthUserDto.prototype, "permissions", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Boolean)
], AuthUserDto.prototype, "isActive", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], AuthUserDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], AuthUserDto.prototype, "updatedAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ nullable: true }),
    __metadata("design:type", Object)
], AuthUserDto.prototype, "lastLogin", void 0);
class AuthResponseDto {
    success;
    message;
    access_token;
    user;
}
exports.AuthResponseDto = AuthResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: true }),
    __metadata("design:type", Boolean)
], AuthResponseDto.prototype, "success", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Login successful' }),
    __metadata("design:type", String)
], AuthResponseDto.prototype, "message", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'JWT access token' }),
    __metadata("design:type", String)
], AuthResponseDto.prototype, "access_token", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: AuthUserDto }),
    __metadata("design:type", AuthUserDto)
], AuthResponseDto.prototype, "user", void 0);
//# sourceMappingURL=auth-response.dto.js.map