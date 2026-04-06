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
exports.PaymentController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const payment_command_service_1 = require("../services/payment-command.service");
const payment_query_service_1 = require("../services/payment-query.service");
const payment_create_dto_1 = require("../dto/payment-create.dto");
const payment_reject_dto_1 = require("../dto/payment-reject.dto");
const payment_bulk_action_dto_1 = require("../dto/payment-bulk-action.dto");
const payment_list_query_dto_1 = require("../dto/payment-list-query.dto");
const payment_response_dto_1 = require("../dto/payment-response.dto");
const current_user_decorator_1 = require("../../../common/decorators/current-user.decorator");
const swagger_decorators_1 = require("../../../common/swagger/swagger.decorators");
const role_seeder_1 = require("../../../database/seeds/role.seeder");
const public_decorator_1 = require("../../../common/decorators/public.decorator");
const MERCHANT_ROLES = [
    role_seeder_1.SUPERADMIN_ROLE_NAME,
    role_seeder_1.ADMIN_ROLE_NAME,
    role_seeder_1.ADMIN_MERCHANT_ROLE_NAME,
    role_seeder_1.EMPLOYEE_MERCHANT_ROLE_NAME,
];
const ADMIN_ROLES = [role_seeder_1.SUPERADMIN_ROLE_NAME, role_seeder_1.ADMIN_ROLE_NAME];
let PaymentController = class PaymentController {
    commandService;
    queryService;
    constructor(commandService, queryService) {
        this.commandService = commandService;
        this.queryService = queryService;
    }
    async create(dto, currentUser) {
        return this.commandService.create(dto, currentUser);
    }
    async getMyPayments(query, currentUser) {
        return this.queryService.getListByCustomer(query, currentUser);
    }
    async getByCustomerOrderId(customerOrderId, currentUser) {
        const result = await this.queryService.getByCustomerOrderId(customerOrderId, currentUser);
        if (!result) {
            throw new common_1.NotFoundException('Payment not found for this customer order');
        }
        return result;
    }
    async getMerchantPayments(query, currentUser) {
        return this.queryService.getListByMerchant(query, currentUser);
    }
    async getMerchantPaymentSummary(query, currentUser) {
        return this.queryService.getSummaryByMerchant(query, currentUser);
    }
    async getUnreadMerchantPayments(currentUser) {
        return this.queryService.getUnreadPaymentsByMerchant(currentUser);
    }
    async getList(query) {
        return this.queryService.getList(query);
    }
    async getById(id, currentUser) {
        return this.queryService.getByIdWithOwnership(id, currentUser);
    }
    async bulkVerify(dto, currentUser) {
        return this.commandService.bulkVerify(dto.paymentIds, currentUser);
    }
    async bulkReject(dto, currentUser) {
        return this.commandService.bulkReject(dto, currentUser);
    }
    async verify(id, currentUser) {
        return this.commandService.verify(id, currentUser);
    }
    async reject(id, dto, currentUser) {
        return this.commandService.reject(id, dto, currentUser);
    }
    async markAsRead(id, currentUser) {
        return this.commandService.markAsRead(id, currentUser);
    }
    async delete(id, currentUser) {
        return this.commandService.delete(id);
    }
};
exports.PaymentController = PaymentController;
__decorate([
    (0, common_1.Post)(),
    (0, public_decorator_1.Public)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create payment (public — customer submits via token page)' }),
    (0, swagger_decorators_1.ApiCreatedResponseBase)(),
    (0, swagger_decorators_1.ApiBadRequestBase)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [payment_create_dto_1.PaymentCreateDto, Object]),
    __metadata("design:returntype", Promise)
], PaymentController.prototype, "create", null);
__decorate([
    (0, common_1.Get)('my-payments'),
    (0, swagger_1.ApiOperation)({ summary: 'Get my payments (customer only)' }),
    (0, swagger_1.ApiBearerAuth)('BearerAuth'),
    (0, swagger_decorators_1.ApiOkResponseBase)(),
    (0, swagger_decorators_1.ApiUnauthorizedBase)(),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [payment_list_query_dto_1.PaymentListQueryDto, Object]),
    __metadata("design:returntype", Promise)
], PaymentController.prototype, "getMyPayments", null);
__decorate([
    (0, common_1.Get)('by-customer-order/:customerOrderId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get payment by customer order ID' }),
    (0, swagger_1.ApiBearerAuth)('BearerAuth'),
    (0, swagger_1.ApiParam)({ name: 'customerOrderId', description: 'Customer Order ID' }),
    (0, swagger_decorators_1.ApiOkResponseBase)(payment_response_dto_1.PaymentResponseDto),
    (0, swagger_decorators_1.ApiNotFoundBase)(),
    (0, swagger_decorators_1.ApiUnauthorizedBase)(),
    (0, swagger_decorators_1.ApiForbiddenBase)(),
    __param(0, (0, common_1.Param)('customerOrderId', common_1.ParseIntPipe)),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], PaymentController.prototype, "getByCustomerOrderId", null);
