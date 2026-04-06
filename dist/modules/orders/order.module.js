"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const order_orm_entity_1 = require("./entities/order.orm-entity");
const order_item_orm_entity_1 = require("./entities/order-item.orm-entity");
const order_item_sku_orm_entity_1 = require("./entities/order-item-sku.orm-entity");
const customer_order_orm_entity_1 = require("./entities/customer-order.orm-entity");
const customer_order_item_orm_entity_1 = require("./entities/customer-order-item.orm-entity");
const exchange_rate_orm_entity_1 = require("../exchange-rates/entities/exchange-rate.orm-entity");
const image_orm_entity_1 = require("../images/entities/image.orm-entity");
const order_repository_1 = require("./repositories/order.repository");
const order_query_repository_1 = require("./repositories/order.query-repository");
const order_item_repository_1 = require("./repositories/order-item.repository");
const order_item_sku_repository_1 = require("./repositories/order-item-sku.repository");
const order_item_query_repository_1 = require("./repositories/order-item.query-repository");
const customer_order_repository_1 = require("./repositories/customer-order.repository");
const customer_order_query_repository_1 = require("./repositories/customer-order.query-repository");
const customer_order_item_repository_1 = require("./repositories/customer-order-item.repository");
const customer_order_item_query_repository_1 = require("./repositories/customer-order-item.query-repository");
const order_command_service_1 = require("./services/order-command.service");
const order_query_service_1 = require("./services/order-query.service");
const order_item_query_service_1 = require("./services/order-item-query.service");
const customer_order_query_service_1 = require("./services/customer-order-query.service");
const customer_order_item_query_service_1 = require("./services/customer-order-item-query.service");
const order_controller_1 = require("./controllers/order.controller");
const order_item_controller_1 = require("./controllers/order-item.controller");
const customer_order_controller_1 = require("./controllers/customer-order.controller");
const customer_order_item_controller_1 = require("./controllers/customer-order-item.controller");
const transaction_service_1 = require("../../common/transaction/transaction.service");
const merchant_module_1 = require("../merchants/merchant.module");
const customer_module_1 = require("../customers/customer.module");
const exchange_rate_module_1 = require("../exchange-rates/exchange-rate.module");
const user_module_1 = require("../users/user.module");
let OrderModule = class OrderModule {
};
exports.OrderModule = OrderModule;
exports.OrderModule = OrderModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                order_orm_entity_1.OrderOrmEntity,
                order_item_orm_entity_1.OrderItemOrmEntity,
                order_item_sku_orm_entity_1.OrderItemSkuOrmEntity,
                customer_order_orm_entity_1.CustomerOrderOrmEntity,
                customer_order_item_orm_entity_1.CustomerOrderItemOrmEntity,
                exchange_rate_orm_entity_1.ExchangeRateOrmEntity,
                image_orm_entity_1.ImageOrmEntity,
            ]),
            merchant_module_1.MerchantModule,
            customer_module_1.CustomerModule,
            exchange_rate_module_1.ExchangeRateModule,
            user_module_1.UserModule,
        ],
        controllers: [
            order_controller_1.OrderController,
            order_item_controller_1.OrderItemController,
            customer_order_controller_1.CustomerOrderController,
            customer_order_item_controller_1.CustomerOrderItemController,
        ],
        providers: [
            order_repository_1.OrderRepository,
            order_query_repository_1.OrderQueryRepository,
            order_item_repository_1.OrderItemRepository,
            order_item_sku_repository_1.OrderItemSkuRepository,
            order_item_query_repository_1.OrderItemQueryRepository,
            customer_order_repository_1.CustomerOrderRepository,
            customer_order_query_repository_1.CustomerOrderQueryRepository,
            customer_order_item_repository_1.CustomerOrderItemRepository,
            customer_order_item_query_repository_1.CustomerOrderItemQueryRepository,
            order_command_service_1.OrderCommandService,
            order_query_service_1.OrderQueryService,
            order_item_query_service_1.OrderItemQueryService,
            customer_order_query_service_1.CustomerOrderQueryService,
            customer_order_item_query_service_1.CustomerOrderItemQueryService,
            transaction_service_1.TransactionService,
        ],
        exports: [
            order_repository_1.OrderRepository,
            order_query_repository_1.OrderQueryRepository,
            order_command_service_1.OrderCommandService,
            order_query_service_1.OrderQueryService,
            order_item_repository_1.OrderItemRepository,
            order_item_sku_repository_1.OrderItemSkuRepository,
            order_item_query_repository_1.OrderItemQueryRepository,
            order_item_query_service_1.OrderItemQueryService,
            customer_order_repository_1.CustomerOrderRepository,
            customer_order_query_repository_1.CustomerOrderQueryRepository,
            customer_order_query_service_1.CustomerOrderQueryService,
            customer_order_item_query_repository_1.CustomerOrderItemQueryRepository,
            customer_order_item_query_service_1.CustomerOrderItemQueryService,
        ],
    })
], OrderModule);
//# sourceMappingURL=order.module.js.map