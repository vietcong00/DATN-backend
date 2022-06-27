import { BillingStatus } from './../../billing/billing.constant';
import { FoodBilling } from '../../food-billing/entity/food-billing.entity';
import { Injectable } from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';

import { Billing } from 'src/modules/billing/entity/billing.entity';

@Injectable()
export class MobileService {
    constructor(
        @InjectEntityManager()
        private readonly dbManager: EntityManager,
    ) {}

    async getBillingRelativeTable(tableId: number) {
        try {
            const billing = await this.dbManager.findOne(Billing, {
                where: {
                    tableId: tableId,
                    BillingStatus: BillingStatus.EATING,
                },
            });
            return {
                billing,
            };
        } catch (error) {
            throw error;
        }
    }

    async getFoodBillingRelativeTable(tableId: number) {
        try {
            const billing = await this.dbManager.findOne(Billing, {
                where: {
                    tableId: tableId,
                    billingStatus: BillingStatus.EATING,
                },
            });
            const items = await this.dbManager.find(FoodBilling, {
                where: { billingId: billing.id },
            });
            return {
                items,
            };
            return {
                billing,
            };
        } catch (error) {
            throw error;
        }
    }

    async getListFoodBilling(billingId: number) {
        try {
            const items = await this.dbManager.find(FoodBilling, {
                where: { billingId: billingId },
            });
            return {
                items,
            };
        } catch (error) {
            throw error;
        }
    }
}
