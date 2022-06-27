import { Module } from '@nestjs/common';
import { DatabaseService } from 'src/common/services/database.service';
import { ClosingRevenueService } from './service/closing_revenue.service';
import { ClosingRevenueController } from './closing_revenue.controller';
import { CreateClosingRevenueJob } from './cron-job/create_closing_revenue.job';

@Module({
    controllers: [ClosingRevenueController],
    providers: [
        ClosingRevenueService,
        DatabaseService,
        CreateClosingRevenueJob,
    ],
})
export class ClosingRevenueModule {}
