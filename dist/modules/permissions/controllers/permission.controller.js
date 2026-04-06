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
exports.PermissionController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const permission_command_service_1 = require("../services/permission-command.service");
const permission_query_service_1 = require("../services/permission-query.service");
const permission_generator_service_1 = require("../services/permission-generator.service");
const permission_create_dto_1 = require("../dto/permission-create.dto");
const permission_update_dto_1 = require("../dto/permission-update.dto");
const permission_list_query_dto_1 = require("../dto/permission-list-query.dto");
const permission_response_dto_1 = require("../dto/permission-response.dto");
const no_cache_decorator_1 = require("../../../common/decorators/no-cache.decorator");
const swagger_decorators_1 = require("../../../common/swagger/swagger.decorators");
let PermissionController = class PermissionController {
    commandService;
    queryService;
    generatorService;
    constructor(commandService, queryService, generatorService) {
        this.commandService = commandService;
        this.queryService = queryService;
        this.generatorService = generatorService;
    }
    async adminGenerateFromControllers() {
        return this.generatorService.generateFromControllers();
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
exports.PermissionController = PermissionController;
__decorate([
    (0, common_1.Post)('generate'),
    (0, swagger_1.ApiBearerAuth)('BearerAuth'),
    (0, swagger_1.ApiOperation)({
        summary: 'Generate permissions from controller class and method names',
        description: 'Scans all controllers and creates permission codes as {path}:{methodName} (e.g. users:create, roles:getById). Only ADMIN.',
    }),
    (0, swagger_decorators_1.ApiOkResponseBase)(),
    (0, swagger_decorators_1.ApiUnauthorizedBase)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PermissionController.prototype, "adminGenerateFromControllers", null);
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create new permission' }),
    (0, swagger_1.ApiBearerAuth)('BearerAuth'),
    (0, swagger_decorators_1.ApiCreatedResponseBase)(),
    (0, swagger_decorators_1.ApiBadRequestBase)(),
    (0, swagger_decorators_1.ApiUnauthorizedBase)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [permission_create_dto_1.PermissionCreateDto]),
    __metadata("design:returntype", Promise)
], PermissionController.prototype, "adminCreate", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get permission by ID' }),
    (0, swagger_1.ApiBearerAuth)('BearerAuth'),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Permission ID' }),
    (0, swagger_decorators_1.ApiOkResponseBase)(permission_response_dto_1.PermissionResponseDto),
    (0, swagger_decorators_1.ApiNotFoundBase)(),
    (0, swagger_decorators_1.ApiUnauthorizedBase)(),
    (0, no_cache_decorator_1.NoCache)(),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], PermissionController.prototype, "adminGetById", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'List permissions with pagination (page, limit)' }),
    (0, swagger_1.ApiBearerAuth)('BearerAuth'),
    (0, swagger_decorators_1.ApiOkResponseBase)(),
    (0, swagger_decorators_1.ApiUnauthorizedBase)(),
    (0, no_cache_decorator_1.NoCache)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [permission_list_query_dto_1.PermissionListQueryDto]),
    __metadata("design:returntype", Promise)
], PermissionController.prototype, "adminGetList", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update permission' }),
    (0, swagger_1.ApiBearerAuth)('BearerAuth'),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Permission ID' }),
    (0, swagger_decorators_1.ApiOkResponseBase)(),
    (0, swagger_decorators_1.ApiBadRequestBase)(),
    (0, swagger_decorators_1.ApiNotFoundBase)(),
    (0, swagger_decorators_1.ApiUnauthorizedBase)(),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, permission_update_dto_1.PermissionUpdateDto]),
    __metadata("design:returntype", Promise)
], PermissionController.prototype, "adminUpdate", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete permission' }),
    (0, swagger_1.ApiBearerAuth)('BearerAuth'),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Permission ID' }),
    (0, swagger_decorators_1.ApiNotFoundBase)(),
    (0, swagger_decorators_1.ApiUnauthorizedBase)(),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], PermissionController.prototype, "adminDelete", null);
exports.PermissionController = PermissionController = __decorate([
    (0, swagger_1.ApiTags)('Permissions'),
    (0, common_1.Controller)('permissions'),
    __metadata("design:paramtypes", [permission_command_service_1.PermissionCommandService,
        permission_query_service_1.PermissionQueryService,
        permission_generator_service_1.PermissionGeneratorService])
], PermissionController);
//# sourceMappingURL=permission.controller.js.map