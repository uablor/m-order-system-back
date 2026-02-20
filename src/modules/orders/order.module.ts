import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderOrmEntity } from './entities/order.orm-entity';
import { OrderItemOrmEntity } from './entities/order-item.orm-entity';
import { CustomerOrderOrmEntity } from './entities/customer-order.orm-entity';
import { CustomerOrderItemOrmEntity } from './entities/customer-order-item.orm-entity';
import { OrderRepository } from './repositories/order.repository';
import { OrderQueryRepository } from './repositories/order.query-repository';
import { OrderItemRepository } from './repositories/order-item.repository';
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

@Module({
  imports: [
    TypeOrmModule.forFeature([
      OrderOrmEntity,
      OrderItemOrmEntity,
      CustomerOrderOrmEntity,
      CustomerOrderItemOrmEntity,
    ]),
    MerchantModule,
    CustomerModule,
    ExchangeRateModule,
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
    OrderItemQueryRepository,
    OrderItemQueryService,
    CustomerOrderQueryRepository,
    CustomerOrderQueryService,
    CustomerOrderItemQueryRepository,
    CustomerOrderItemQueryService,
  ],
})
export class OrderModule {}
