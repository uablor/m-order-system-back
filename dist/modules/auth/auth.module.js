"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthModule = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const passport_1 = require("@nestjs/passport");
const config_1 = require("@nestjs/config");
const user_module_1 = require("../users/user.module");
const role_permission_module_1 = require("../role-permissions/role-permission.module");
const auth_controller_1 = require("./controllers/auth.controller");
const auth_command_service_1 = require("./services/auth-command.service");
const auth_query_service_1 = require("./services/auth-query.service");
const jwt_strategy_1 = require("./strategies/jwt.strategy");
const SEVEN_DAYS_SEC = 7 * 24 * 60 * 60;
let AuthModule = class AuthModule {
};
exports.AuthModule = AuthModule;
exports.AuthModule = AuthModule = __decorate([
    (0, common_1.Module)({
        imports: [
            user_module_1.UserModule,
            role_permission_module_1.RolePermissionModule,
            passport_1.PassportModule.register({ defaultStrategy: 'jwt' }),
            jwt_1.JwtModule.registerAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: (config) => ({
                    secret: config.get('app.jwt.secret', { infer: true }) ??
                        'change-me-in-production',
                    signOptions: {
                        expiresIn: config.get('app.jwt.expiresInSeconds', { infer: true }) ??
                            SEVEN_DAYS_SEC,
                    },
                }),
            }),
        ],
        controllers: [auth_controller_1.AuthController],
        providers: [auth_command_service_1.AuthCommandService, auth_query_service_1.AuthQueryService, jwt_strategy_1.JwtStrategy],
        exports: [auth_command_service_1.AuthCommandService, auth_query_service_1.AuthQueryService, jwt_1.JwtModule],
    })
], AuthModule);
//# sourceMappingURL=auth.module.js.map