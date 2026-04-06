"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomerModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const customer_orm_entity_1 = require("./entities/customer.orm-entity");
const customer_repository_1 = require("./repositories/customer.repository");
const customer_query_repository_1 = require("./repositories/customer.query-repository");
const customer_command_service_1 = require("./services/customer-command.service");
const customer_query_service_1 = require("./services/customer-query.service");
const customer_controller_1 = require("./controllers/customer.controller");
const transaction_service_1 = require("../../common/transaction/transaction.service");
const merchant_module_1 = require("../merchants/merchant.module");
let CustomerModule = class CustomerModule {
};
exports.CustomerModule = CustomerModule;
exports.CustomerModule = CustomerModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([customer_orm_entity_1.CustomerOrmEntity]),
            (0, common_1.forwardRef)(() => merchant_module_1.MerchantModule),
        ],
        controllers: [customer_controller_1.CustomerController],
        providers: [
            customer_repository_1.CustomerRepository,
            customer_query_repository_1.CustomerQueryRepository,
            customer_command_service_1.CustomerCommandService,
            customer_query_service_1.CustomerQueryService,
            transaction_service_1.TransactionService,
        ],
        exports: [customer_repository_1.CustomerRepository, customer_query_repository_1.CustomerQueryRepository, customer_command_service_1.CustomerCommandService, customer_query_service_1.CustomerQueryService],
    })
], CustomerModule);
//# sourceMappingURL=customer.module.js.map