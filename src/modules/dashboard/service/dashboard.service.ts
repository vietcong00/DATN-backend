import { IRevenueChartListQuery } from '../dashboard.interface';
import { Injectable, Optional, Inject } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { InjectEntityManager } from '@nestjs/typeorm';

import { EntityManager, Brackets, Like } from 'typeorm';
import { DateRangeTypes } from '../dashboard.constant';
import { orderBy } from 'lodash';
import { take, skip } from 'rxjs';
import { ReportRevenue } from 'src/modules/report-revenue/entity/report_revenue.entity';

@Injectable()
export class DashboardService {
    constructor(
        @Optional() @Inject(REQUEST) private readonly request: Request,
        @InjectEntityManager()
        private readonly dbManager: EntityManager,
    ) {}

    generateRevenueChartQueryBuilder(queryBuilder, { dateRanges }) {
        if (dateRanges.length === 2) {
            queryBuilder.andWhere(
                new Brackets((qb) => {
                    qb.where('date BETWEEN :startDay AND :endDay', {
                        startDay: dateRanges[0],
                        endDay: dateRanges[1],
                    });
                }),
            );
        }
    }

    async getSupportRequestCategoryList(query: IRevenueChartListQuery) {
        try {
            const { dateRanges = [], dateRangeType = DateRangeTypes.MONTH } =
                query;

            let groupCondition;

            if (dateRangeType === DateRangeTypes.MONTH) {
                groupCondition = { month: { $month: '$createdAt' } };
            } else {
                groupCondition = { day: { $dayOfMonth: '$createdAt' } };
            }

            const revenues = await this.dbManager.find(ReportRevenue, {
                where: (queryBuilder) =>
                    this.generateRevenueChartQueryBuilder(queryBuilder, {
                        dateRanges,
                    }),
            });
            console.log(revenues.length);

            if (!revenues.length) {
                return {
                    items: [],
                };
            }

            console.log(revenues.length);

            const userTimes = revenues?.map((revenue) => {
                if (dateRangeType === DateRangeTypes.MONTH) {
                    return {
                        month: revenue?.date,
                        revenue: revenue.billingRevenue,
                    };
                } else {
                    return {
                        day: revenue?.date,
                        revenue: revenue.billingRevenue,
                    };
                }
            });
            return {
                items: userTimes,
            };
        } catch (error) {
            throw error;
        }
    }
}
