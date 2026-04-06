"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const typeorm_1 = require("@nestjs/typeorm");
const config_1 = require("@nestjs/config");
const cache_manager_1 = require("@nestjs/cache-manager");
const database_config_1 = require("../config/database.config");
const app_config_1 = __importDefault(require("../config/app.config"));
const redis_config_1 = __importDefault(require("../config/redis.config"));
const facebook_config_1 = __importDefault(require("../config/facebook.config"));
const user_module_1 = require("../modules/users/user.module");
const role_module_1 = require("../modules/roles/role.module");
const permission_module_1 = require("../modules/permissions/permission.module");
const role_permission_module_1 = require("../modules/role-permissions/role-permission.module");
const auth_module_1 = require("../modules/auth/auth.module");
const merchant_module_1 = require("../modules/merchants/merchant.module");
const customer_module_1 = require("../modules/customers/customer.module");
const order_module_1 = require("../modules/orders/order.module");
const arrival_module_1 = require("../modules/arrivals/arrival.module");
const notification_module_1 = require("../modules/notifications/notification.module");
const exchange_rate_module_1 = require("../modules/exchange-rates/exchange-rate.module");
const dashboard_module_1 = require("../modules/dashboard/dashboard.module");
const payment_module_1 = require("../modules/payments/payment.module");
const logger_module_1 = require("../common/logger/logger.module");
const jwt_auth_guard_1 = require("../modules/auth/guards/jwt-auth.guard");
const http_exception_filter_1 = require("../common/filters/http-exception.filter");
const image_module_1 = require("../modules/images/image.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: ['.env', '.env.local'],
                load: [app_config_1.default, redis_config_1.default, facebook_config_1.default],
            }),
            typeorm_1.TypeOrmModule.forRootAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: (config) => (0, database_config_1.getDatabaseConfig)(config),
            }),
            cache_manager_1.CacheModule.registerAsync({
                isGlobal: true,
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: async (config) => {
                    const ttl = config.get('app.cache.ttl', { infer: true }) ?? 60_000;
                    const redisUrl = config.get('redis.url', { infer: true });
                    const redisHost = config.get('redis.host', { infer: true });
                    const redisPort = config.get('redis.port', { infer: true });
                    const redisPassword = config.get('redis.password', {
                        infer: true,
                    });
                    let stores;
                    if (redisUrl) {
                        const mod = await import('@keyv/redis');
                        const KeyvRedis = mod.default;
                        stores = [new KeyvRedis(redisUrl)];
                    }
                    else if (redisHost) {
                        const mod = await import('@keyv/redis');
                        const KeyvRedis = mod.default;
                        const url = redisPassword != null && redisPassword !== ''
                            ? `redis://:${encodeURIComponent(redisPassword)}@${redisHost}:${redisPort ?? 6379}`
                            : `redis://${redisHost}:${redisPort ?? 6379}`;
                        stores = [new KeyvRedis(url)];
                    }
                    return {
                        ttl,
                        ...(stores && { stores }),
                    };
                },
            }),
            logger_module_1.LoggerModule,
            auth_module_1.AuthModule,
            user_module_1.UserModule,
            role_module_1.RoleModule,
            permission_module_1.PermissionModule,
            role_permission_module_1.RolePermissionModule,
            merchant_module_1.MerchantModule,
            customer_module_1.CustomerModule,
            order_module_1.OrderModule,
            arrival_module_1.ArrivalModule,
            notification_module_1.NotificationModule,
            exchange_rate_module_1.ExchangeRateModule,
            dashboard_module_1.DashboardModule,
            payment_module_1.PaymentModule,
            image_module_1.ImageModule,
        ],
        providers: [
            {
                provide: core_1.APP_GUARD,
                useClass: jwt_auth_guard_1.JwtAuthGuard,
            },
            {
                provide: core_1.APP_FILTER,
                useClass: http_exception_filter_1.AllExceptionsFilter,
            },
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map