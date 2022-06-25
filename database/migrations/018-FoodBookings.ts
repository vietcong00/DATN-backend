import { MigrationInterface, QueryRunner, Table } from 'typeorm';
import { TABLE_NAME } from '../constant';
import { ReasonCanceled } from '../../src/modules/food-billing/food-billing.constant';

export class FoodBooking1632891593051 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: TABLE_NAME.FoodBillings,
                columns: [
                    {
                        name: 'id',
                        type: 'int',
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: 'increment',
                    },
                    {
                        name: 'foodId',
                        type: 'int',
                        isNullable: true,
                    },
                    {
                        name: 'billingId',
                        type: 'int',
                        isNullable: true,
                    },
                    {
                        name: 'selectedCount',
                        type: 'int',
                        isNullable: true,
                    },
                    {
                        name: 'processingCount',
                        type: 'int',
                        isNullable: true,
                    },
                    {
                        name: 'doneCount',
                        type: 'int',
                        isNullable: true,
                    },
                    {
                        name: 'canceledCount',
                        type: 'int',
                        isNullable: true,
                    },
                    {
                        name: 'reasonCanceled',
                        type: 'enum',
                        enum: Object.values(ReasonCanceled),
                        isNullable: true,
                    },
                    {
                        name: 'note',
                        type: 'varchar',
                        length: '255',
                        isNullable: true,
                    },
                    {
                        name: 'createdAt',
                        type: 'timestamp',
                        default: 'CURRENT_TIMESTAMP',
                    },
                    {
                        name: 'updatedAt',
                        type: 'timestamp',
                        default: 'CURRENT_TIMESTAMP',
                    },
                    {
                        name: 'deletedAt',
                        type: 'timestamp',
                        isNullable: true,
                    },
                    {
                        name: 'createdBy',
                        type: 'int',
                        isNullable: true,
                    },
                    {
                        name: 'updatedBy',
                        type: 'int',
                        isNullable: true,
                    },
                    {
                        name: 'deletedBy',
                        type: 'int',
                        isNullable: true,
                    },
                ],
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable(TABLE_NAME.FoodBillings);
    }
}
