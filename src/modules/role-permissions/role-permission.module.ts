import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RolePermissionOrmEntity } from './entities/role-permission.orm-entity';
import { RolePermissionRepository } from './repositories/role-permission.repository';
import { RolePermissionQueryRepository } from './repositories/role-permission.query-repository';
import { RolePermissionCommandService } from './services/role-permission-command.service';
import { RolePermissionQueryService } from './services/role-permission-query.service';
import { RolePermissionController } from './controllers/role-permission.controller';
import { TransactionService } from '../../common/transaction/transaction.service';
import { RoleModule } from '../roles/role.module';
import { PermissionModule } from '../permissions/permission.module';
import { RolesGuard } from '../../common/policies/roles.guard';

@Module({
  imports: [
    TypeOrmModule.forFeature([RolePermissionOrmEntity]),
    RoleModule,
    PermissionModule,
  ],
  controllers: [RolePermissionController],
  providers: [
    RolePermissionRepository,
    RolePermissionQueryRepository,
    RolePermissionCommandService,
    RolePermissionQueryService,
    TransactionService,
    RolesGuard,
  ],
  exports: [RolePermissionRepository, RolePermissionCommandService, RolePermissionQueryService],
})
export class RolePermissionModule {}
