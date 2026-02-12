import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DiscoveryModule } from '@nestjs/core';
import { PermissionOrmEntity } from './entities/permission.orm-entity';
import { PermissionRepository } from './repositories/permission.repository';
import { PermissionQueryRepository } from './repositories/permission.query-repository';
import { PermissionCommandService } from './services/permission-command.service';
import { PermissionQueryService } from './services/permission-query.service';
import { PermissionGeneratorService } from './services/permission-generator.service';
import { PermissionController } from './controllers/permission.controller';
import { TransactionService } from '../../common/transaction/transaction.service';
import { RolesGuard } from '../../common/policies/roles.guard';

@Module({
  imports: [
    TypeOrmModule.forFeature([PermissionOrmEntity]),
    DiscoveryModule,
  ],
  controllers: [PermissionController],
  providers: [
    PermissionRepository,
    PermissionQueryRepository,
    PermissionCommandService,
    PermissionQueryService,
    PermissionGeneratorService,
    TransactionService,
    RolesGuard,
  ],
  exports: [
    PermissionRepository,
    PermissionQueryRepository,
    PermissionCommandService,
    PermissionQueryService,
    PermissionGeneratorService,
  ],
})
export class PermissionModule {}
