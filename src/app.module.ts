import { Module } from '@nestjs/common';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { CacheModule } from '@nestjs/cache-manager';
import { getDatabaseConfig } from './config/database.config';
import appConfig from './config/app.config';
import redisConfig from './config/redis.config';
import facebookConfig from './config/facebook.config';
import { UserModule } from './modules/users/user.module';
import { RoleModule } from './modules/roles/role.module';
import { PermissionModule } from './modules/permissions/permission.module';
import { RolePermissionModule } from './modules/role-permissions/role-permission.module';
import { AuthModule } from './modules/auth/auth.module';
import { MerchantModule } from './modules/merchants/merchant.module';
import { CustomerModule } from './modules/customers/customer.module';
import { OrderModule } from './modules/orders/order.module';
import { ArrivalModule } from './modules/arrivals/arrival.module';
import { NotificationModule } from './modules/notifications/notification.module';
import { ExchangeRateModule } from './modules/exchange-rates/exchange-rate.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { PaymentModule } from './modules/payments/payment.module';
import { LoggerModule } from './common/logger/logger.module';
import { JwtAuthGuard } from './modules/auth/guards/jwt-auth.guard';
import { AllExceptionsFilter } from './common/filters/http-exception.filter';
// import { CacheInterceptor } from './common/interceptors/cache.interceptor';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '.env.local'],

      load: [appConfig, redisConfig, facebookConfig],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => getDatabaseConfig(config),
    }),
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => [
        {
          ttl:
            config.get<number>('app.throttle.ttl', { infer: true }) ?? 60_000,
          limit:
            config.get<number>('app.throttle.limit', { infer: true }) ?? 10,
        },
      ],
    }),
    CacheModule.registerAsync({
      isGlobal: true,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => {
        const ttl =
          config.get<number>('app.cache.ttl', { infer: true }) ?? 60_000;
        const redisUrl = config.get<string>('redis.url', { infer: true });
        const redisHost = config.get<string>('redis.host', { infer: true });
        const redisPort = config.get<number>('redis.port', { infer: true });
        const redisPassword = config.get<string>('redis.password', {
          infer: true,
        });

        let stores: unknown[] | undefined;
        type KeyvRedisCtor = new (
          connect?: string | object,
          options?: object,
        ) => import('keyv').KeyvStoreAdapter;
        if (redisUrl) {
          const mod = await import('@keyv/redis');
          const KeyvRedis = mod.default as unknown as KeyvRedisCtor;
          stores = [new KeyvRedis(redisUrl)];
        } else if (redisHost) {
          const mod = await import('@keyv/redis');
          const KeyvRedis = mod.default as unknown as KeyvRedisCtor;
          const url =
            redisPassword != null && redisPassword !== ''
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
    LoggerModule,
    AuthModule,
    UserModule,
    RoleModule,
    PermissionModule,
    RolePermissionModule,
    MerchantModule,
    CustomerModule,
    OrderModule,
    ArrivalModule,
    NotificationModule,
    ExchangeRateModule,
    DashboardModule,
    PaymentModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    // {
    //   provide: APP_INTERCEPTOR,
    //   useClass: CacheInterceptor,
    // },
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
  ],
})
export class AppModule {}
