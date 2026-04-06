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
exports.ArrivalCommandService = void 0;
const common_1 = require("@nestjs/common");
const transaction_service_1 = require("../../../common/transaction/transaction.service");
const arrival_repository_1 = require("../repositories/arrival.repository");
const arrival_item_repository_1 = require("../repositories/arrival-item.repository");
const order_repository_1 = require("../../orders/repositories/order.repository");
const merchant_repository_1 = require("../../merchants/repositories/merchant.repository");
const dayjs_util_1 = require("../../../common/utils/dayjs.util");
const notification_command_service_1 = require("../../notifications/services/notification-command.service");
let ArrivalCommandService = class ArrivalCommandService {
    transactionService;
    arrivalRepository;
    arrivalItemRepository;
    orderRepository;
    merchantRepository;
    notificationCommandService;
    constructor(transactionService, arrivalRepository, arrivalItemRepository, orderRepository, merchantRepository, notificationCommandService) {
        this.transactionService = transactionService;
        this.arrivalRepository = arrivalRepository;
        this.arrivalItemRepository = arrivalItemRepository;
        this.orderRepository = orderRepository;
        this.merchantRepository = merchantRepository;
        this.notificationCommandService = notificationCommandService;
    }
    async create(dto, currentUser) {
        return this.transactionService.run(async (manager) => {
            const order = await this.orderRepository.getRepo(manager).findOne({
                where: { id: dto.orderId },
                relations: [
                    'merchant',
                    'customerOrders',
                    'customerOrders.customer',
                    'orderItems',
                ],
            });
            if (!order)
                throw new common_1.NotFoundException('Order not found');
            const merchant = await this.merchantRepository.findOneById(currentUser.merchantId, manager);
            if (!merchant)
                throw new common_1.NotFoundException('Merchant not found');
            if (order.merchant?.id !== merchant.id) {
                throw new common_1.BadRequestException('Order does not belong to this merchant');
            }
            const arrivedDate = new Date();
            const arrivedTime = (0, dayjs_util_1.formatTime)(arrivedDate);
            const recordedBy = currentUser.userId;
            const orderItemMap = new Map();
            for (const oi of order.orderItems ?? []) {
                orderItemMap.set(oi.id, oi);
            }
            for (const item of dto.arrivalItems) {
                const orderItem = orderItemMap.get(item.orderItemId);
                if (!orderItem) {
                    throw new common_1.BadRequestException(`Order item ${item.orderItemId} not found in this order`);
                }
                if (item.arrivedQuantity > orderItem.quantity) {
                    throw new common_1.BadRequestException(`Arrived quantity (${item.arrivedQuantity}) exceeds order item quantity (${orderItem.quantity}) for product "${orderItem.productName}"`);
                }
            }
            const arrival = await this.arrivalRepository.create({
                order,
                merchant,
                arrivedDate,
                arrivedTime: arrivedTime,
                recordedByUser: recordedBy != null ? { id: recordedBy } : null,
                notes: dto.notes ?? null,
            }, manager);
            const arrivalItems = [];
            const damagedOrLost = [];
            for (const itemDto of dto.arrivalItems) {
                const orderItem = orderItemMap.get(itemDto.orderItemId);
                const condition = itemDto.condition ?? 'OK';
                if (condition === 'DAMAGED')
                    damagedOrLost.push(`${orderItem.productName}: DAMAGED`);
                if (condition === 'LOST')
                    damagedOrLost.push(`${orderItem.productName}: LOST`);
                const arrivalItem = await this.arrivalItemRepository.create({
                    arrival,
                    orderItem,
                    arrivedQuantity: itemDto.arrivedQuantity,
                    condition: condition,
                    notes: itemDto.notes ?? null,
                }, manager);
                arrivalItems.push(arrivalItem);
            }
            const arrivedDateStr = arrivedDate.toISOString().slice(0, 10);
            let messageContent = `Your order ${order.orderCode} has arrived on ${arrivedDateStr}.`;
            if (damagedOrLost.length > 0) {
                messageContent += ` Note: ${damagedOrLost.join('; ')}.`;
            }
            const notificationLinkPath = `/orders/${order.id}`;
            const customerOrders = order.customerOrders ?? [];
            const seenCustomerIds = new Set();
            const customers = [];
            for (const co of customerOrders) {
                const customer = co.customer;
                if (!customer || seenCustomerIds.has(customer.id))
                    continue;
                seenCustomerIds.add(customer.id);
                customers.push({
                    id: customer.id,
                    contactFacebook: customer.contactFacebook,
                    contactLine: customer.contactLine,
                    contactWhatsapp: customer.contactWhatsapp,
                    preferredContactMethod: customer.preferredContactMethod,
                    token: customer.uniqueToken,
                });
            }
            await this.orderRepository.update(order.id, {
                arrivalStatus: 'ARRIVED',
                arrivedAt: arrivedDate,
            }, manager);
            const arrivalReloaded = await this.arrivalRepository
                .getRepo(manager)
                .findOne({
                where: { id: arrival.id },
                relations: [
                    'arrivalItems',
                    'arrivalItems.orderItem',
                    'order',
                    'merchant',
                ],
            });
            return {
                success: true,
                arrival: arrivalReloaded ?? { ...arrival, arrivalItems },
                message: 'Arrival recorded and notifications sent successfully',
            };
        });
    }
    async createMultiple(dto, currentUser) {
        return this.transactionService.run(async (manager) => {
            const merchant = await this.merchantRepository.findOneById(currentUser.merchantId, manager);
            if (!merchant)
                throw new common_1.NotFoundException('Merchant not found');
            const arrivedDate = new Date();
            const arrivedTime = (0, dayjs_util_1.formatTime)(arrivedDate);
            const recordedBy = currentUser.userId;
            const arrivals = [];
            const failedOrders = [];
            let processedOrders = 0;
            for (const orderDto of dto.orders) {
                try {
                    const order = await this.orderRepository.getRepo(manager).findOne({
                        where: { id: orderDto.orderId },
                        relations: [
                            'merchant',
                            'customerOrders',
                            'customerOrders.customer',
                            'orderItems',
                        ],
                    });
                    if (!order) {
                        failedOrders.push({ orderId: orderDto.orderId, error: 'Order not found' });
                        continue;
                    }
                    if (order.merchant?.id !== merchant.id) {
                        failedOrders.push({ orderId: orderDto.orderId, error: 'Order does not belong to this merchant' });
                        continue;
                    }
                    if (order.arrivalStatus === 'ARRIVED') {
                        failedOrders.push({ orderId: orderDto.orderId, error: 'Order already arrived' });
                        continue;
                    }
                    const orderItemMap = new Map();
                    for (const oi of order.orderItems ?? []) {
                        orderItemMap.set(oi.id, oi);
                    }
                    for (const item of orderDto.arrivalItems) {
                        const orderItem = orderItemMap.get(item.orderItemId);
                        if (!orderItem) {
                            throw new common_1.BadRequestException(`Order item ${item.orderItemId} not found in order ${orderDto.orderId}`);
                        }
                        if (item.arrivedQuantity > orderItem.quantity) {
                            throw new common_1.BadRequestException(`Arrived quantity (${item.arrivedQuantity}) exceeds order item quantity (${orderItem.quantity}) for product "${orderItem.productName}" in order ${orderDto.orderId}`);
                        }
                    }
                    const arrival = await this.arrivalRepository.create({
                        order,
                        merchant,
                        arrivedDate,
                        arrivedTime: arrivedTime,
                        recordedByUser: recordedBy != null ? { id: recordedBy } : null,
                        notes: orderDto.notes ?? dto.notes ?? null,
                    }, manager);
                    const arrivalItems = [];
                    const damagedOrLost = [];
                    for (const itemDto of orderDto.arrivalItems) {
                        const orderItem = orderItemMap.get(itemDto.orderItemId);
                        const condition = itemDto.condition ?? 'OK';
                        if (condition === 'DAMAGED')
                            damagedOrLost.push(`${orderItem.productName}: DAMAGED`);
                        if (condition === 'LOST')
                            damagedOrLost.push(`${orderItem.productName}: LOST`);
                        const arrivalItem = await this.arrivalItemRepository.create({
                            arrival,
                            orderItem,
                            arrivedQuantity: itemDto.arrivedQuantity,
                            condition: condition,
                            notes: itemDto.notes ?? null,
                        }, manager);
                        arrivalItems.push(arrivalItem);
                    }
                    await this.orderRepository.update(order.id, {
                        arrivalStatus: 'ARRIVED',
                        arrivedAt: arrivedDate,
                    }, manager);
                    const arrivalReloaded = await this.arrivalRepository
                        .getRepo(manager)
                        .findOne({
                        where: { id: arrival.id },
                        relations: [
                            'arrivalItems',
                            'arrivalItems.orderItem',
                            'order',
                            'merchant',
                        ],
                    });
                    arrivals.push(arrivalReloaded ?? { ...arrival, arrivalItems });
                    processedOrders++;
                }
                catch (error) {
                    failedOrders.push({
                        orderId: orderDto.orderId,
                        error: error instanceof Error ? error.message : 'Unknown error',
                    });
                }
            }
            let notifications = [];
            if (dto.notification && dto.notis && dto.notis.length > 0) {
                notifications = await this.notificationCommandService.createMultiple({ notifications: dto.notis, language: dto.language ?? 'en' }, currentUser);
            }
            return {
                success: true,
                arrivals,
                message: `Processed ${processedOrders} orders successfully${failedOrders.length > 0 ? ` with ${failedOrders.length} failures` : ''}`,
                processedOrders,
                failedOrders,
                notifications,
            };
        });
    }
    async update(id, dto) {
        await this.transactionService.run(async (manager) => {
            const existing = await this.arrivalRepository.findOneById(id, manager);
            if (!existing)
                throw new common_1.NotFoundException('Arrival not found');
            const updateData = {};
            if (dto.arrivedDate !== undefined)
                updateData.arrivedDate = new Date(dto.arrivedDate);
            if (dto.arrivedTime !== undefined)
                updateData.arrivedTime = dto.arrivedTime;
            if (dto.recordedBy !== undefined)
                updateData.recordedByUser =
                    dto.recordedBy != null ? { id: dto.recordedBy } : null;
            if (dto.notes !== undefined)
                updateData.notes = dto.notes ?? null;
            await this.arrivalRepository.update(id, updateData, manager);
        });
    }
    async delete(id) {
        await this.transactionService.run(async (manager) => {
            const existing = await this.arrivalRepository.findOneById(id, manager);
            if (!existing)
                throw new common_1.NotFoundException('Arrival not found');
            await this.arrivalRepository.delete(id, manager);
        });
    }
};
exports.ArrivalCommandService = ArrivalCommandService;
exports.ArrivalCommandService = ArrivalCommandService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [transaction_service_1.TransactionService,
        arrival_repository_1.ArrivalRepository,
        arrival_item_repository_1.ArrivalItemRepository,
        order_repository_1.OrderRepository,
        merchant_repository_1.MerchantRepository,
        notification_command_service_1.NotificationCommandService])
], ArrivalCommandService);
//# sourceMappingURL=arrival-command.service.js.map