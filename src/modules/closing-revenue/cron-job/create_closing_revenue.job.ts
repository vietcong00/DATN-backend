import { ClosingRevenue } from './../entity/closing_revenue.entity';
import { SHIFT } from './../closing_revenue.constant';
import { Billing } from 'src/modules/billing/entity/billing.entity';
import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { ConfigService } from '@nestjs/config';
import moment from 'moment';
import * as dotenv from 'dotenv';
import { TIMEZONE_NAME_DEFAULT } from 'src/common/constants';
import { createWinstonLogger } from 'src/common/services/winston.service';
import { Brackets, getManager } from 'typeorm';
import { MODULE_NAME } from '../closing_revenue.constant';
import { BillingStatus } from 'src/modules/billing/billing.constant';

dotenv.config();

const CRON_JOB_BOOKING_UPDATE_STATUS =
    process.env.CRON_JOB_BOOKING_UPDATE_STATUS || '* * * * *';

//Change contract status from active to inactive if this contract outdate
@Injectable()
export class CreateClosingRevenueJob {
    constructor(private readonly configService: ConfigService) {
        // eslint-disable-next-line prettier/prettier
    }
    private readonly logger = createWinstonLogger(
        `${MODULE_NAME}-create-closing-revenue-job`,
        this.configService,
    );

    idTableWaitings: number[] = [];

    async createClosingRevenue() {
        try {
            const now = new Date();
            const manager = getManager();
            let shift;
            let startShift;
            let endShift;
            const dayShift = moment(now).format('YYYY-MM-DD');
            if (now.getHours() < 14) {
                shift = SHIFT.MORNING_SHIFT;
                startShift = `${dayShift} 09:00:00`;
                endShift = `${dayShift} 14:00:00`;
            } else {
                shift = SHIFT.AFTERNOON_SHIFT;
                startShift = `${dayShift} 14:00:00`;
                endShift = `${dayShift} 22:00:00`;
            }

            const billings = await manager.find(Billing, {
                select: ['paymentTotal'],
                where: (queryBuilder) =>
                    this.generateQueryBuilder(queryBuilder, {
                        startShift,
                        endShift,
                    }),
            });

            let totalPayment = 0;
            billings.forEach((element) => {
                totalPayment += element.paymentTotal;
            });

            const insertedClosingRevenue = await manager.save(ClosingRevenue, {
                shift,
                billingRevenue: totalPayment,
            });

            if (!insertedClosingRevenue) {
                this.createClosingRevenue();
            }
        } catch (error) {
            this.logger.error('Error in CreateClosingRevenueJob func: ', error);
        }
    }

    generateQueryBuilder(queryBuilder, { startShift, endShift }) {
        queryBuilder.andWhere(
            new Brackets((qb) => {
                qb.where('paymentTime BETWEEN :startShift AND :endShift', {
                    startShift,
                    endShift,
                });
            }),
        );
        queryBuilder.andWhere({
            billingStatus: BillingStatus.PAID,
        });
    }

    @Cron(CRON_JOB_BOOKING_UPDATE_STATUS, {
        timeZone: TIMEZONE_NAME_DEFAULT,
    })
    async handleCron() {
        try {
            this.logger.info('start CreateClosingRevenueJob at', new Date());
            this.createClosingRevenue();
        } catch (error) {
            this.logger.error('Error in CreateClosingRevenueJob: ', error);
        }
    }
}
