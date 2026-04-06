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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const user_command_service_1 = require("../services/user-command.service");
const user_query_service_1 = require("../services/user-query.service");
const user_create_dto_1 = require("../dto/user-create.dto");
const user_update_dto_1 = require("../dto/user-update.dto");
const profile_update_dto_1 = require("../dto/profile-update.dto");
const user_merchant_create_dto_1 = require("../dto/user-merchant-create.dto");
const user_list_query_dto_1 = require("../dto/user-list-query.dto");
const user_response_dto_1 = require("../dto/user-response.dto");
const current_user_decorator_1 = require("../../../common/decorators/current-user.decorator");
const swagger_decorators_1 = require("../../../common/swagger/swagger.decorators");
const change_password_dto_1 = require("../dto/change-password.dto");
const active_dto_1 = require("../../../common/base/dtos/active.dto");
let UserController = class UserController {
    commandService;
    queryService;
    constructor(commandService, queryService) {
        this.commandService = commandService;
        this.queryService = queryService;
    }
    async adminCreate(dto) {
        return this.commandService.create(dto);
    }
    async merchantCreate(dto, currentUser) {
        return this.commandService.create(dto, currentUser);
    }
    async adminCreateWithMerchant(dto) {
        return this.commandService.createUserWithMerchant(dto);
    }
    async changePassword(dto, currentUser) {
        return this.commandService.changePassword(currentUser.userId, dto);
    }
    async adminGetList(query) {
        return this.queryService.getList(query);
    }
    async adminGetSummary(query) {
        return this.queryService.getSummary(query);
    }
    async merchantGetList(query, currentUser) {
        return this.queryService.getList(query, currentUser.merchantId);
    }
    async merchantGetSummary(query, currentUser) {
        return this.queryService.getSummary(query, currentUser.merchantId);
    }
    async updateProfile(dto, currentUser) {
        return this.commandService.update(currentUser.userId, dto);
    }
    async adminUpdate(id, dto) {
        return this.commandService.update(id, dto);
    }
    async adminChangePassword(id, dto) {
        return this.commandService.changePassword(id, dto);
    }
    async adminDelete(id) {
        return this.commandService.delete(id);
    }
    async adminUpdateActive(id, dto) {
        return this.commandService.setActive(id, dto);
    }
    async getById(id) {
        return this.queryService.getById(id);
    }
};
exports.UserController = UserController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiOperation)({ summary: 'Create new user' }),
    (0, swagger_decorators_1.ApiCreatedResponseBase)(),
    (0, swagger_decorators_1.ApiBadRequestBase)(),
    (0, swagger_decorators_1.ApiUnauthorizedBase)(),
    (0, swagger_decorators_1.ApiForbiddenBase)(),
    (0, swagger_1.ApiBearerAuth)('BearerAuth'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_create_dto_1.UserCreateDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "adminCreate", null);
