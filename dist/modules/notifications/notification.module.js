"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const notification_orm_entity_1 = require("./entities/notification.orm-entity");
const notification_repository_1 = require("./repositories/notification.repository");
const notification_query_repository_1 = require("./repositories/notification.query-repository");
const notification_command_service_1 = require("./services/notification-command.service");
const notification_query_service_1 = require("./services/notification-query.service");
const notification_send_service_1 = require("./services/notification-send.service");
const facebook_messenger_service_1 = require("./services/facebook-messenger.service");
const notification_controller_1 = require("./controllers/notification.controller");
const transaction_service_1 = require("../../common/transaction/transaction.service");
const customer_query_repository_1 = require("../customers/repositories/customer.query-repository");
const customer_module_1 = require("../customers/customer.module");
const customer_orm_entity_1 = require("../customers/entities/customer.orm-entity");
let NotificationModule = class NotificationModule {
};
exports.NotificationModule = NotificationModule;
exports.NotificationModule = NotificationModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([notification_orm_entity_1.NotificationOrmEntity]),
            typeorm_1.TypeOrmModule.forFeature([customer_orm_entity_1.CustomerOrmEntity]),
            customer_module_1.CustomerModule
        ],
        controllers: [notification_controller_1.NotificationController],
        providers: [
            transaction_service_1.TransactionService,
            notification_repository_1.NotificationRepository,
            notification_query_repository_1.NotificationQueryRepository,
            notification_command_service_1.NotificationCommandService,
            notification_query_service_1.NotificationQueryService,
            notification_send_service_1.NotificationSendService,
            facebook_messenger_service_1.FacebookMessengerService,
            customer_query_repository_1.CustomerQueryRepository,
        ],
        exports: [
            notification_repository_1.NotificationRepository,
            notification_command_service_1.NotificationCommandService,
            notification_query_service_1.NotificationQueryService,
            notification_send_service_1.NotificationSendService,
        ],
    })
], NotificationModule);
//# sourceMappingURL=notification.module.js.map