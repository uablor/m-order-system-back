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
exports.PaymentCommandService = void 0;
const common_1 = require("@nestjs/common");
const payment_repository_1 = require("../repositories/payment.repository");
const payment_orm_entity_1 = require("../entities/payment.orm-entity");
const customer_order_orm_entity_1 = require("../../orders/entities/customer-order.orm-entity");
const transaction_service_1 = require("../../../common/transaction/transaction.service");
const response_helper_1 = require("../../../common/base/helpers/response.helper");
const image_query_repository_1 = require("../../images/repositories/image.query-repository");
const order_orm_entity_1 = require("../../orders/entities/order.orm-entity");
const payment_enum_1 = require("../enum/payment.enum");
const customer_order_repository_1 = require("../../orders/repositories/customer-order.repository");
const order_repository_1 = require("../../orders/repositories/order.repository");
let PaymentCommandService = class PaymentCommandService {
    paymentRepository;
    transactionService;
    imageQueryRepository;
    orderRepository;
    customerOrderRepository;
    constructor(paymentRepository, transactionService, imageQueryRepository, orderRepository, customerOrderRepository) {
        this.paymentRepository = paymentRepository;
        this.transactionService = transactionService;
        this.imageQueryRepository = imageQueryRepository;
        this.orderRepository = orderRepository;
        this.customerOrderRepository = customerOrderRepository;
    }
    async create(dto, currentUser) {
        const payment = await this.transactionService.run(async (manager) => {
            const customerOrderRepo = manager.getRepository(customer_order_orm_entity_1.CustomerOrderOrmEntity);
            const customerOrder = await customerOrderRepo.findOne({
                where: { id: dto.customerOrderId },
                relations: ['order', 'order.merchant'],
            });
            if (!customerOrder) {
                throw new common_1.NotFoundException('Customer order not found');
            }
            if (!customerOrder.order.arrivedAt) {
                throw new common_1.BadRequestException('Order must be arrived before making a payment');
            }
            if (currentUser && currentUser.merchantId && currentUser.merchantId !== customerOrder.order.merchant.id) {
                throw new common_1.ForbiddenException('You are not authorized to make a payment for this order');
            }
            const image = dto.paymentProofImageId != null
                ? await this.imageQueryRepository.findByIdWithRelations(dto.paymentProofImageId, manager)
                : null;
            if (dto.paymentAmount > customerOrder.remainingAmount) {
                throw new common_1.BadRequestException(`Payment amount (${dto.paymentAmount}) cannot exceed remaining amount (${customerOrder.remainingAmount})`);
            }
            if (customerOrder.paymentStatus != payment_enum_1.PaymentStatusEnum.NOT_CREATED) {
                throw new common_1.BadRequestException('This order already has a payment created');
            }
            const newPayment = await this.paymentRepository.create({
                customerOrderId: dto.customerOrderId,
                paymentAmount: dto.paymentAmount,
                paymentProofImageId: image?.id ?? undefined,
                paymentProofImage: image ?? undefined,
                customerMessage: dto.customerMessage,
                status: payment_enum_1.PaymentVerificationStatusEnum.PENDING,
                paymentDate: new Date(),
            }, manager);
            await customerOrderRepo.update(customerOrder.id, {
                paymentStatus: payment_enum_1.PaymentStatusEnum.UNPAID,
            });
            return newPayment;
        });
        return (0, response_helper_1.createSingleResponse)(payment, 'Payment created successfully');
    }
    async delete(id) {
        return this.transactionService.run(async (manager) => {
            const paymentRepo = manager.getRepository(payment_orm_entity_1.PaymentOrmEntity);
            const payment = await paymentRepo.findOne({
                where: { id },
            });
            if (!payment) {
                throw new common_1.NotFoundException('Payment not found');
            }
            if (payment.status !== 'PENDING') {
                throw new common_1.BadRequestException('Only pending payments can be deleted');
            }
            await paymentRepo.delete(id);
        });
    }
    async rejectInternal(id, dto, currentUser, manager) {
        const payment = await this.paymentRepository.findById(id, [
            'customerOrder',
            'customerOrder.order',
            'customerOrder.order.merchant',
        ]);
        if (!payment) {
            throw new common_1.NotFoundException('Payment not found');
        }
        if (payment.status !== payment_enum_1.PaymentVerificationStatusEnum.PENDING) {
            throw new common_1.BadRequestException('Only pending payments can be rejected');
        }
        const customerOrder = await this.customerOrderRepository.findOneById(payment.customerOrderId);
        if (!customerOrder) {
            throw new common_1.NotFoundException('Customer order not found');
        }
        const order = await this.orderRepository.findOneById(payment.customerOrder?.order?.id);
        const paymentMerchantId = payment.customerOrder?.order?.merchant?.id;
        if (typeof currentUser.merchantId === 'number' && typeof paymentMerchantId === 'number') {
            if (paymentMerchantId !== currentUser.merchantId) {
                throw new common_1.ForbiddenException('You can only reject payments for your own store');
            }
        }
        const paymenht = this.paymentRepository.update(id, {
            status: payment_enum_1.PaymentVerificationStatusEnum.REJECTED,
            rejectedById: currentUser.userId,
            rejectedAt: new Date(),
            rejectReason: dto.rejectReason,
        }, manager);
        await this.customerOrderRepository.update(customerOrder.id, {
            paymentStatus: payment_enum_1.PaymentStatusEnum.UNPAID,
        }, manager);
        await this.orderRepository.update(order?.id, {
            paymentStatus: payment_enum_1.PaymentStatusEnum.UNPAID,
        }, manager);
        return paymenht;
    }
    async reject(id, dto, currentUser) {
        return this.transactionService.run(async (manager) => {
            return this.rejectInternal(id, dto, currentUser, manager);
        });
    }
    async bulkReject(dto, currentUser) {
        return this.transactionService.run(async (manager) => {
            const results = [];
            for (const id of dto.paymentIds) {
                const result = await this.rejectInternal(id, { rejectReason: dto.rejectReason }, currentUser, manager);
                results.push(result);
            }
            return results;
        });
    }
    async verifyInternal(id, currentUser, manager) {
        const payment = await this.paymentRepository.findById(id, [
            'customerOrder',
            'customerOrder.order',
            'customerOrder.order.merchant',
        ]);
        if (!payment) {
            throw new common_1.NotFoundException('Payment not found');
        }
        if (payment.status !== payment_enum_1.PaymentVerificationStatusEnum.PENDING) {
            throw new common_1.BadRequestException('Only pending payments can be verified');
        }
        const paymentMerchantId = payment.customerOrder?.order?.merchant?.id;
        if (typeof currentUser.merchantId === 'number' && typeof paymentMerchantId === 'number') {
            if (paymentMerchantId !== currentUser.merchantId) {
                throw new common_1.ForbiddenException('You can only verify payments for your own store');
            }
        }
        const customerOrderRepo = manager.getRepository(customer_order_orm_entity_1.CustomerOrderOrmEntity);
        const customerOrder = await customerOrderRepo.findOne({
            where: { id: payment.customerOrderId },
            relations: ['order'],
        });
        if (!customerOrder) {
            throw new common_1.NotFoundException('Customer order not found');
        }
        const orderRepo = manager.getRepository(order_orm_entity_1.OrderOrmEntity);
        const orderEntity = await orderRepo.findOne({
            where: { id: customerOrder?.order.id }, relations: ['merchant', 'customerOrders'],
        });
        const updatedPayment = await this.paymentRepository.update(id, {
            status: payment_enum_1.PaymentVerificationStatusEnum.VERIFIED,
            verifiedById: currentUser.userId,
            verifiedAt: new Date(),
        }, manager);
        let remainingAmount;
        const currentPaid = Number(customerOrder.totalPaid) || 0;
        const paymentAmount = Number(updatedPayment.paymentAmount) || 0;
        const currentRemaining = Number(customerOrder.remainingAmount) || 0;
        const newPaid = currentPaid + paymentAmount;
        remainingAmount = currentRemaining - paymentAmount;
        await customerOrderRepo.update(customerOrder.id, {
            totalPaid: newPaid,
            remainingAmount: remainingAmount,
            paymentStatus: payment_enum_1.PaymentStatusEnum.PAID,
        });
        const isPaid = orderEntity?.customerOrders?.every(co => co.paymentStatus === payment_enum_1.PaymentStatusEnum.PAID);
        if (orderEntity && isPaid !== undefined) {
            await orderRepo.update(orderEntity.id, {
                paymentStatus: isPaid ? payment_enum_1.PaymentStatusEnum.PAID : payment_enum_1.PaymentStatusEnum.UNPAID,
            });
        }
        return updatedPayment;
    }
    async verify(id, currentUser) {
        return this.transactionService.run(async (manager) => {
            return this.verifyInternal(id, currentUser, manager);
        });
    }
    async bulkVerify(paymentIds, currentUser) {
        return this.transactionService.run(async (manager) => {
            const results = [];
            for (const id of paymentIds) {
                const result = await this.verifyInternal(id, currentUser, manager);
                results.push(result);
            }
            return results;
        });
    }
    async markAsRead(id, currentUser) {
        const payment = await this.paymentRepository.findById(id);
        if (!payment) {
            throw new common_1.NotFoundException('Payment not found');
        }
        if (currentUser.roleName === 'MERCHANT') {
            if (!payment.customerOrder?.order?.merchant) {
                throw new common_1.NotFoundException('Payment order not found');
            }
            if (payment.customerOrder.order.merchant.id !== currentUser.merchantId) {
                throw new common_1.ForbiddenException('You can only mark your own payments as read');
            }
        }
        await this.paymentRepository.update(id, {
            readAt: new Date(),
        });
        const updatedPayment = await this.paymentRepository.findById(id);
        return updatedPayment;
    }
};
exports.PaymentCommandService = PaymentCommandService;
exports.PaymentCommandService = PaymentCommandService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [payment_repository_1.PaymentRepository,
        transaction_service_1.TransactionService,
        image_query_repository_1.ImageQueryRepository,
        order_repository_1.OrderRepository,
        customer_order_repository_1.CustomerOrderRepository])
], PaymentCommandService);
//# sourceMappingURL=payment-command.service.js.map