__decorate([
    (0, common_1.Post)('merchant'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiOperation)({ summary: 'Create new user for merchant' }),
    (0, swagger_decorators_1.ApiCreatedResponseBase)(),
    (0, swagger_decorators_1.ApiBadRequestBase)(),
    (0, swagger_decorators_1.ApiUnauthorizedBase)(),
    (0, swagger_decorators_1.ApiForbiddenBase)(),
    (0, swagger_1.ApiBearerAuth)('BearerAuth'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_create_dto_1.UserCreateDto, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "merchantCreate", null);
__decorate([
    (0, common_1.Post)('user-merchant'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiOperation)({ summary: 'Create user and merchant (registration flow)' }),
    (0, swagger_decorators_1.ApiCreatedResponseBase)(),
    (0, swagger_decorators_1.ApiBadRequestBase)(),
    (0, swagger_decorators_1.ApiUnauthorizedBase)(),
    (0, swagger_decorators_1.ApiForbiddenBase)(),
    (0, swagger_1.ApiBearerAuth)('BearerAuth'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_merchant_create_dto_1.UserMerchantCreateDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "adminCreateWithMerchant", null);
__decorate([
    (0, common_1.Patch)('change-password-user'),
    (0, swagger_1.ApiOperation)({ summary: 'Update user (self or ADMIN)' }),
    (0, swagger_1.ApiBearerAuth)('BearerAuth'),
    (0, swagger_decorators_1.ApiOkResponseBase)(),
    (0, swagger_decorators_1.ApiBadRequestBase)(),
    (0, swagger_decorators_1.ApiNotFoundBase)(),
    (0, swagger_decorators_1.ApiUnauthorizedBase)(),
    (0, swagger_decorators_1.ApiForbiddenBase)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [change_password_dto_1.ChangePasswordDto, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "changePassword", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({
        summary: 'List users with pagination (page, limit, search) for admin',
    }),
    (0, swagger_decorators_1.ApiOkResponseBase)(),
    (0, swagger_decorators_1.ApiBadRequestBase)(),
    (0, swagger_decorators_1.ApiUnauthorizedBase)(),
    (0, swagger_decorators_1.ApiForbiddenBase)(),
    (0, swagger_decorators_1.ApiNotFoundBase)(),
    (0, swagger_1.ApiBearerAuth)('BearerAuth'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_list_query_dto_1.UserListQueryDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "adminGetList", null);
__decorate([
    (0, common_1.Get)('summary'),
    (0, swagger_1.ApiOperation)({ summary: 'Get user summary (admin - optional merchantId in query)' }),
    (0, swagger_1.ApiBearerAuth)('BearerAuth'),
    (0, swagger_decorators_1.ApiOkResponseBase)(),
    (0, swagger_decorators_1.ApiUnauthorizedBase)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_list_query_dto_1.UserListQueryDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "adminGetSummary", null);
__decorate([
    (0, common_1.Get)('by-merchant'),
    (0, swagger_1.ApiOperation)({
        summary: 'List users by merchant with pagination (page, limit, search)',
    }),
    (0, swagger_decorators_1.ApiOkResponseBase)(),
    (0, swagger_decorators_1.ApiBadRequestBase)(),
    (0, swagger_decorators_1.ApiUnauthorizedBase)(),
    (0, swagger_decorators_1.ApiForbiddenBase)(),
    (0, swagger_decorators_1.ApiNotFoundBase)(),
    (0, swagger_1.ApiBearerAuth)('BearerAuth'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_list_query_dto_1.UserListQueryDto, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "merchantGetList", null);
__decorate([
    (0, common_1.Get)('by-merchant/summary'),
    (0, swagger_1.ApiOperation)({ summary: 'Get user/team member summary for the authenticated merchant' }),
    (0, swagger_1.ApiBearerAuth)('BearerAuth'),
    (0, swagger_decorators_1.ApiOkResponseBase)(),
    (0, swagger_decorators_1.ApiUnauthorizedBase)(),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_list_query_dto_1.UserListQueryDto, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "merchantGetSummary", null);
__decorate([
    (0, common_1.Patch)('profile'),
    (0, swagger_1.ApiOperation)({ summary: 'Update own profile (email, fullName only)' }),
    (0, swagger_1.ApiBearerAuth)('BearerAuth'),
    (0, swagger_decorators_1.ApiOkResponseBase)(),
    (0, swagger_decorators_1.ApiBadRequestBase)(),
    (0, swagger_decorators_1.ApiNotFoundBase)(),
    (0, swagger_decorators_1.ApiUnauthorizedBase)(),
    (0, swagger_decorators_1.ApiForbiddenBase)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [profile_update_dto_1.ProfileUpdateDto, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "updateProfile", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update user by admin' }),
    (0, swagger_1.ApiBearerAuth)('BearerAuth'),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'User ID' }),
    (0, swagger_decorators_1.ApiOkResponseBase)(),
    (0, swagger_decorators_1.ApiBadRequestBase)(),
    (0, swagger_decorators_1.ApiNotFoundBase)(),
    (0, swagger_decorators_1.ApiUnauthorizedBase)(),
    (0, swagger_decorators_1.ApiForbiddenBase)(),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, user_update_dto_1.UserUpdateDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "adminUpdate", null);
__decorate([
    (0, common_1.Patch)(':id/change-password-by-id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update user (self or ADMIN)' }),
    (0, swagger_1.ApiBearerAuth)('BearerAuth'),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'User ID' }),
    (0, swagger_decorators_1.ApiOkResponseBase)(),
    (0, swagger_decorators_1.ApiBadRequestBase)(),
    (0, swagger_decorators_1.ApiNotFoundBase)(),
    (0, swagger_decorators_1.ApiUnauthorizedBase)(),
    (0, swagger_decorators_1.ApiForbiddenBase)(),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, change_password_dto_1.ChangePasswordDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "adminChangePassword", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiOperation)({ summary: 'Delete user (self or ADMIN)' }),
    (0, swagger_1.ApiBearerAuth)('BearerAuth'),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'User ID' }),
    (0, swagger_decorators_1.ApiNotFoundBase)(),
    (0, swagger_decorators_1.ApiUnauthorizedBase)(),
    (0, swagger_decorators_1.ApiForbiddenBase)(),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "adminDelete", null);
__decorate([
    (0, common_1.Patch)(':id/active'),
    (0, swagger_1.ApiOperation)({ summary: 'Update user active status' }),
    (0, swagger_1.ApiBearerAuth)('BearerAuth'),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'User ID' }),
    (0, swagger_decorators_1.ApiOkResponseBase)(),
    (0, swagger_decorators_1.ApiBadRequestBase)(),
    (0, swagger_decorators_1.ApiNotFoundBase)(),
    (0, swagger_decorators_1.ApiUnauthorizedBase)(),
    (0, swagger_decorators_1.ApiForbiddenBase)(),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, active_dto_1.AcitveDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "adminUpdateActive", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get user by ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'User ID' }),
    (0, swagger_decorators_1.ApiOkResponseBase)(user_response_dto_1.UserResponseDto),
    (0, swagger_decorators_1.ApiNotFoundBase)(),
    (0, swagger_decorators_1.ApiUnauthorizedBase)(),
    (0, swagger_decorators_1.ApiForbiddenBase)(),
    (0, swagger_decorators_1.ApiBadRequestBase)(),
    (0, swagger_1.ApiBearerAuth)('BearerAuth'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getById", null);
exports.UserController = UserController = __decorate([
    (0, swagger_1.ApiTags)('Users'),
    (0, common_1.Controller)('users'),
    __metadata("design:paramtypes", [user_command_service_1.UserCommandService,
        user_query_service_1.UserQueryService])
], UserController);
//# sourceMappingURL=user.controller.js.map