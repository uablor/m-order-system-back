import { Module } from '@nestjs/common';
import { DashboardQueryService } from './services/dashboard-query.service';
import { DashboardController } from './controllers/dashboard.controller';

@Module({
  controllers: [DashboardController],
  providers: [DashboardQueryService],
})
export class DashboardModule {}
