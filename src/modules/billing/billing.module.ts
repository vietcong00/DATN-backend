import { Module } from '@nestjs/common';
import { DatabaseService } from 'src/common/services/database.service';
import { BillingService } from './service/billing.service';
import { BillingController } from './billing.controller';

@Module({
    controllers: [BillingController],
    providers: [BillingService, DatabaseService],
})
export class BillingModule {}
