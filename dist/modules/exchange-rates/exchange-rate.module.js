"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExchangeRateModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const exchange_rate_orm_entity_1 = require("./entities/exchange-rate.orm-entity");
const exchange_rate_repository_1 = require("./repositories/exchange-rate.repository");
const exchange_rate_query_repository_1 = require("./repositories/exchange-rate.query-repository");
const exchange_rate_command_service_1 = require("./services/exchange-rate-command.service");
const exchange_rate_query_service_1 = require("./services/exchange-rate-query.service");
const exchange_rate_controller_1 = require("./controllers/exchange-rate.controller");
const transaction_service_1 = require("../../common/transaction/transaction.service");
const merchant_module_1 = require("../merchants/merchant.module");
let ExchangeRateModule = class ExchangeRateModule {
};
exports.ExchangeRateModule = ExchangeRateModule;
exports.ExchangeRateModule = ExchangeRateModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([exchange_rate_orm_entity_1.ExchangeRateOrmEntity]),
            merchant_module_1.MerchantModule,
        ],
        controllers: [exchange_rate_controller_1.ExchangeRateController],
        providers: [
            exchange_rate_repository_1.ExchangeRateRepository,
            exchange_rate_query_repository_1.ExchangeRateQueryRepository,
            exchange_rate_command_service_1.ExchangeRateCommandService,
            exchange_rate_query_service_1.ExchangeRateQueryService,
            transaction_service_1.TransactionService,
        ],
        exports: [
            exchange_rate_repository_1.ExchangeRateRepository,
            exchange_rate_query_repository_1.ExchangeRateQueryRepository,
            exchange_rate_command_service_1.ExchangeRateCommandService,
            exchange_rate_query_service_1.ExchangeRateQueryService,
        ],
    })
], ExchangeRateModule);
//# sourceMappingURL=exchange-rate.module.js.map