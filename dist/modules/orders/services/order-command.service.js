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
exports.OrderCommandService = void 0;
const common_1 = require("@nestjs/common");
const transaction_service_1 = require("../../../common/transaction/transaction.service");
const order_repository_1 = require("../repositories/order.repository");
const order_item_repository_1 = require("../repositories/order-item.repository");
const order_item_sku_repository_1 = require("../repositories/order-item-sku.repository");
const customer_order_repository_1 = require("../repositories/customer-order.repository");
const customer_order_item_repository_1 = require("../repositories/customer-order-item.repository");
const merchant_repository_1 = require("../../merchants/repositories/merchant.repository");
const customer_repository_1 = require("../../customers/repositories/customer.repository");
const exchange_rate_query_repository_1 = require("../../exchange-rates/repositories/exchange-rate.query-repository");
const exchange_rate_repository_1 = require("../../exchange-rates/repositories/exchange-rate.repository");
const enum_entities_1 = require("../enum/enum.entities");
const convert_to_target_currency_utils_1 = require("../../../common/utils/convert-to-target-currency.utils");
const payment_enum_1 = require("../../payments/enum/payment.enum");
const ZERO = 0;
function calcPaymentStatus(total, paid) {
    if (paid <= 0)
        return 'NOT_CREATED';
    if (paid >= total)
        return 'PAID';
    return 'PARTIAL';
}
let OrderCommandService = class OrderCommandService {
    transactionService;
    orderRepository;
    orderItemRepository;
    orderItemSkuRepository;
    customerOrderRepository;
    customerOrderItemRepository;
    merchantRepository;
    customerRepository;
    exchangeRateQueryRepository;
    exchangeRateRepository;
    constructor(transactionService, orderRepository, orderItemRepository, orderItemSkuRepository, customerOrderRepository, customerOrderItemRepository, merchantRepository, customerRepository, exchangeRateQueryRepository, exchangeRateRepository) {
        this.transactionService = transactionService;
        this.orderRepository = orderRepository;
        this.orderItemRepository = orderItemRepository;
        this.orderItemSkuRepository = orderItemSkuRepository;
        this.customerOrderRepository = customerOrderRepository;
        this.customerOrderItemRepository = customerOrderItemRepository;
        this.merchantRepository = merchantRepository;
        this.customerRepository = customerRepository;
        this.exchangeRateQueryRepository = exchangeRateQueryRepository;
        this.exchangeRateRepository = exchangeRateRepository;
    }
    async create(dto, createdByUserId) {
        return this.transactionService.run(async (manager) => {
            const merchant = await this.merchantRepository.findOneById(dto.merchantId, manager);
            if (!merchant)
                throw new common_1.NotFoundException('Merchant not found');
            const orderDate = new Date(dto.orderDate);
            const shippingCost = dto.totalShippingCost ?? 0;
            const entity = await this.orderRepository.create({
                merchant,
                createdByUser: createdByUserId ? { id: createdByUserId } : null,
                orderCode: dto.orderCode,
                orderDate,
                arrivalStatus: dto.arrivalStatus ?? 'NOT_ARRIVED',
                totalShippingCost: shippingCost,
                totalPurchaseCost: ZERO,
                totalCostBeforeDiscount: ZERO,
                totalDiscount: ZERO,
                totalFinalCost: ZERO,
                totalSellingAmount: ZERO,
                totalProfit: ZERO,
                paymentStatus: 'UNPAID',
            }, manager);
            return { id: entity.id };
        });
    }
    async update(id, dto) {
        await this.transactionService.run(async (manager) => {
            const existing = await this.orderRepository.findOneById(id, manager);
            if (!existing)
                throw new common_1.NotFoundException('Order not found');
            const updateData = {};
            if (dto.orderCode !== undefined)
                updateData.orderCode = dto.orderCode;
            if (dto.orderDate !== undefined)
                updateData.orderDate = new Date(dto.orderDate);
            if (dto.arrivedAt !== undefined)
                updateData.arrivedAt = dto.arrivedAt ? new Date(dto.arrivedAt) : null;
            if (dto.notifiedAt !== undefined)
                updateData.notifiedAt = dto.notifiedAt ? new Date(dto.notifiedAt) : null;
            if (dto.totalShippingCost !== undefined)
                updateData.totalShippingCost = (dto.totalShippingCost);
            await this.orderRepository.update(id, updateData, manager);
        });
    }
    async delete(id) {
        await this.transactionService.run(async (manager) => {
            const existing = await this.orderRepository.findOneById(id, manager);
            if (!existing)
                throw new common_1.NotFoundException('Order not found');
            await this.orderRepository.delete(id, manager);
        });
    }
    async createFull(dto, currentUser) {
        return this.transactionService.run(async (manager) => {
            const merchant = await this.merchantRepository.findOneById(currentUser.merchantId, manager);
            if (!merchant)
                throw new common_1.NotFoundException('Merchant not found');
            const orderDate = new Date();
            const { buy: buyRateEntity, sell: sellRateEntity } = await this.exchangeRateQueryRepository.findTodayRates(currentUser.merchantId);
            if (!buyRateEntity) {
                throw new common_1.BadRequestException('BUY exchange rate not found');
            }
            if (!sellRateEntity) {
                throw new common_1.BadRequestException('SELL exchange rate not found');
            }
            let shippingExchangeRateEntity = null;
            if (dto.shippingExchangeRateId) {
                shippingExchangeRateEntity = await this.exchangeRateRepository.findOneById(dto.shippingExchangeRateId, manager);
                if (!shippingExchangeRateEntity) {
                    throw new common_1.BadRequestException('Shipping exchange rate not found');
                }
            }
            const order = await this.orderRepository.create({
                merchant,
                createdByUser: currentUser ? { id: currentUser.userId } : null,
                orderCode: dto.orderCode,
                orderDate,
                exchangeRateBuy: buyRateEntity,
                exchangeRateSell: sellRateEntity,
                shippingExchangeRate: shippingExchangeRateEntity,
                shippingExchangeRateValue: shippingExchangeRateEntity ? Number(shippingExchangeRateEntity.rate) : null,
                exchangeRateBuyValue: Number(buyRateEntity.rate),
                exchangeRateSellValue: Number(sellRateEntity.rate),
                arrivalStatus: enum_entities_1.ArrivalStatusEnum.NOT_ARRIVED,
                totalPurchaseCost: ZERO,
                totalShippingCost: ZERO,
                totalCostBeforeDiscount: ZERO,
                totalDiscount: ZERO,
                totalFinalCost: ZERO,
                totalSellingAmount: ZERO,
                totalProfit: ZERO,
                paymentStatus: payment_enum_1.PaymentStatusEnum.NOT_CREATED,
            }, manager);
            const orderItems = [];
            const allSkus = [];
            for (let i = 0; i < dto.items.length; i++) {
                const itemDto = dto.items[i];
                const itemEntity = await this.orderItemRepository.create({
                    order,
                    productName: itemDto.productName,
                    imageId: itemDto.imageId ?? null,
                    discountType: itemDto.discountType ?? null,
                    discountValue: itemDto.discountValue ?? null,
                    shippingExchangeRate: shippingExchangeRateEntity,
                    shippingExchangeRateValue: shippingExchangeRateEntity ? Number(shippingExchangeRateEntity.rate) : null,
                    quantity: 0,
                    purchaseTotal: 0,
                    shippingTotal: 0,
                    totalCostBeforeDiscount: 0,
                    discountAmount: 0,
                    finalCost: 0,
                    sellingTotal: 0,
                    profit: 0,
                }, manager);
                const itemSkus = [];
                for (let j = 0; j < itemDto.skus.length; j++) {
                    const skuDto = itemDto.skus[j];
                    const purchaseTotal = skuDto.purchasePrice * skuDto.quantity;
                    const sellingTotal = skuDto.sellingPriceForeign * skuDto.quantity;
                    const sellingTotalTargetCurrency = (0, convert_to_target_currency_utils_1.convertToTargetCurrency)(sellingTotal, sellRateEntity);
                    const purchaseTotalTargetCurrency = (0, convert_to_target_currency_utils_1.convertToTargetCurrency)(purchaseTotal, buyRateEntity);
                    const profitTargetCurrency = Number(sellingTotalTargetCurrency) - Number(purchaseTotalTargetCurrency);
                    const profit = (0, convert_to_target_currency_utils_1.convertToBaseCurrency)(profitTargetCurrency, sellRateEntity);
                    const skuEntity = await this.orderItemSkuRepository.create({
                        orderItem: itemEntity,
                        orderItemSkuIndex: skuDto.orderItemSkuIndex,
                        variant: skuDto.variant,
                        quantity: skuDto.quantity,
                        exchangeRateBuy: buyRateEntity,
                        exchangeRateSell: sellRateEntity,
                        exchangeRateBuyValue: Number(buyRateEntity.rate),
                        exchangeRateSellValue: Number(sellRateEntity.rate),
                        purchasePrice: skuDto.purchasePrice,
                        purchaseTotal: Number(purchaseTotal),
                        sellingPriceForeign: skuDto.sellingPriceForeign,
                        sellingTotal: Number(sellingTotal),
                        profit: Number(profit),
                    }, manager);
                    itemSkus.push(skuEntity);
                    allSkus.push(skuEntity);
                }
                let totalQuantity = 0;
                let totalPurchaseCost = 0;
                let totalSellingAmount = 0;
                let totalProfit = 0;
                for (const sku of itemSkus) {
                    totalQuantity += sku.quantity;
                    totalPurchaseCost += Number(sku.purchaseTotal);
                    totalSellingAmount += Number(sku.sellingTotal);
                    totalProfit += Number(sku.profit);
                }
                const shippingPrice = itemDto.shippingPrice ?? 0;
                const totalShippingCost = shippingPrice * totalQuantity;
                const shippingTotalTargetCurrency = shippingExchangeRateEntity
                    ? (0, convert_to_target_currency_utils_1.convertToTargetCurrency)(totalShippingCost, shippingExchangeRateEntity)
                    : totalShippingCost.toString();
                const purchaseTotalTargetCurrency = (0, convert_to_target_currency_utils_1.convertToTargetCurrency)(totalPurchaseCost, buyRateEntity);
                const totalCostBeforeDiscountTargetCurrency = Number(purchaseTotalTargetCurrency) + Number(shippingTotalTargetCurrency);
                const totalCostBeforeDiscount = (0, convert_to_target_currency_utils_1.convertToBaseCurrency)(totalCostBeforeDiscountTargetCurrency, buyRateEntity);
                let discountAmount = 0;
                if (itemEntity.discountType && itemEntity.discountValue != null) {
                    if (itemEntity.discountType === 'PERCENT') {
                        discountAmount = totalCostBeforeDiscount * (itemEntity.discountValue / 100);
                    }
                    else {
                        discountAmount = itemEntity.discountValue;
                    }
                }
                const finalCost = totalCostBeforeDiscount - discountAmount;
                const sellingTotalTargetCurrency = (0, convert_to_target_currency_utils_1.convertToTargetCurrency)(totalSellingAmount, sellRateEntity);
                const finalCostTargetCurrency = (0, convert_to_target_currency_utils_1.convertToTargetCurrency)(finalCost, buyRateEntity);
                const itemProfitTargetCurrency = Number(sellingTotalTargetCurrency) - Number(finalCostTargetCurrency);
                const itemProfit = (0, convert_to_target_currency_utils_1.convertToBaseCurrency)(itemProfitTargetCurrency, sellRateEntity);
                await this.orderItemRepository.update(itemEntity.id, {
                    quantity: totalQuantity,
                    purchaseTotal: totalPurchaseCost,
                    shippingTotal: totalShippingCost,
                    totalCostBeforeDiscount: totalCostBeforeDiscount,
                    discountAmount: discountAmount,
                    finalCost: finalCost,
                    sellingTotal: totalSellingAmount,
                    profit: itemProfit,
                }, manager);
                itemEntity.quantity = totalQuantity;
                itemEntity.purchaseTotal = totalPurchaseCost;
                itemEntity.shippingTotal = totalShippingCost;
                itemEntity.totalCostBeforeDiscount = totalCostBeforeDiscount;
                itemEntity.discountAmount = discountAmount;
                itemEntity.finalCost = finalCost;
                itemEntity.sellingTotal = totalSellingAmount;
                itemEntity.profit = itemProfit;
                orderItems.push(itemEntity);
            }
            const requestedBySku = new Map();
            for (const co of dto.customerOrders) {
                for (const coItem of co.items) {
                    const itemIndex = coItem.orderItemIndex;
                    const skuIndex = coItem.skuIndex;
                    if (itemIndex < 0 || itemIndex >= orderItems.length) {
                        throw new common_1.BadRequestException(`Invalid orderItemIndex ${itemIndex}`);
                    }
                    const itemDto = dto.items[itemIndex];
                    if (skuIndex < 0 || skuIndex >= itemDto.skus.length) {
                        throw new common_1.BadRequestException(`Invalid skuIndex ${skuIndex} for orderItem ${itemIndex}`);
                    }
                    const key = `${itemIndex}-${skuIndex}`;
                    const currentRequested = requestedBySku.get(key) || 0;
                    requestedBySku.set(key, currentRequested + coItem.quantity);
                }
            }
            for (const co of dto.customerOrders) {
                for (const coItem of co.items) {
                    const itemIndex = coItem.orderItemIndex;
                    const skuIndex = coItem.skuIndex;
                    const key = `${itemIndex}-${skuIndex}`;
                    const requested = requestedBySku.get(key) || 0;
                    const available = dto.items[itemIndex].skus[skuIndex].quantity;
                    if (requested > available) {
                        throw new common_1.BadRequestException(`Insufficient stock for item "${dto.items[itemIndex].productName}" variant "${dto.items[itemIndex].skus[skuIndex].variant}": requested ${requested}, available ${available}`);
                    }
                }
            }
            const customerOrders = [];
            for (const coDto of dto.customerOrders) {
                const customer = await this.customerRepository.findOneById(coDto.customerId, manager);
                if (!customer)
                    throw new common_1.NotFoundException(`Customer not found: ${coDto.customerId}`);
                let totalSellingAmount = 0;
                const coItemsToCreate = [];
                for (const coItemDto of coDto.items) {
                    const orderItem = orderItems[coItemDto.orderItemIndex];
                    const skuIndex = coItemDto.skuIndex;
                    const orderItemSkus = allSkus.filter(sku => sku.orderItem.id === orderItem.id);
                    const orderItemSku = orderItemSkus[skuIndex];
                    if (!orderItemSku) {
                        throw new common_1.BadRequestException(`SKU not found for orderItem ${coItemDto.orderItemIndex}, skuIndex ${skuIndex}`);
                    }
                    const sellingPrice = coItemDto.sellingPriceForeign ?? Number(orderItemSku.sellingPriceForeign);
                    const lineTotal = coItemDto.quantity * sellingPrice;
                    totalSellingAmount += lineTotal;
                    coItemsToCreate.push({
                        orderItemSku,
                        orderItem,
                        quantity: coItemDto.quantity,
                        sellingPriceForeign: sellingPrice,
                    });
                }
                const totalPaid = 0;
                const remaining = totalSellingAmount - totalPaid;
                const paymentStatus = calcPaymentStatus(totalSellingAmount, totalPaid);
                const customerOrder = await this.customerOrderRepository.create({
                    order,
                    customer,
                    totalSellingAmount: totalSellingAmount,
                    totalPaid: totalPaid,
                    remainingAmount: remaining,
                    paymentStatus,
                }, manager);
                customerOrders.push(customerOrder);
                for (const coItem of coItemsToCreate) {
                    const sellingTotal = coItem.quantity * coItem.sellingPriceForeign;
                    const costPerUnit = Number(coItem.orderItem.finalCost) / coItem.orderItem.quantity;
                    const costAllocated = costPerUnit * coItem.quantity;
                    const sellingTotalTargetCurrency = (0, convert_to_target_currency_utils_1.convertToTargetCurrency)(sellingTotal, coItem.orderItem.order.exchangeRateSell);
                    const costAllocatedTargetCurrency = (0, convert_to_target_currency_utils_1.convertToTargetCurrency)(costAllocated, coItem.orderItem.order.exchangeRateBuy);
                    const profitTargetCurrency = Number(sellingTotalTargetCurrency) - Number(costAllocatedTargetCurrency);
                    const profit = (0, convert_to_target_currency_utils_1.convertToBaseCurrency)(profitTargetCurrency, coItem.orderItem.order.exchangeRateSell);
                    await this.customerOrderItemRepository.create({
                        customerOrder,
                        orderItemSku: coItem.orderItemSku,
                        orderItem: coItem.orderItem,
                        quantity: coItem.quantity,
                        sellingPriceForeign: coItem.sellingPriceForeign,
                        purchasePrice: coItem.orderItemSku.purchasePrice,
                        purchaseTotal: costAllocated,
                        sellingTotal: Number(sellingTotal),
                        profit: Number(profit),
                    }, manager);
                }
            }
            let totalPurchaseCost = 0;
            let totalShippingCost = 0;
            let totalCostBeforeDiscount = 0;
            let totalDiscount = 0;
            let totalFinalCost = 0;
            let totalSellingAmount = 0;
            let totalProfit = 0;
            for (const oi of orderItems) {
                totalPurchaseCost += Number(oi.purchaseTotal);
                totalShippingCost += Number(oi.shippingTotal);
                totalCostBeforeDiscount += Number(oi.totalCostBeforeDiscount);
                totalDiscount += Number(oi.discountAmount);
                totalFinalCost += Number(oi.finalCost);
                totalSellingAmount += Number(oi.sellingTotal);
                totalProfit += Number(oi.profit);
            }
            let paidAmount = 0;
            for (const co of customerOrders) {
                paidAmount += Number(co.totalPaid);
            }
            const remainingAmount = totalSellingAmount - paidAmount;
            const orderPaymentStatus = calcPaymentStatus(totalSellingAmount, paidAmount);
            await this.orderRepository.update(order.id, {
                totalPurchaseCost: totalPurchaseCost,
                totalShippingCost: totalShippingCost,
                totalCostBeforeDiscount: totalCostBeforeDiscount,
                totalDiscount: totalDiscount,
                totalFinalCost: totalFinalCost,
                totalSellingAmount: totalSellingAmount,
                totalProfit: totalProfit,
                paymentStatus: orderPaymentStatus,
            }, manager);
            const orderReloaded = await this.orderRepository.getRepo(manager).findOne({
                where: { id: order.id },
                relations: [
                    'orderItems',
                    'orderItems.image',
                    'orderItems.skus',
                    'exchangeRateBuy',
                    'exchangeRateSell',
                    'shippingExchangeRate',
                    'customerOrders',
                    'customerOrders.customerOrderItems',
                    'customerOrders.customerOrderItems.orderItemSku',
                    'customerOrders.customer',
                ],
            });
            return {
                success: true,
                order: orderReloaded ?? order,
                message: 'Order created successfully',
            };
        });
    }
};
exports.OrderCommandService = OrderCommandService;
exports.OrderCommandService = OrderCommandService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [transaction_service_1.TransactionService,
        order_repository_1.OrderRepository,
        order_item_repository_1.OrderItemRepository,
        order_item_sku_repository_1.OrderItemSkuRepository,
        customer_order_repository_1.CustomerOrderRepository,
        customer_order_item_repository_1.CustomerOrderItemRepository,
        merchant_repository_1.MerchantRepository,
        customer_repository_1.CustomerRepository,
        exchange_rate_query_repository_1.ExchangeRateQueryRepository,
        exchange_rate_repository_1.ExchangeRateRepository])
], OrderCommandService);
//# sourceMappingURL=order-command.service.js.map