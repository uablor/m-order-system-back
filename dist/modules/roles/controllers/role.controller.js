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
exports.RoleController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const role_command_service_1 = require("../services/role-command.service");
const role_query_service_1 = require("../services/role-query.service");
const role_create_dto_1 = require("../dto/role-create.dto");
const role_update_dto_1 = require("../dto/role-update.dto");
const role_list_query_dto_1 = require("../dto/role-list-query.dto");
const role_response_dto_1 = require("../dto/role-response.dto");
const no_cache_decorator_1 = require("../../../common/decorators/no-cache.decorator");
const swagger_decorators_1 = require("../../../common/swagger/swagger.decorators");
let RoleController = class RoleController {
    commandService;
    queryService;
    constructor(commandService, queryService) {
        this.commandService = commandService;
        this.queryService = queryService;
    }
    async adminCreate(dto) {
        return this.commandService.create(dto);
    }
    async adminGetById(id) {
        return this.queryService.getById(id);
    }
    async adminGetList(query) {
        return this.queryService.getList(query);
    }
    async adminUpdate(id, dto) {
        return this.commandService.update(id, dto);
    }
    async adminDelete(id) {
        return this.commandService.delete(id);
    }
};
exports.RoleController = RoleController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create new role (ADMIN only)' }),
    (0, swagger_1.ApiBearerAuth)('BearerAuth'),
    (0, swagger_decorators_1.ApiCreatedResponseBase)(),
    (0, swagger_decorators_1.ApiBadRequestBase)(),
    (0, swagger_decorators_1.ApiUnauthorizedBase)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [role_create_dto_1.RoleCreateDto]),
    __metadata("design:returntype", Promise)
], RoleController.prototype, "adminCreate", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get role by ID' }),
    (0, swagger_1.ApiBearerAuth)('BearerAuth'),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Role ID' }),
    (0, swagger_decorators_1.ApiOkResponseBase)(role_response_dto_1.RoleResponseDto),
    (0, swagger_decorators_1.ApiNotFoundBase)(),
    (0, swagger_decorators_1.ApiUnauthorizedBase)(),
    (0, no_cache_decorator_1.NoCache)(),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], RoleController.prototype, "adminGetById", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'List roles with pagination (page, limit)' }),
    (0, swagger_1.ApiBearerAuth)('BearerAuth'),
    (0, swagger_decorators_1.ApiOkResponseBase)(),
    (0, swagger_decorators_1.ApiUnauthorizedBase)(),
    (0, no_cache_decorator_1.NoCache)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [role_list_query_dto_1.RoleListQueryDto]),
    __metadata("design:returntype", Promise)
], RoleController.prototype, "adminGetList", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update role' }),
    (0, swagger_1.ApiBearerAuth)('BearerAuth'),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Role ID' }),
    (0, swagger_decorators_1.ApiOkResponseBase)(),
    (0, swagger_decorators_1.ApiBadRequestBase)(),
    (0, swagger_decorators_1.ApiNotFoundBase)(),
    (0, swagger_decorators_1.ApiUnauthorizedBase)(),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, role_update_dto_1.RoleUpdateDto]),
    __metadata("design:returntype", Promise)
], RoleController.prototype, "adminUpdate", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete role' }),
    (0, swagger_1.ApiBearerAuth)('BearerAuth'),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Role ID' }),
    (0, swagger_decorators_1.ApiNotFoundBase)(),
    (0, swagger_decorators_1.ApiUnauthorizedBase)(),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], RoleController.prototype, "adminDelete", null);
exports.RoleController = RoleController = __decorate([
    (0, swagger_1.ApiTags)('Roles'),
    (0, common_1.Controller)('roles'),
    __metadata("design:paramtypes", [role_command_service_1.RoleCommandService,
        role_query_service_1.RoleQueryService])
], RoleController);
//# sourceMappingURL=role.controller.js.map