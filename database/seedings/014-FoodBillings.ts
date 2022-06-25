import { MigrationInterface, QueryRunner } from 'typeorm';
import * as dotenv from 'dotenv';
import { TABLE_NAME } from '../constant';
import { ReasonCanceled } from '../../src/modules/food-billing/food-billing.constant';
dotenv.config();

export class SeedingFoodBilling1720963593405 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        const foodBillings = [
            {
                foodId: 1,
                billingId: 1,
                selectedCount: 3,
                processingCount: 1,
                doneCount: 1,
                canceledCount: 1,
                reasonCanceled: ReasonCanceled.ANOTHER_REASON,
                note: 'ahihi',
                createdAt: new Date(),
                updatedAt: new Date(),
                createdBy: 1,
                updatedBy: 1,
            },
            {
                foodId: 2,
                billingId: 1,
                selectedCount: 6,
                processingCount: 2,
                doneCount: 2,
                canceledCount: 2,
                reasonCanceled: ReasonCanceled.ANOTHER_REASON,
                note: 'ahihi',
                createdAt: new Date(),
                updatedAt: new Date(),
                createdBy: 1,
                updatedBy: 1,
            },
        ];
        await queryRunner.manager
            .getRepository(TABLE_NAME.FoodBillings)
            .insert(foodBillings);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.manager
            .getRepository(TABLE_NAME.FoodBillings)
            .delete({});
    }
}
