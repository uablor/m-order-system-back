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
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const auth_command_service_1 = require("../services/auth-command.service");
const auth_query_service_1 = require("../services/auth-query.service");
const login_dto_1 = require("../dto/login.dto");
const jwt_auth_guard_1 = require("../guards/jwt-auth.guard");
const current_user_decorator_1 = require("../../../common/decorators/current-user.decorator");
const public_decorator_1 = require("../../../common/decorators/public.decorator");
const swagger_decorators_1 = require("../../../common/swagger/swagger.decorators");
const skip_auto_permission_decorator_1 = require("../../../common/decorators/skip-auto-permission.decorator");
let AuthController = class AuthController {
    commandService;
    queryService;
    constructor(commandService, queryService) {
        this.commandService = commandService;
        this.queryService = queryService;
    }
    async login(dto) {
        return this.commandService.login(dto);
    }
    async me(user) {
        return this.queryService.getProfile(user.userId);
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Post)('login'),
    (0, swagger_1.ApiOperation)({ summary: 'Login with email and password' }),
    (0, swagger_decorators_1.ApiCreatedResponseBase)(),
    (0, swagger_decorators_1.ApiBadRequestBase)(),
    (0, swagger_decorators_1.ApiUnauthorizedBase)(),
    (0, skip_auto_permission_decorator_1.SkipAutoPermission)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [login_dto_1.LoginDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, common_1.Get)('me'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)('BearerAuth'),
    (0, swagger_1.ApiOperation)({ summary: 'Get current user profile' }),
    (0, swagger_decorators_1.ApiOkResponseBase)(),
    (0, swagger_decorators_1.ApiUnauthorizedBase)(),
    (0, skip_auto_permission_decorator_1.SkipAutoPermission)(),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "me", null);
exports.AuthController = AuthController = __decorate([
    (0, swagger_1.ApiTags)('Auth'),
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [auth_command_service_1.AuthCommandService,
        auth_query_service_1.AuthQueryService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map