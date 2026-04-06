"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const user_orm_entity_1 = require("./entities/user.orm-entity");
const user_repository_1 = require("./repositories/user.repository");
const user_query_repository_1 = require("./repositories/user.query-repository");
const user_command_service_1 = require("./services/user-command.service");
const user_query_service_1 = require("./services/user-query.service");
const user_controller_1 = require("./controllers/user.controller");
const transaction_service_1 = require("../../common/transaction/transaction.service");
const role_module_1 = require("../roles/role.module");
const merchant_module_1 = require("../merchants/merchant.module");
const image_module_1 = require("../images/image.module");
let UserModule = class UserModule {
};
exports.UserModule = UserModule;
exports.UserModule = UserModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([user_orm_entity_1.UserOrmEntity]), role_module_1.RoleModule, merchant_module_1.MerchantModule, image_module_1.ImageModule],
        controllers: [user_controller_1.UserController],
        providers: [
            user_repository_1.UserRepository,
            user_query_repository_1.UserQueryRepository,
            user_command_service_1.UserCommandService,
            user_query_service_1.UserQueryService,
            transaction_service_1.TransactionService
        ],
        exports: [user_repository_1.UserRepository, user_query_repository_1.UserQueryRepository, user_command_service_1.UserCommandService, user_query_service_1.UserQueryService],
    })
], UserModule);
//# sourceMappingURL=user.module.js.map