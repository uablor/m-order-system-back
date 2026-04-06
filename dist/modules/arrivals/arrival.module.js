"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArrivalModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const arrival_orm_entity_1 = require("./entities/arrival.orm-entity");
const arrival_item_orm_entity_1 = require("./entities/arrival-item.orm-entity");
const arrival_repository_1 = require("./repositories/arrival.repository");
const arrival_item_repository_1 = require("./repositories/arrival-item.repository");
const arrival_query_repository_1 = require("./repositories/arrival.query-repository");
const arrival_item_query_repository_1 = require("./repositories/arrival-item.query-repository");
const arrival_command_service_1 = require("./services/arrival-command.service");
const arrival_query_service_1 = require("./services/arrival-query.service");
const arrival_item_command_service_1 = require("./services/arrival-item-command.service");
const arrival_item_query_service_1 = require("./services/arrival-item-query.service");
const arrival_controller_1 = require("./controllers/arrival.controller");
const arrival_item_controller_1 = require("./controllers/arrival-item.controller");
const transaction_service_1 = require("../../common/transaction/transaction.service");
const order_module_1 = require("../orders/order.module");
const merchant_module_1 = require("../merchants/merchant.module");
const notification_module_1 = require("../notifications/notification.module");
let ArrivalModule = class ArrivalModule {
};
exports.ArrivalModule = ArrivalModule;
exports.ArrivalModule = ArrivalModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([arrival_orm_entity_1.ArrivalOrmEntity, arrival_item_orm_entity_1.ArrivalItemOrmEntity]),
            order_module_1.OrderModule,
            merchant_module_1.MerchantModule,
            notification_module_1.NotificationModule,
        ],
        controllers: [arrival_controller_1.ArrivalController, arrival_item_controller_1.ArrivalItemController],
        providers: [
            arrival_repository_1.ArrivalRepository,
            arrival_item_repository_1.ArrivalItemRepository,
            arrival_query_repository_1.ArrivalQueryRepository,
            arrival_item_query_repository_1.ArrivalItemQueryRepository,
            arrival_command_service_1.ArrivalCommandService,
            arrival_query_service_1.ArrivalQueryService,
            arrival_item_command_service_1.ArrivalItemCommandService,
            arrival_item_query_service_1.ArrivalItemQueryService,
            transaction_service_1.TransactionService,
        ],
        exports: [
            arrival_repository_1.ArrivalRepository,
            arrival_item_repository_1.ArrivalItemRepository,
            arrival_command_service_1.ArrivalCommandService,
            arrival_query_service_1.ArrivalQueryService,
            arrival_item_command_service_1.ArrivalItemCommandService,
            arrival_item_query_service_1.ArrivalItemQueryService,
        ],
    })
], ArrivalModule);
//# sourceMappingURL=arrival.module.js.map