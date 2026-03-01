import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentOrmEntity } from './entities/payment.orm-entity';
import { PaymentRepository } from './repositories/payment.repository';
import { PaymentCommandService } from './services/payment-command.service';
import { PaymentQueryService } from './services/payment-query.service';
import { PaymentController } from './controllers/payment.controller';
import { TransactionService } from '../../common/transaction/transaction.service';
import { PermissionsGuard } from '../../common/policies/permissions.guard';
import { RolesGuard } from '../../common/policies/roles.guard';
import { ImageModule } from '../images/image.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([PaymentOrmEntity]),
    ImageModule,
  ],
  controllers: [PaymentController],
  providers: [
    PaymentRepository,
    PaymentCommandService,
    PaymentQueryService,
    TransactionService,
    PermissionsGuard,
    RolesGuard,
  ],
  exports: [
    PaymentRepository,
    PaymentCommandService,
    PaymentQueryService,
  ],
})
export class PaymentModule {}
