"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const payment_orm_entity_1 = require("./entities/payment.orm-entity");
const payment_repository_1 = require("./repositories/payment.repository");
const payment_command_service_1 = require("./services/payment-command.service");
const payment_query_service_1 = require("./services/payment-query.service");
const payment_controller_1 = require("./controllers/payment.controller");
const transaction_service_1 = require("../../common/transaction/transaction.service");
const permissions_guard_1 = require("../../common/policies/permissions.guard");
const roles_guard_1 = require("../../common/policies/roles.guard");
const image_module_1 = require("../images/image.module");
const order_module_1 = require("../orders/order.module");
let PaymentModule = class PaymentModule {
};
exports.PaymentModule = PaymentModule;
exports.PaymentModule = PaymentModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([payment_orm_entity_1.PaymentOrmEntity]),
            image_module_1.ImageModule,
            order_module_1.OrderModule,
        ],
        controllers: [payment_controller_1.PaymentController],
        providers: [
            payment_repository_1.PaymentRepository,
            payment_command_service_1.PaymentCommandService,
            payment_query_service_1.PaymentQueryService,
            transaction_service_1.TransactionService,
            permissions_guard_1.PermissionsGuard,
            roles_guard_1.RolesGuard,
        ],
        exports: [
            payment_repository_1.PaymentRepository,
            payment_command_service_1.PaymentCommandService,
            payment_query_service_1.PaymentQueryService,
        ],
    })
], PaymentModule);
//# sourceMappingURL=payment.module.js.map