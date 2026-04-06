"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MerchantModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const merchant_orm_entity_1 = require("./entities/merchant.orm-entity");
const merchant_repository_1 = require("./repositories/merchant.repository");
const merchant_query_repository_1 = require("./repositories/merchant.query-repository");
const merchant_command_service_1 = require("./services/merchant-command.service");
const merchant_query_service_1 = require("./services/merchant-query.service");
const merchant_controller_1 = require("./controllers/merchant.controller");
const transaction_service_1 = require("../../common/transaction/transaction.service");
const image_module_1 = require("../images/image.module");
const dashboard_module_1 = require("../dashboard/dashboard.module");
let MerchantModule = class MerchantModule {
};
exports.MerchantModule = MerchantModule;
exports.MerchantModule = MerchantModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([merchant_orm_entity_1.MerchantOrmEntity]),
            (0, common_1.forwardRef)(() => image_module_1.ImageModule),
            dashboard_module_1.DashboardModule,
        ],
        controllers: [merchant_controller_1.MerchantController],
        providers: [
            merchant_repository_1.MerchantRepository,
            merchant_query_repository_1.MerchantQueryRepository,
            merchant_command_service_1.MerchantCommandService,
            merchant_query_service_1.MerchantQueryService,
            transaction_service_1.TransactionService,
        ],
        exports: [merchant_repository_1.MerchantRepository, merchant_query_repository_1.MerchantQueryRepository, merchant_command_service_1.MerchantCommandService, merchant_query_service_1.MerchantQueryService],
    })
], MerchantModule);
//# sourceMappingURL=merchant.module.js.map