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
exports.CustomerController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const customer_command_service_1 = require("../services/customer-command.service");
const customer_query_service_1 = require("../services/customer-query.service");
const customer_create_dto_1 = require("../dto/customer-create.dto");
const customer_update_dto_1 = require("../dto/customer-update.dto");
const customer_list_query_dto_1 = require("../dto/customer-list-query.dto");
const customer_response_dto_1 = require("../dto/customer-response.dto");
const no_cache_decorator_1 = require("../../../common/decorators/no-cache.decorator");
const swagger_decorators_1 = require("../../../common/swagger/swagger.decorators");
const current_user_decorator_1 = require("../../../common/decorators/current-user.decorator");
let CustomerController = class CustomerController {
    commandService;
    queryService;
    constructor(commandService, queryService) {
        this.commandService = commandService;
        this.queryService = queryService;
    }
    async merchantCreate(dto) {
        return this.commandService.create(dto);
    }
    async merchantGetList(query, currentUser) {
        return this.queryService.getList(query, currentUser);
    }
    async adminGetList(query) {
        return this.queryService.getList(query);
    }
    async getById(id, currentUser) {
        return this.queryService.getByIdOrFail(id, currentUser);
    }
    async merchantUpdate(id, dto) {
        return this.commandService.update(id, dto);
    }
    async adminDelete(id) {
        return this.commandService.delete(id);
    }
};
exports.CustomerController = CustomerController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create customer' }),
    (0, swagger_1.ApiBearerAuth)('BearerAuth'),
    (0, swagger_decorators_1.ApiCreatedResponseBase)(),
    (0, swagger_decorators_1.ApiBadRequestBase)(),
    (0, swagger_decorators_1.ApiUnauthorizedBase)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [customer_create_dto_1.CustomerCreateDto]),
    __metadata("design:returntype", Promise)
], CustomerController.prototype, "merchantCreate", null);
__decorate([
    (0, common_1.Get)('by-merchant'),
    (0, swagger_1.ApiOperation)({
        summary: 'List customers by merchant (uses JWT merchantId)',
    }),
    (0, swagger_1.ApiBearerAuth)('BearerAuth'),
    (0, swagger_decorators_1.ApiOkResponseBase)(),
    (0, swagger_decorators_1.ApiUnauthorizedBase)(),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [customer_list_query_dto_1.CustomerListQueryDto, Object]),
    __metadata("design:returntype", Promise)
], CustomerController.prototype, "merchantGetList", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({
        summary: 'List customers with pagination (optional merchantId filter)',
    }),
    (0, swagger_1.ApiBearerAuth)('BearerAuth'),
    (0, swagger_decorators_1.ApiOkResponseBase)(),
    (0, swagger_decorators_1.ApiUnauthorizedBase)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [customer_list_query_dto_1.CustomerListQueryDto]),
    __metadata("design:returntype", Promise)
], CustomerController.prototype, "adminGetList", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get customer by ID' }),
    (0, swagger_1.ApiBearerAuth)('BearerAuth'),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Customer ID' }),
    (0, swagger_decorators_1.ApiOkResponseBase)(customer_response_dto_1.CustomerResponseDto),
    (0, swagger_decorators_1.ApiNotFoundBase)(),
    (0, swagger_decorators_1.ApiUnauthorizedBase)(),
    (0, no_cache_decorator_1.NoCache)(),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], CustomerController.prototype, "getById", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update customer' }),
    (0, swagger_1.ApiBearerAuth)('BearerAuth'),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Customer ID' }),
    (0, swagger_decorators_1.ApiOkResponseBase)(),
    (0, swagger_decorators_1.ApiBadRequestBase)(),
    (0, swagger_decorators_1.ApiNotFoundBase)(),
    (0, swagger_decorators_1.ApiUnauthorizedBase)(),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, customer_update_dto_1.CustomerUpdateDto]),
    __metadata("design:returntype", Promise)
], CustomerController.prototype, "merchantUpdate", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete customer' }),
    (0, swagger_1.ApiBearerAuth)('BearerAuth'),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Customer ID' }),
    (0, swagger_decorators_1.ApiNotFoundBase)(),
    (0, swagger_decorators_1.ApiUnauthorizedBase)(),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], CustomerController.prototype, "adminDelete", null);
exports.CustomerController = CustomerController = __decorate([
    (0, swagger_1.ApiTags)('Customers'),
    (0, common_1.Controller)('customers'),
    __metadata("design:paramtypes", [customer_command_service_1.CustomerCommandService,
        customer_query_service_1.CustomerQueryService])
], CustomerController);
//# sourceMappingURL=customer.controller.js.map