import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { CommonModule } from './modules/common/common.module';
import { I18nModule } from './common/services/i18n.service';
import { WinstonModule } from './common/services/winston.service';
import { DatabaseModule } from './common/services/database.module';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { AppController } from './app.controller';
import { SettingModule } from './modules/setting/setting.module';
import envSchema from './common/config/validation-schema';
import { ConfigModule } from '@nestjs/config';
import { GlobalDataService } from './modules/common/services/global-data.service';
import { BookingModule } from './modules/booking/booking.module';
import { TableDiagramModule } from './modules/table-diagram/tableDiagram.module';
import { CategoryModule } from './modules/category/category.module';
import { FoodModule } from './modules/food/food.module';
import { ClosingRevenueModule } from './modules/closing-revenue/closing_revenue.module';
import { FoodBillingModule } from './modules/food-billing/food-billing.module';
import { BillingModule } from './modules/billing/billing.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: '.env',
            isGlobal: true,
            validationSchema: envSchema,
        }),
        WinstonModule,
        I18nModule,
        CommonModule,
        ScheduleModule.forRoot(),
        DatabaseModule,
        AuthModule,
        UserModule,
        SettingModule,
        BookingModule,
        TableDiagramModule,
        CategoryModule,
        FoodModule,
        ClosingRevenueModule,
        FoodBillingModule,
        BillingModule,
    ],
    controllers: [AppController],
    providers: [GlobalDataService],
})
export class AppModule {}
