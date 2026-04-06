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
exports.NotificationCommandService = void 0;
const common_1 = require("@nestjs/common");
const transaction_service_1 = require("../../../common/transaction/transaction.service");
const notification_repository_1 = require("../repositories/notification.repository");
const generate_unique_token_utils_1 = require("../../../common/utils/generate-unique-token.utils");
const config_1 = require("@nestjs/config");
const customer_query_repository_1 = require("../../customers/repositories/customer.query-repository");
const notification_enum_1 = require("../enum/notification.enum");
const customer_order_orm_entity_1 = require("../../orders/entities/customer-order.orm-entity");
const typeorm_1 = require("typeorm");
const notification_query_repository_1 = require("../repositories/notification.query-repository");
let NotificationCommandService = class NotificationCommandService {
    transactionService;
    notificationRepository;
    notificationQueryRepository;
    configService;
    customerQueryRepository;
    constructor(transactionService, notificationRepository, notificationQueryRepository, configService, customerQueryRepository) {
        this.transactionService = transactionService;
        this.notificationRepository = notificationRepository;
        this.notificationQueryRepository = notificationQueryRepository;
        this.configService = configService;
        this.customerQueryRepository = customerQueryRepository;
    }
    async update(id, dto) {
        await this.transactionService.run(async (manager) => {
            const existing = await this.notificationRepository.findOneById(id, manager);
            if (!existing)
                throw new common_1.NotFoundException('Notification not found');
            const updateData = {};
            if (dto.status !== undefined)
                updateData.status = dto.status;
            if (dto.retryCount !== undefined)
                updateData.retryCount = dto.retryCount;
            if (dto.lastRetryAt !== undefined)
                updateData.lastRetryAt = dto.lastRetryAt ? new Date(dto.lastRetryAt) : null;
            if (dto.sentAt !== undefined)
                updateData.sentAt = dto.sentAt ? new Date(dto.sentAt) : null;
            if (dto.errorMessage !== undefined)
                updateData.errorMessage = dto.errorMessage ?? null;
            await this.notificationRepository.update(id, updateData, manager);
        });
    }
    async updateStatusSent(id, dto) {
        await this.transactionService.run(async (manager) => {
            const existing = await this.notificationRepository.findOneById(id, manager);
            if (!existing)
                throw new common_1.NotFoundException('Notification not found');
            const updateData = {};
            if (dto.status !== undefined) {
                updateData.status = dto.status;
                if (dto.status === notification_enum_1.NotificationStatus.SENT && !existing.sentAt) {
                    updateData.sentAt = new Date();
                }
            }
            await this.notificationRepository.update(id, updateData, manager);
        });
    }
    async delete(id) {
        await this.transactionService.run(async (manager) => {
            const existing = await this.notificationRepository.findOneById(id, manager);
            if (!existing)
                throw new common_1.NotFoundException('Notification not found');
            await this.notificationRepository.delete(id, manager);
        });
    }
    async create(dto, currentUser, manager) {
        if (manager) {
            const { notification } = await this.createInternalWithCustomer(dto, currentUser, manager);
            return notification;
        }
        return this.transactionService.run(async (manager) => {
            const { notification } = await this.createInternalWithCustomer(dto, currentUser, manager);
            return notification;
        });
    }
    async createMultiple(dto, currentUser) {
        return this.transactionService.run(async (manager) => {
            const results = [];
            const language = dto.language ?? 'en';
            for (const notificationData of dto.notifications) {
                const { notification, customer } = await this.createInternalWithCustomer({ ...notificationData, language }, currentUser, manager);
                results.push({
                    recipientContact: notification.recipientContact,
                    notificationLink: notification.notificationLink,
                    language: notification.language ?? language,
                    customer: customer ? { customerName: customer.customerName } : null,
                    relatedOrders: notification.relatedOrders,
                });
            }
            return results;
        });
    }
    async createInternalWithCustomer(dto, currentUser, manager) {
        let notificationsToken = (0, generate_unique_token_utils_1.generateUniqueToken)();
        let exists = await this.notificationRepository.findOneBy({ uniqueToken: notificationsToken }, manager);
        while (exists) {
            notificationsToken = (0, generate_unique_token_utils_1.generateUniqueToken)();
            exists = await this.notificationRepository.findOneBy({ uniqueToken: notificationsToken }, manager);
        }
        const customer = await this.customerQueryRepository.findOneByIdWithMerchant(dto.customerId, currentUser, manager);
        if (!customer)
            throw new common_1.NotFoundException('Customer not found');
        const customerOrders = await manager.getRepository(customer_order_orm_entity_1.CustomerOrderOrmEntity).find({
            where: {
                id: (0, typeorm_1.In)(dto.customerOrderIds),
                order: {
                    merchant: {
                        id: currentUser.merchantId,
                    },
                },
            },
            relations: ['order'],
            select: {
                id: true,
                order: { id: true },
            },
        });
        if (customerOrders.length !== dto.customerOrderIds.length) {
            throw new common_1.NotFoundException('Some orders not found');
        }
        const notificationQuery = await this.notificationQueryRepository.findCustomerOrderBy(dto.customerOrderIds, manager);
        if (notificationQuery.length > 0) {
            throw new common_1.BadRequestException('Some orders already have notifications');
        }
        const baseUrl = (this.configService.get('FRONTEND_URL') || '').replace(/\/$/, '');
        const notificationLink = `${baseUrl}/customer/item-arrived?customerToken=${customer.uniqueToken}&notificationToken=${notificationsToken}`;
        const notification = await this.notificationRepository.create({
            customer: { id: customer.id },
            merchant: { id: currentUser.merchantId },
            messageContent: dto.message || 'Your order has been updated',
            notificationLink,
            uniqueToken: notificationsToken,
            channel: notification_enum_1.NotificationChannel.FB,
            notificationType: notification_enum_1.NotificationType.ARRIVAL,
            recipientContact: customer.contactWhatsapp || customer.contactPhone || '',
            status: notification_enum_1.NotificationStatus.PENDING,
            sentAt: new Date(),
            retryCount: 0,
            relatedOrders: customerOrders.map((co) => co.id),
            language: dto.language ?? 'en',
        }, manager);
        const coRepo = manager.getRepository(customer_order_orm_entity_1.CustomerOrderOrmEntity);
        await coRepo.update({ id: (0, typeorm_1.In)(customerOrders.map((c) => c.id)) }, { notification: notification });
        return { notification, customer: { id: customer.id, customerName: customer.customerName } };
    }
};
exports.NotificationCommandService = NotificationCommandService;
exports.NotificationCommandService = NotificationCommandService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [transaction_service_1.TransactionService,
        notification_repository_1.NotificationRepository,
        notification_query_repository_1.NotificationQueryRepository,
        config_1.ConfigService,
        customer_query_repository_1.CustomerQueryRepository])
], NotificationCommandService);
//# sourceMappingURL=notification-command.service.js.map