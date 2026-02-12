import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoleOrmEntity } from './entities/role.orm-entity';
import { RoleRepository } from './repositories/role.repository';
import { RoleQueryRepository } from './repositories/role.query-repository';
import { RoleCommandService } from './services/role-command.service';
import { RoleQueryService } from './services/role-query.service';
import { RoleController } from './controllers/role.controller';
import { TransactionService } from '../../common/transaction/transaction.service';
import { RolesGuard } from '../../common/policies/roles.guard';

@Module({
  imports: [TypeOrmModule.forFeature([RoleOrmEntity])],
  controllers: [RoleController],
  providers: [
    RoleRepository,
    RoleQueryRepository,
    RoleCommandService,
    RoleQueryService,
    TransactionService,
    RolesGuard,
  ],
  exports: [RoleRepository, RoleQueryRepository, RoleCommandService, RoleQueryService],
})
export class RoleModule {}
