import { MigrationInterface, QueryRunner } from 'typeorm';
import { TABLE_NAME } from '../constant';

export class SeedingBooking1720963593401 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        const bookings = [
            {
                status: 'waiting',
                nameCustomer: 'ahihi',
                phone: '123123',
                numberPeople: 4,
                arrivalTime: '2022-04-20 17:00:00',
                createdAt: new Date(),
                updatedAt: new Date(),
                createdBy: 1,
                updatedBy: 1,
            },
            {
                status: 'waiting',
                nameCustomer: 'huhuhu',
                phone: '11311311',
                numberPeople: 4,
                arrivalTime: '2022-04-20 17:00:00',
                createdAt: new Date(),
                updatedAt: new Date(),
                createdBy: 1,
                updatedBy: 1,
            },
            {
                status: 'waiting',
                numberPeople: 4,
                createdAt: new Date(),
                updatedAt: new Date(),
                createdBy: 1,
                updatedBy: 1,
            },
            {
                status: 'waiting',
                numberPeople: 4,
                createdAt: new Date(),
                updatedAt: new Date(),
                createdBy: 1,
                updatedBy: 1,
            },
            {
                status: 'waiting',
                numberPeople: 4,
                createdAt: new Date(),
                updatedAt: new Date(),
                createdBy: 1,
                updatedBy: 1,
            },
            {
                status: 'waiting',
                numberPeople: 4,
                createdAt: new Date(),
                updatedAt: new Date(),
                createdBy: 1,
                updatedBy: 1,
            },
            {
                status: 'waiting',
                numberPeople: 4,
                createdAt: new Date(),
                updatedAt: new Date(),
                createdBy: 1,
                updatedBy: 1,
            },
            {
                status: 'canceled',
                numberPeople: 4,
                createdAt: new Date(),
                updatedAt: new Date(),
                createdBy: 1,
                updatedBy: 1,
            },
            {
                status: 'waiting',
                numberPeople: 4,
                createdAt: new Date(),
                updatedAt: new Date(),
                createdBy: 1,
                updatedBy: 1,
            },
            {
                status: 'waiting',
                numberPeople: 4,
                createdAt: new Date(),
                updatedAt: new Date(),
                createdBy: 1,
                updatedBy: 1,
            },
            {
                status: 'waiting',
                numberPeople: 4,
                createdAt: new Date(),
                updatedAt: new Date(),
                createdBy: 1,
                updatedBy: 1,
            },
            {
                status: 'waiting',
                numberPeople: 4,
                createdAt: new Date(),
                updatedAt: new Date(),
                createdBy: 1,
                updatedBy: 1,
            },
            {
                status: 'waiting',
                numberPeople: 4,
                createdAt: new Date(),
                updatedAt: new Date(),
                createdBy: 1,
                updatedBy: 1,
            },
            {
                status: 'waiting',
                numberPeople: 4,
                createdAt: new Date(),
                updatedAt: new Date(),
                createdBy: 1,
                updatedBy: 1,
            },
            {
                status: 'waiting',
                numberPeople: 4,
                createdAt: new Date(),
                updatedAt: new Date(),
                createdBy: 1,
                updatedBy: 1,
            },
            {
                status: 'waiting',
                numberPeople: 4,
                createdAt: new Date(),
                updatedAt: new Date(),
                createdBy: 1,
                updatedBy: 1,
            },
            {
                status: 'waiting',
                numberPeople: 4,
                createdAt: new Date(),
                updatedAt: new Date(),
                createdBy: 1,
                updatedBy: 1,
            },
            {
                status: 'waiting',
                numberPeople: 4,
                createdAt: new Date(),
                updatedAt: new Date(),
                createdBy: 1,
                updatedBy: 1,
            },
            {
                status: 'waiting',
                numberPeople: 4,
                createdAt: new Date(),
                updatedAt: new Date(),
                createdBy: 1,
                updatedBy: 1,
            },
            {
                status: 'waiting',
                numberPeople: 4,
                createdAt: new Date(),
                updatedAt: new Date(),
                createdBy: 1,
                updatedBy: 1,
            },
            {
                status: 'waiting',
                numberPeople: 4,
                createdAt: new Date(),
                updatedAt: new Date(),
                createdBy: 1,
                updatedBy: 1,
            },
            {
                status: 'waiting',
                numberPeople: 4,
                createdAt: new Date(),
                updatedAt: new Date(),
                createdBy: 1,
                updatedBy: 1,
            },
            {
                status: 'waiting',
                numberPeople: 4,
                createdAt: new Date(),
                updatedAt: new Date(),
                createdBy: 1,
                updatedBy: 1,
            },
            {
                status: 'waiting',
                numberPeople: 4,
                createdAt: new Date(),
                updatedAt: new Date(),
                createdBy: 1,
                updatedBy: 1,
            },
            {
                status: 'waiting',
                numberPeople: 4,
                createdAt: new Date(),
                updatedAt: new Date(),
                createdBy: 1,
                updatedBy: 1,
            },
        ];
        await queryRunner.manager
            .getRepository(TABLE_NAME.Bookings)
            .insert(bookings);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.manager.getRepository(TABLE_NAME.Bookings).delete({});
    }
}
