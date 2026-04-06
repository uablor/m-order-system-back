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
exports.NotificationController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const notification_command_service_1 = require("../services/notification-command.service");
const notification_query_service_1 = require("../services/notification-query.service");
const notification_update_dto_1 = require("../dto/notification-update.dto");
const notification_status_update_dto_1 = require("../dto/notification-status-update.dto");
const notification_list_query_dto_1 = require("../dto/notification-list-query.dto");
const notification_response_dto_1 = require("../dto/notification-response.dto");
const create_notification_dto_1 = require("../dto/create-notification.dto");
const current_user_decorator_1 = require("../../../common/decorators/current-user.decorator");
const swagger_decorators_1 = require("../../../common/swagger/swagger.decorators");
let NotificationController = class NotificationController {
    notificationCommandService;
    notificationQueryService;
    constructor(notificationCommandService, notificationQueryService) {
        this.notificationCommandService = notificationCommandService;
        this.notificationQueryService = notificationQueryService;
    }
    async getList(query, user) {
        return this.notificationQueryService.getList(query, user);
    }
    async createNotifications(dto, user) {
        return this.notificationCommandService.create(dto, user);
    }
    async createMultipleNotifications(dto, user) {
        return this.notificationCommandService.createMultiple(dto, user);
    }
    async getById(id) {
        return this.notificationQueryService.getByIdOrFail(id);
    }
    async merchantUpdate(id, dto) {
        return this.notificationCommandService.update(id, dto);
    }
    async updateStatusSent(id, dto) {
        return this.notificationCommandService.updateStatusSent(id, dto);
    }
    async adminDelete(id) {
        return this.notificationCommandService.delete(id);
    }
};
exports.NotificationController = NotificationController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'List notifications with pagination and filters' }),
    (0, swagger_1.ApiBearerAuth)('BearerAuth'),
    (0, swagger_decorators_1.ApiOkResponseBase)(),
    (0, swagger_decorators_1.ApiUnauthorizedBase)(),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [notification_list_query_dto_1.NotificationListQueryDto, Object]),
    __metadata("design:returntype", Promise)
], NotificationController.prototype, "getList", null);
__decorate([
    (0, common_1.Post)('create'),
    (0, swagger_1.ApiOperation)({ summary: 'Create notifications for customer orders' }),
    (0, swagger_1.ApiBearerAuth)('BearerAuth'),
    (0, swagger_decorators_1.ApiOkResponseBase)(),
    (0, swagger_decorators_1.ApiBadRequestBase)(),
    (0, swagger_decorators_1.ApiUnauthorizedBase)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_notification_dto_1.CreateNotificationDto, Object]),
    __metadata("design:returntype", Promise)
], NotificationController.prototype, "createNotifications", null);
__decorate([
    (0, common_1.Post)('create-multiple'),
    (0, swagger_1.ApiOperation)({ summary: 'Create multiple notifications for customer orders' }),
    (0, swagger_1.ApiBearerAuth)('BearerAuth'),
    (0, swagger_decorators_1.ApiOkResponseBase)(),
    (0, swagger_decorators_1.ApiBadRequestBase)(),
    (0, swagger_decorators_1.ApiUnauthorizedBase)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_notification_dto_1.CreateNotificationMultipleDto, Object]),
    __metadata("design:returntype", Promise)
], NotificationController.prototype, "createMultipleNotifications", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get notification by ID' }),
    (0, swagger_1.ApiBearerAuth)('BearerAuth'),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Notification ID' }),
    (0, swagger_decorators_1.ApiOkResponseBase)(notification_response_dto_1.NotificationResponseDto),
    (0, swagger_decorators_1.ApiNotFoundBase)(),
    (0, swagger_decorators_1.ApiUnauthorizedBase)(),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], NotificationController.prototype, "getById", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update notification' }),
    (0, swagger_1.ApiBearerAuth)('BearerAuth'),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Notification ID' }),
    (0, swagger_decorators_1.ApiOkResponseBase)(),
    (0, swagger_decorators_1.ApiBadRequestBase)(),
    (0, swagger_decorators_1.ApiNotFoundBase)(),
    (0, swagger_decorators_1.ApiUnauthorizedBase)(),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, notification_update_dto_1.NotificationUpdateDto]),
    __metadata("design:returntype", Promise)
], NotificationController.prototype, "merchantUpdate", null);
__decorate([
    (0, common_1.Patch)(':id/status'),
    (0, swagger_1.ApiOperation)({ summary: 'Update notification send status' }),
    (0, swagger_1.ApiBearerAuth)('BearerAuth'),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Notification ID' }),
    (0, swagger_decorators_1.ApiOkResponseBase)(),
    (0, swagger_decorators_1.ApiBadRequestBase)(),
    (0, swagger_decorators_1.ApiNotFoundBase)(),
    (0, swagger_decorators_1.ApiUnauthorizedBase)(),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, notification_status_update_dto_1.NotificationStatusUpdateDto]),
    __metadata("design:returntype", Promise)
], NotificationController.prototype, "updateStatusSent", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete notification' }),
    (0, swagger_1.ApiBearerAuth)('BearerAuth'),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Notification ID' }),
    (0, swagger_decorators_1.ApiNotFoundBase)(),
    (0, swagger_decorators_1.ApiUnauthorizedBase)(),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], NotificationController.prototype, "adminDelete", null);
exports.NotificationController = NotificationController = __decorate([
    (0, swagger_1.ApiTags)('Notifications'),
    (0, common_1.Controller)('notifications'),
    __metadata("design:paramtypes", [notification_command_service_1.NotificationCommandService,
        notification_query_service_1.NotificationQueryService])
], NotificationController);
//# sourceMappingURL=notification.controller.js.map