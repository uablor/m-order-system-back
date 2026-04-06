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
exports.PaymentQueryService = void 0;
const common_1 = require("@nestjs/common");
const payment_repository_1 = require("../repositories/payment.repository");
const response_helper_1 = require("../../../common/base/helpers/response.helper");
function extractPaymentProofUrl(paymentProofImage) {
    if (!paymentProofImage) {
        return '';
    }
    return paymentProofImage.publicUrl ||
        `${process.env.R2_PUBLIC_URL}/${paymentProofImage.fileKey}`;
}
let PaymentQueryService = class PaymentQueryService {
    paymentRepository;
    constructor(paymentRepository) {
        this.paymentRepository = paymentRepository;
    }
    async getById(id) {
        const payment = await this.paymentRepository.findById(id, [
            'customerOrder',
            'customerOrder.order',
            'customerOrder.customer',
            'verifiedBy',
            'rejectedBy',
        ]);
        if (!payment) {
            throw new common_1.NotFoundException('Payment not found');
        }
        return (0, response_helper_1.createSingleResponse)({
            ...payment,
            paymentProofUrl: extractPaymentProofUrl(payment.paymentProofImage),
        }, 'Payment retrieved successfully');
    }
    async getByIdWithOwnership(id, currentUser) {
        const payment = await this.paymentRepository.findById(id, [
            'customerOrder',
            'customerOrder.order',
            'customerOrder.customer',
            'verifiedBy',
            'rejectedBy',
        ]);
        if (!payment) {
            throw new common_1.NotFoundException('Payment not found');
        }
        if (currentUser.roleName === 'CUSTOMER') {
            if (payment.customerOrder.customer.id !== currentUser.userId) {
                throw new common_1.ForbiddenException('You can only view your own payments');
            }
        }
        else if (currentUser.roleName === 'MERCHANT') {
            if (payment.customerOrder.order.merchant.id !== currentUser.merchantId) {
                throw new common_1.ForbiddenException('You can only view payments for your own orders');
            }
        }
        return (0, response_helper_1.createSingleResponse)({
            ...payment,
            paymentProofUrl: extractPaymentProofUrl(payment.paymentProofImage),
        }, 'Payment retrieved successfully');
    }
    async getList(query) {
        const response = await this.paymentRepository.findByMerchant(0, query);
        const transformedResults = response.results.map(payment => ({
            ...payment,
            paymentProofUrl: extractPaymentProofUrl(payment.paymentProofImage),
        }));
        return (0, response_helper_1.createPaginatedResponse)(transformedResults, response.pagination, 'Payments retrieved successfully');
    }
    async getListByMerchant(query, currentUser) {
        if (!currentUser.merchantId) {
            throw new common_1.ForbiddenException('Only merchants can view their payments');
        }
        const response = await this.paymentRepository.findByMerchant(currentUser.merchantId, query);
        const transformedResults = response.results.map(payment => ({
            ...payment,
            paymentProofUrl: extractPaymentProofUrl(payment.paymentProofImage),
        }));
        return (0, response_helper_1.createPaginatedResponse)(transformedResults, response.pagination, 'Payments retrieved successfully');
    }
    async getUnreadPaymentsByMerchant(currentUser) {
        if (!currentUser.merchantId) {
            throw new common_1.ForbiddenException('Only merchants can view their unread payments');
        }
        const unreadQuery = {
            status: 'PENDING',
            readAt: null,
            limit: 10,
        };
        const response = await this.paymentRepository.findByMerchant(currentUser.merchantId, unreadQuery);
        const transformedResults = response.results.map(payment => ({
            ...payment,
            paymentProofUrl: extractPaymentProofUrl(payment.paymentProofImage),
        }));
        return (0, response_helper_1.createSingleResponse)(transformedResults, 'Unread payments retrieved successfully');
    }
    async getSummaryByMerchant(query, currentUser) {
        if (!currentUser.merchantId) {
            throw new common_1.ForbiddenException('Only merchants can view their payment summary');
        }
        return this.paymentRepository.getSummaryByMerchant(currentUser.merchantId, query);
    }
    async getListByCustomer(query, currentUser) {
        const response = await this.paymentRepository.findByCustomer(currentUser.userId, query);
        const transformedResults = response.results.map(payment => ({
            ...payment,
            paymentProofUrl: extractPaymentProofUrl(payment.paymentProofImage),
        }));
        return (0, response_helper_1.createPaginatedResponse)(transformedResults, response.pagination, 'Payments retrieved successfully');
    }
    async getByCustomerOrderId(customerOrderId, currentUser) {
        const payment = await this.paymentRepository.findByCustomerOrderId(customerOrderId, [
            'customerOrder',
            'customerOrder.order',
            'customerOrder.customer',
            'verifiedBy',
            'rejectedBy',
        ]);
        if (!payment) {
            return null;
        }
        if (currentUser) {
            if (currentUser.roleName === 'CUSTOMER') {
                if (payment.customerOrder.customer.id !== currentUser.userId) {
                    throw new common_1.ForbiddenException('You can only view your own payments');
                }
            }
            else if (currentUser.roleName === 'MERCHANT') {
                if (payment.customerOrder.order.merchant.id !== currentUser.merchantId) {
                    throw new common_1.ForbiddenException('You can only view payments for your own orders');
                }
            }
        }
        return (0, response_helper_1.createSingleResponse)({
            ...payment,
            paymentProofUrl: extractPaymentProofUrl(payment.paymentProofImage),
        }, 'Payment retrieved successfully');
    }
};
exports.PaymentQueryService = PaymentQueryService;
exports.PaymentQueryService = PaymentQueryService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [payment_repository_1.PaymentRepository])
], PaymentQueryService);
//# sourceMappingURL=payment-query.service.js.map