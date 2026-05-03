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
exports.OrderItemQueryService = void 0;
const common_1 = require("@nestjs/common");
const order_item_query_repository_1 = require("../repositories/order-item.query-repository");
const order_item_repository_1 = require("../repositories/order-item.repository");
const order_item_list_query_dto_1 = require("../dto/order-item-list-query.dto");
const response_helper_1 = require("../../../common/base/helpers/response.helper");
let OrderItemQueryService = class OrderItemQueryService {
    orderItemRepository;
    orderItemQueryRepository;
    constructor(orderItemRepository, orderItemQueryRepository) {
        this.orderItemRepository = orderItemRepository;
        this.orderItemQueryRepository = orderItemQueryRepository;
    }
    async getById(id) {
        const entity = await this.orderItemQueryRepository.repository.findOne({
            where: { id },
            relations: ['order', 'order.exchangeRateBuy', 'order.exchangeRateSell', 'order.shippingExchangeRate', 'image', 'order.merchant', 'skus', 'skus.exchangeRateSell', 'skus.exchangeRateBuy'],
        });
        if (!entity)
            return null;
        return this.toResponse(entity);
    }
    async getByIdOrFail(id) {
        const dto = await this.getById(id);
        if (!dto)
            throw new common_1.NotFoundException('Order item not found');
        return (0, response_helper_1.createSingleResponse)(dto);
    }
    async getByOrderItemSkuIdOrFail(orderItemSkuId) {
        const query = new order_item_list_query_dto_1.OrderItemListQueryDto();
        query.orderItemSkuId = orderItemSkuId;
        query.limit = 1;
        query.page = 1;
        const result = await this.orderItemQueryRepository.findWithPagination(query);
        if (result.results.length === 0) {
            throw new common_1.NotFoundException('Order item SKU not found');
        }
        const orderItem = result.results[0];
        const filteredResponse = this.toResponse(orderItem, orderItemSkuId);
        return (0, response_helper_1.createSingleResponse)(filteredResponse);
    }
    async getList(query) {
        const result = await this.orderItemQueryRepository.findWithPagination({
            page: query.page,
            limit: query.limit,
            orderId: query.orderId,
            orderItemSkuId: query.orderItemSkuId,
        });
        return (0, response_helper_1.createPaginatedResponse)(result.results.map((e) => this.toResponse(e)), result.pagination);
    }
    async getListByMerchant(query, currentUser) {
        const merchantId = currentUser?.merchantId;
        if (!merchantId) {
            return (0, response_helper_1.createPaginatedResponse)([], {
                total: 0,
                page: query.page ?? 1,
                limit: query.limit ?? 10,
                totalPages: 0,
                hasNextPage: false,
                hasPreviousPage: false,
            });
        }
        const result = await this.orderItemQueryRepository.findWithPagination({
            page: query.page,
            limit: query.limit,
            orderId: query.orderId,
            orderItemSkuId: query.orderItemSkuId,
            merchantId,
        });
        return (0, response_helper_1.createPaginatedResponse)(result.results.map((e) => this.toResponse(e)), result.pagination);
    }
    convertToTargetCurrency(amount, exchangeRate) {
        if (!exchangeRate) {
            console.log('No exchange rate provided, returning original amount:', amount);
            return amount.toString();
        }
        if (exchangeRate.baseCurrency === exchangeRate.targetCurrency) {
            console.log('Base and target currency are the same:', exchangeRate.baseCurrency);
            return amount.toString();
        }
        if (exchangeRate.rateType === 'BUY') {
            const converted = amount / exchangeRate.rate;
            console.log(`BUY conversion: ${amount} / ${exchangeRate.rate} = ${converted}`);
            return converted.toString();
        }
        else {
            const converted = amount * exchangeRate.rate;
            console.log(`SELL conversion: ${amount} * ${exchangeRate.rate} = ${converted}`);
            return converted.toString();
        }
    }
    toResponse(entity, orderItemSkuId) {
        console.log('entity', entity);
        const filteredSkus = entity.skus?.filter(sku => orderItemSkuId ? sku.id === orderItemSkuId : true) || [];
        return {
            id: entity.id,
            orderId: entity.order?.id ?? 0,
            productName: entity.productName,
            orderItemIndex: filteredSkus[0]?.orderItemSkuIndex ?? null,
            quantity: entity.quantity,
            imageId: entity.image?.id ?? null,
            image: entity.image ? {
                id: entity.image.id,
                publicUrl: entity.image.publicUrl,
                fileName: entity.image.fileName,
                originalName: entity.image.originalName,
            } : null,
            exchangeRateBuy: entity.order?.exchangeRateBuy ? {
                id: entity.order.exchangeRateBuy.id,
                baseCurrency: entity.order.exchangeRateBuy.baseCurrency,
                targetCurrency: entity.order.exchangeRateBuy.targetCurrency,
                rate: entity.order.exchangeRateBuy.rate.toString(),
                rateType: entity.order.exchangeRateBuy.rateType,
                rateDate: entity.order.exchangeRateBuy.rateDate,
                isActive: entity.order.exchangeRateBuy.isActive,
            } : null,
            exchangeRateSell: entity.order?.exchangeRateSell ? {
                id: entity.order.exchangeRateSell.id,
                baseCurrency: entity.order.exchangeRateSell.baseCurrency,
                targetCurrency: entity.order.exchangeRateSell.targetCurrency,
                rate: entity.order.exchangeRateSell.rate.toString(),
                rateType: entity.order.exchangeRateSell.rateType,
                rateDate: entity.order.exchangeRateSell.rateDate,
                isActive: entity.order.exchangeRateSell.isActive,
            } : null,
            shippingExchangeRate: entity.order?.shippingExchangeRate ? {
                id: entity.order.shippingExchangeRate.id,
                baseCurrency: entity.order.shippingExchangeRate.baseCurrency,
                targetCurrency: entity.order.shippingExchangeRate.targetCurrency,
                rate: entity.order.shippingExchangeRate.rate.toString(),
                rateType: entity.order.shippingExchangeRate.rateType,
                rateDate: entity.order.shippingExchangeRate.rateDate,
                isActive: entity.order.shippingExchangeRate.isActive,
            } : null,
            exchangeRateBuyValue: entity.order?.exchangeRateBuyValue?.toString() || null,
            exchangeRateSellValue: entity.order?.exchangeRateSellValue?.toString() || null,
            purchaseTotal: entity.purchaseTotal.toString(),
            finalCost: entity.finalCost.toString(),
            sellingTotal: entity.sellingTotal.toString(),
            profit: entity.profit.toString(),
            targetCurrencyPurchaseTotal: entity.order?.exchangeRateSell ? this.convertToTargetCurrency(entity.purchaseTotal, entity.order.exchangeRateSell) : '0',
            targetCurrencySellingTotal: entity.order?.exchangeRateSell ? this.convertToTargetCurrency(entity.sellingTotal, entity.order.exchangeRateSell) : '0',
            targetCurrencyProfit: entity.order?.exchangeRateSell ? this.convertToTargetCurrency(entity.profit, entity.order.exchangeRateSell) : '0',
            targetCurrencyFinalCost: entity.order?.exchangeRateSell ? this.convertToTargetCurrency(entity.finalCost, entity.order.exchangeRateSell) : '0',
            targetCurrencyPurchasePrice: entity.order?.exchangeRateSell && entity.quantity > 0 ? this.convertToTargetCurrency(entity.purchaseTotal / entity.quantity, entity.order.exchangeRateSell) : '0',
            targetCurrencySellingPriceForeign: entity.order?.exchangeRateSell && entity.quantity > 0 ? this.convertToTargetCurrency(entity.sellingTotal / entity.quantity, entity.order.exchangeRateSell) : '0',
            skus: filteredSkus?.map(sku => ({
                id: sku.id,
                orderItemId: entity.id,
                orderItemSkuIndex: sku.orderItemSkuIndex,
                variant: sku.variant,
                quantity: sku.quantity,
                exchangeRateBuy: sku.exchangeRateBuy ? {
                    id: sku.exchangeRateBuy.id,
                    baseCurrency: sku.exchangeRateBuy.baseCurrency,
                    targetCurrency: sku.exchangeRateBuy.targetCurrency,
                    rate: sku.exchangeRateBuy.rate.toString(),
                    rateType: sku.exchangeRateBuy.rateType,
                    rateDate: sku.exchangeRateBuy.rateDate,
                    isActive: sku.exchangeRateBuy.isActive,
                } : null,
                exchangeRateSell: sku.exchangeRateSell ? {
                    id: sku.exchangeRateSell.id,
                    baseCurrency: sku.exchangeRateSell.baseCurrency,
                    targetCurrency: sku.exchangeRateSell.targetCurrency,
                    rate: sku.exchangeRateSell.rate.toString(),
                    rateType: sku.exchangeRateSell.rateType,
                    rateDate: sku.exchangeRateSell.rateDate,
                    isActive: sku.exchangeRateSell.isActive,
                } : null,
                exchangeRateBuyValue: sku.exchangeRateBuyValue?.toString() || null,
                exchangeRateSellValue: sku.exchangeRateSellValue?.toString() || null,
                purchasePrice: sku.purchasePrice.toString(),
                purchaseTotal: sku.purchaseTotal.toString(),
                sellingPriceForeign: sku.sellingPriceForeign.toString(),
                sellingTotal: sku.sellingTotal.toString(),
                profit: sku.profit.toString(),
                targetCurrencyPurchaseTotal: sku.exchangeRateSell ? this.convertToTargetCurrency(sku.purchaseTotal, sku.exchangeRateSell) : '0',
                targetCurrencyPurchasePrice: sku.exchangeRateSell ? this.convertToTargetCurrency(sku.purchasePrice, sku.exchangeRateSell) : '0',
                targetCurrencySellingPriceForeign: sku.exchangeRateSell ? this.convertToTargetCurrency(sku.sellingPriceForeign, sku.exchangeRateSell) : '0',
                targetCurrencySellingTotal: sku.exchangeRateSell ? this.convertToTargetCurrency(sku.sellingTotal, sku.exchangeRateSell) : '0',
                targetCurrencyProfit: sku.exchangeRateSell ? this.convertToTargetCurrency(sku.profit, sku.exchangeRateSell) : '0',
                createdAt: sku.createdAt,
                updatedAt: sku.updatedAt,
            })) || [],
            createdAt: entity.createdAt,
            updatedAt: entity.updatedAt,
        };
    }
};
exports.OrderItemQueryService = OrderItemQueryService;
exports.OrderItemQueryService = OrderItemQueryService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [order_item_repository_1.OrderItemRepository,
        order_item_query_repository_1.OrderItemQueryRepository])
], OrderItemQueryService);
//# sourceMappingURL=order-item-query.service.js.map