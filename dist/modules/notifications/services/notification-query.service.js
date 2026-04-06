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
exports.NotificationQueryService = void 0;
const common_1 = require("@nestjs/common");
const notification_repository_1 = require("../repositories/notification.repository");
const notification_query_repository_1 = require("../repositories/notification.query-repository");
const response_helper_1 = require("../../../common/base/helpers/response.helper");
let NotificationQueryService = class NotificationQueryService {
    notificationRepository;
    notificationQueryRepository;
    constructor(notificationRepository, notificationQueryRepository) {
        this.notificationRepository = notificationRepository;
        this.notificationQueryRepository = notificationQueryRepository;
    }
    async getById(id) {
        const entity = await this.notificationQueryRepository.repository.findOne({
            where: { id },
            relations: ['merchant', 'customer'],
        });
        if (!entity)
            return null;
        return this.toResponse(entity);
    }
    async getByIdOrFail(id) {
        const dto = await this.getById(id);
        if (!dto)
            throw new common_1.NotFoundException('Notification not found');
        return (0, response_helper_1.createSingleResponse)(dto);
    }
    async getList(query, user) {
        const paginationOptions = {
            page: query.page,
            limit: query.limit,
            customerId: query.customerId,
            notificationType: query.notificationType,
            status: query.status,
            search: query.search,
            startDate: query.startDate,
            endDate: query.endDate,
        };
        if (user?.merchantId) {
            paginationOptions.merchantId = user.merchantId;
        }
        else {
            paginationOptions.merchantId = query.merchantId;
        }
        const result = await this.notificationQueryRepository.findWithPagination(paginationOptions);
        return (0, response_helper_1.createPaginatedResponse)(result.results.map((e) => this.toResponse(e)), result.pagination);
    }
    toResponse(entity) {
        return {
            id: entity.id,
            merchant: {
                id: entity.merchant?.id ?? 0,
                ownerUserId: entity.merchant?.ownerUserId ?? 0,
                shopName: entity.merchant?.shopName,
                shopLogoUrl: entity.merchant?.shopLogoUrl,
                shopAddress: entity.merchant?.shopAddress,
                contactPhone: entity.merchant?.contactPhone,
                contactEmail: entity.merchant?.contactEmail,
                contactFacebook: entity.merchant?.contactFacebook,
                contactLine: entity.merchant?.contactLine,
                contactWhatsapp: entity.merchant?.contactWhatsapp,
                defaultCurrency: entity.merchant?.defaultCurrency,
                isActive: entity.merchant?.isActive ?? false,
                createdAt: entity.merchant?.createdAt,
                updatedAt: entity.merchant?.updatedAt,
            },
            customer: {
                id: entity.customer?.id ?? 0,
                merchantId: entity.customer?.merchant?.id ?? 0,
                customerName: entity.customer?.customerName,
                customerType: entity.customer?.customerType,
                contactPhone: entity.customer?.contactPhone,
                shippingAddress: entity.customer?.shippingAddress,
                shippingProvider: entity.customer?.shippingProvider,
                shippingSource: entity.customer?.shippingSource,
                shippingDestination: entity.customer?.shippingDestination,
                paymentTerms: entity.customer?.paymentTerms,
                contactFacebook: entity.customer?.contactFacebook,
                contactWhatsapp: entity.customer?.contactWhatsapp,
                contactLine: entity.customer?.contactLine,
                preferredContactMethod: entity.customer?.preferredContactMethod,
                uniqueToken: entity.customer?.uniqueToken,
                isActive: entity.customer?.isActive,
                createdAt: entity.customer?.createdAt,
                updatedAt: entity.customer?.updatedAt,
            },
            notificationType: entity.notificationType,
            channel: entity.channel,
            recipientContact: entity.recipientContact,
            messageContent: entity.messageContent,
            notificationLink: entity.notificationLink ?? null,
            retryCount: entity.retryCount,
            lastRetryAt: entity.lastRetryAt ?? null,
            status: entity.status,
            sentAt: entity.sentAt ?? null,
            errorMessage: entity.errorMessage ?? null,
            relatedOrders: entity.relatedOrders ?? null,
            createdAt: entity.createdAt,
            updatedAt: entity.updatedAt,
        };
    }
};
exports.NotificationQueryService = NotificationQueryService;
exports.NotificationQueryService = NotificationQueryService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [notification_repository_1.NotificationRepository,
        notification_query_repository_1.NotificationQueryRepository])
], NotificationQueryService);
//# sourceMappingURL=notification-query.service.js.map