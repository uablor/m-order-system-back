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
exports.ArrivalQueryService = void 0;
const common_1 = require("@nestjs/common");
const arrival_query_repository_1 = require("../repositories/arrival.query-repository");
const arrival_repository_1 = require("../repositories/arrival.repository");
const response_helper_1 = require("../../../common/base/helpers/response.helper");
let ArrivalQueryService = class ArrivalQueryService {
    arrivalRepository;
    arrivalQueryRepository;
    constructor(arrivalRepository, arrivalQueryRepository) {
        this.arrivalRepository = arrivalRepository;
        this.arrivalQueryRepository = arrivalQueryRepository;
    }
    async getById(id) {
        const entity = await this.arrivalQueryRepository.repository.findOne({
            where: { id },
            relations: ['order', 'merchant', 'recordedByUser', 'arrivalItems', 'arrivalItems.orderItem', 'arrivalItems.orderItem.image', 'arrivalItems.orderItem.skus'],
        });
        if (!entity)
            return null;
        return this.toResponse(entity);
    }
    async getByIdOrFail(id) {
        const dto = await this.getById(id);
        if (!dto)
            throw new common_1.NotFoundException('Arrival not found');
        return (0, response_helper_1.createSingleResponse)(dto);
    }
    async getByIdWithItems(id) {
        const entity = await this.arrivalQueryRepository.repository.findOne({
            where: { id },
            relations: ['order', 'merchant', 'recordedByUser', 'arrivalItems', 'arrivalItems.orderItem', 'arrivalItems.orderItem.image', 'arrivalItems.orderItem.skus'],
        });
        if (!entity)
            return null;
        return this.toResponse(entity);
    }
    async getList(query) {
        const result = await this.arrivalQueryRepository.findWithPagination({
            page: query.page,
            limit: query.limit,
            search: query.search,
            searchField: query.searchField,
            sort: query.sort,
            merchantId: query.merchantId,
            orderId: query.orderId,
            orderItemId: query.orderItemId,
            startDate: query.startDate,
            endDate: query.endDate,
            createdByUserId: query.createdByUserId,
            arrivalDate: query.arrivalDate,
            arrivalTime: query.arrivalTime,
            arrival: query.arrival,
            customerId: query.customerId,
            notification: query.notification,
        });
        return (0, response_helper_1.createPaginatedResponse)(result.results, result.pagination);
    }
    async getListByMerchant(query, currentUser) {
        const result = await this.arrivalQueryRepository.findWithPagination({
            page: query.page,
            limit: query.limit,
            search: query.search,
            searchField: query.searchField,
            sort: query.sort,
            merchantId: currentUser.merchantId,
            orderId: query.orderId,
            orderItemId: query.orderItemId,
            startDate: query.startDate,
            endDate: query.endDate,
            createdByUserId: query.createdByUserId,
            arrivalDate: query.arrivalDate,
            arrivalTime: query.arrivalTime,
            arrival: query.arrival,
            customerId: query.customerId,
            notification: query.notification,
        });
        return (0, response_helper_1.createPaginatedResponse)(result.results.map((e) => this.toResponse(e)), result.pagination);
    }
    async getSummary(query) {
        return this.arrivalQueryRepository.getSummary({
            merchantId: query.merchantId,
            orderId: query.orderId,
            orderItemId: query.orderItemId,
            startDate: query.startDate,
            endDate: query.endDate,
            search: query.search,
            createdByUserId: query.createdByUserId,
            arrivalDate: query.arrivalDate,
            arrivalTime: query.arrivalTime,
            arrival: query.arrival,
            customerId: query.customerId,
        });
    }
    async getSummaryByMerchant(query, currentUser) {
        return this.getSummary({ ...query, merchantId: currentUser.merchantId });
    }
    toResponse(entity) {
        const arrivedDate = entity.arrivedDate instanceof Date
            ? entity.arrivedDate.toISOString().slice(0, 10)
            : String(entity.arrivedDate);
        const orderDto = entity.order
            ? {
                id: entity.order.id,
                orderCode: entity.order.orderCode,
                orderDate: entity.order.orderDate instanceof Date
                    ? entity.order.orderDate.toISOString().slice(0, 10)
                    : String(entity.order.orderDate),
                totalAmount: 0,
                currency: 'LAK',
                status: entity.order.arrivalStatus ?? 'PENDING',
                paymentStatus: 'PENDING',
                customer: null,
                customerOrders: (entity.order.customerOrders ?? []).map((co) => ({
                    id: co.id,
                    customerId: co.customer?.id ?? co.customerId ?? 0,
                })),
            }
            : null;
        return {
            id: entity.id,
            orderId: entity.order?.id ?? 0,
            order: orderDto,
            merchantId: entity.merchant?.id ?? 0,
            arrivedDate,
            arrivedTime: entity.arrivedTime,
            recordedBy: entity.recordedByUser?.id ?? null,
            recordedByUser: entity.recordedByUser
                ? {
                    id: entity.recordedByUser.id,
                    fullName: entity.recordedByUser.fullName,
                    email: entity.recordedByUser.email,
                }
                : null,
            notes: entity.notes ?? null,
            arrivalItems: (entity.arrivalItems ?? []).map((item) => ({
                id: item.id,
                arrivalId: entity.id,
                orderItemId: item.orderItem?.id ?? 0,
                variant: item.orderItem?.skus?.[0]?.variant ?? null,
                quantity: item.arrivedQuantity ?? 0,
                publicUrl: item.orderItem?.image?.publicUrl ?? null,
                purchasePrice: item.orderItem?.skus?.[0]?.purchasePrice ?? null,
                purchaseTotal: item.orderItem?.purchaseTotal ?? 0,
                shippingPrice: 0,
                totalCostBeforeDiscount: item.orderItem?.purchaseTotal ?? 0,
                discountType: null,
                discountValue: null,
                discountAmount: 0,
                finalCost: item.orderItem?.finalCost ?? 0,
                sellingPriceForeign: item.orderItem?.skus?.[0]?.sellingPriceForeign ?? null,
                sellingTotal: item.orderItem?.sellingTotal ?? 0,
                profit: item.orderItem?.profit ?? 0,
                arrivedQuantity: item.arrivedQuantity,
                condition: item.condition ?? null,
                notes: item.notes ?? null,
                createdAt: item.createdAt,
                updatedAt: item.updatedAt,
            })),
            createdAt: entity.createdAt,
            updatedAt: entity.updatedAt,
        };
    }
};
exports.ArrivalQueryService = ArrivalQueryService;
exports.ArrivalQueryService = ArrivalQueryService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [arrival_repository_1.ArrivalRepository,
        arrival_query_repository_1.ArrivalQueryRepository])
], ArrivalQueryService);
//# sourceMappingURL=arrival-query.service.js.map