import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerOrmEntity } from './entities/customer.orm-entity';
import { CustomerRepository } from './repositories/customer.repository';
import { CustomerQueryRepository } from './repositories/customer.query-repository';
import { CustomerCommandService } from './services/customer-command.service';
import { CustomerQueryService } from './services/customer-query.service';
import { CustomerController } from './controllers/customer.controller';
import { TransactionService } from '../../common/transaction/transaction.service';
import { MerchantModule } from '../merchants/merchant.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([CustomerOrmEntity]),
    MerchantModule,
  ],
  controllers: [CustomerController],
  providers: [
    CustomerRepository,
    CustomerQueryRepository,
    CustomerCommandService,
    CustomerQueryService,
    TransactionService,
  ],
  exports: [CustomerRepository, CustomerQueryRepository, CustomerCommandService, CustomerQueryService],
})
export class CustomerModule {}
