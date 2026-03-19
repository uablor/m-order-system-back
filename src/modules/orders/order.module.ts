import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderOrmEntity } from './entities/order.orm-entity';
import { OrderItemOrmEntity } from './entities/order-item.orm-entity';
import { OrderItemSkuOrmEntity } from './entities/order-item-sku.orm-entity';
import { CustomerOrderOrmEntity } from './entities/customer-order.orm-entity';
import { CustomerOrderItemOrmEntity } from './entities/customer-order-item.orm-entity';
import { ExchangeRateOrmEntity } from '../exchange-rates/entities/exchange-rate.orm-entity';
import { ImageOrmEntity } from '../images/entities/image.orm-entity';
import { OrderRepository } from './repositories/order.repository';
import { OrderQueryRepository } from './repositories/order.query-repository';
import { OrderItemRepository } from './repositories/order-item.repository';
import { OrderItemSkuRepository } from './repositories/order-item-sku.repository';
import { OrderItemQueryRepository } from './repositories/order-item.query-repository';
import { CustomerOrderRepository } from './repositories/customer-order.repository';
import { CustomerOrderQueryRepository } from './repositories/customer-order.query-repository';
import { CustomerOrderItemRepository } from './repositories/customer-order-item.repository';
import { CustomerOrderItemQueryRepository } from './repositories/customer-order-item.query-repository';
import { OrderCommandService } from './services/order-command.service';
import { OrderQueryService } from './services/order-query.service';
import { OrderItemQueryService } from './services/order-item-query.service';
import { CustomerOrderQueryService } from './services/customer-order-query.service';
import { CustomerOrderItemQueryService } from './services/customer-order-item-query.service';
import { OrderController } from './controllers/order.controller';
import { OrderItemController } from './controllers/order-item.controller';
import { CustomerOrderController } from './controllers/customer-order.controller';
import { CustomerOrderItemController } from './controllers/customer-order-item.controller';
import { TransactionService } from '../../common/transaction/transaction.service';
import { MerchantModule } from '../merchants/merchant.module';
import { CustomerModule } from '../customers/customer.module';
import { ExchangeRateModule } from '../exchange-rates/exchange-rate.module';
import { UserModule } from '../users/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      OrderOrmEntity,
      OrderItemOrmEntity,
      OrderItemSkuOrmEntity,
      CustomerOrderOrmEntity,
      CustomerOrderItemOrmEntity,
      ExchangeRateOrmEntity,
      ImageOrmEntity,
    ]),
    MerchantModule,
    CustomerModule,
    ExchangeRateModule,
    UserModule,
  ],
  controllers: [
    OrderController,
    OrderItemController,
    CustomerOrderController,
    CustomerOrderItemController,
  ],
  providers: [
    OrderRepository,
    OrderQueryRepository,
    OrderItemRepository,
    OrderItemSkuRepository,
    OrderItemQueryRepository,
    CustomerOrderRepository,
    CustomerOrderQueryRepository,
    CustomerOrderItemRepository,
    CustomerOrderItemQueryRepository,
    OrderCommandService,
    OrderQueryService,
    OrderItemQueryService,
    CustomerOrderQueryService,
    CustomerOrderItemQueryService,
    TransactionService,
  ],
  exports: [
    OrderRepository,
    OrderQueryRepository,
    OrderCommandService,
    OrderQueryService,
    OrderItemRepository,
    OrderItemSkuRepository,
    OrderItemQueryRepository,
    OrderItemQueryService,
    CustomerOrderRepository,
    CustomerOrderQueryRepository,
    CustomerOrderQueryService,
    CustomerOrderItemQueryRepository,
    CustomerOrderItemQueryService,
  ],
})
export class OrderModule {}