__decorate([
    (0, common_1.Get)('merchant'),
    (0, swagger_1.ApiOperation)({ summary: 'Get payments by merchant' }),
    (0, swagger_1.ApiBearerAuth)('BearerAuth'),
    (0, swagger_decorators_1.ApiOkResponseBase)(),
    (0, swagger_decorators_1.ApiUnauthorizedBase)(),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [payment_list_query_dto_1.PaymentListQueryDto, Object]),
    __metadata("design:returntype", Promise)
], PaymentController.prototype, "getMerchantPayments", null);
__decorate([
    (0, common_1.Get)('merchant/summary'),
    (0, swagger_1.ApiOperation)({ summary: 'Get payment summary for the authenticated merchant' }),
    (0, swagger_1.ApiBearerAuth)('BearerAuth'),
    (0, swagger_decorators_1.ApiOkResponseBase)(),
    (0, swagger_decorators_1.ApiUnauthorizedBase)(),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [payment_list_query_dto_1.PaymentListQueryDto, Object]),
    __metadata("design:returntype", Promise)
], PaymentController.prototype, "getMerchantPaymentSummary", null);
__decorate([
    (0, common_1.Get)('merchant/unread'),
    (0, swagger_1.ApiOperation)({ summary: 'Get unread payments for merchant notifications' }),
    (0, swagger_1.ApiBearerAuth)('BearerAuth'),
    (0, swagger_decorators_1.ApiOkResponseBase)(),
    (0, swagger_decorators_1.ApiUnauthorizedBase)(),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PaymentController.prototype, "getUnreadMerchantPayments", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all payments (admin only)' }),
    (0, swagger_1.ApiBearerAuth)('BearerAuth'),
    (0, swagger_decorators_1.ApiOkResponseBase)(),
    (0, swagger_decorators_1.ApiUnauthorizedBase)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [payment_list_query_dto_1.PaymentListQueryDto]),
    __metadata("design:returntype", Promise)
], PaymentController.prototype, "getList", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get payment by ID' }),
    (0, swagger_1.ApiBearerAuth)('BearerAuth'),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Payment ID' }),
    (0, swagger_decorators_1.ApiOkResponseBase)(payment_response_dto_1.PaymentResponseDto),
    (0, swagger_decorators_1.ApiNotFoundBase)(),
    (0, swagger_decorators_1.ApiUnauthorizedBase)(),
    (0, swagger_decorators_1.ApiForbiddenBase)(),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], PaymentController.prototype, "getById", null);
__decorate([
    (0, common_1.Patch)('bulk-verify'),
    (0, swagger_1.ApiOperation)({ summary: 'Verify multiple payments (admin / merchant)' }),
    (0, swagger_1.ApiBearerAuth)('BearerAuth'),
    (0, swagger_decorators_1.ApiOkResponseBase)(),
    (0, swagger_decorators_1.ApiBadRequestBase)(),
    (0, swagger_decorators_1.ApiUnauthorizedBase)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [payment_bulk_action_dto_1.PaymentBulkActionDto, Object]),
    __metadata("design:returntype", Promise)
], PaymentController.prototype, "bulkVerify", null);
__decorate([
    (0, common_1.Patch)('bulk-reject'),
    (0, swagger_1.ApiOperation)({ summary: 'Reject multiple payments (admin / merchant)' }),
    (0, swagger_1.ApiBearerAuth)('BearerAuth'),
    (0, swagger_decorators_1.ApiOkResponseBase)(),
    (0, swagger_decorators_1.ApiBadRequestBase)(),
    (0, swagger_decorators_1.ApiUnauthorizedBase)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [payment_reject_dto_1.PaymentBulkRejectDto, Object]),
    __metadata("design:returntype", Promise)
], PaymentController.prototype, "bulkReject", null);
__decorate([
    (0, common_1.Patch)(':id/verify'),
    (0, swagger_1.ApiOperation)({ summary: 'Verify payment (admin / merchant)' }),
    (0, swagger_1.ApiBearerAuth)('BearerAuth'),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Payment ID' }),
    (0, swagger_decorators_1.ApiOkResponseBase)(),
    (0, swagger_decorators_1.ApiNotFoundBase)(),
    (0, swagger_decorators_1.ApiBadRequestBase)(),
    (0, swagger_decorators_1.ApiUnauthorizedBase)(),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], PaymentController.prototype, "verify", null);
__decorate([
    (0, common_1.Patch)(':id/reject'),
    (0, swagger_1.ApiOperation)({ summary: 'Reject payment (admin / merchant)' }),
    (0, swagger_1.ApiBearerAuth)('BearerAuth'),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Payment ID' }),
    (0, swagger_decorators_1.ApiOkResponseBase)(),
    (0, swagger_decorators_1.ApiNotFoundBase)(),
    (0, swagger_decorators_1.ApiBadRequestBase)(),
    (0, swagger_decorators_1.ApiUnauthorizedBase)(),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, payment_reject_dto_1.PaymentRejectDto, Object]),
    __metadata("design:returntype", Promise)
], PaymentController.prototype, "reject", null);
__decorate([
    (0, common_1.Patch)(':id/read'),
    (0, swagger_1.ApiOperation)({ summary: 'Mark payment as read (merchant)' }),
    (0, swagger_1.ApiBearerAuth)('BearerAuth'),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Payment ID' }),
    (0, swagger_decorators_1.ApiOkResponseBase)(),
    (0, swagger_decorators_1.ApiNotFoundBase)(),
    (0, swagger_decorators_1.ApiUnauthorizedBase)(),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], PaymentController.prototype, "markAsRead", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete payment (pending only)' }),
    (0, swagger_1.ApiBearerAuth)('BearerAuth'),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Payment ID' }),
    (0, swagger_decorators_1.ApiOkResponseBase)(),
    (0, swagger_decorators_1.ApiNotFoundBase)(),
    (0, swagger_decorators_1.ApiBadRequestBase)(),
    (0, swagger_decorators_1.ApiUnauthorizedBase)(),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], PaymentController.prototype, "delete", null);
exports.PaymentController = PaymentController = __decorate([
    (0, swagger_1.ApiTags)('Payments'),
    (0, common_1.Controller)('payments'),
    __metadata("design:paramtypes", [payment_command_service_1.PaymentCommandService,
        payment_query_service_1.PaymentQueryService])
], PaymentController);
//# sourceMappingURL=payment.controller.js.map