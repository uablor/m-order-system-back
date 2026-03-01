import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserOrmEntity } from './entities/user.orm-entity';
import { UserRepository } from './repositories/user.repository';
import { UserQueryRepository } from './repositories/user.query-repository';
import { UserCommandService } from './services/user-command.service';
import { UserQueryService } from './services/user-query.service';
import { UserController } from './controllers/user.controller';
import { TransactionService } from '../../common/transaction/transaction.service';
import { RoleModule } from '../roles/role.module';
import { MerchantModule } from '../merchants/merchant.module';
import { ImageQueryRepository } from '../images/repositories/image.query-repository';
import { ImageModule } from '../images/image.module';

@Module({
  imports: [TypeOrmModule.forFeature([UserOrmEntity]), RoleModule, MerchantModule, ImageModule],
  controllers: [UserController],
  providers: [
    UserRepository,
    UserQueryRepository,
    UserCommandService,
    UserQueryService,
    TransactionService
  ],
  exports: [UserRepository, UserQueryRepository, UserCommandService, UserQueryService],
})
export class UserModule {}
