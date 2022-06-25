import { ReasonCanceled } from './../food-billing.constant';
import { Entity, Column, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from 'src/common/entities/BaseEntity';
import { Food } from 'src/modules/food/entity/food.entity';
import { Billing } from 'src/modules/billing/entity/billing.entity';

@Entity({ name: 'food_billings' })
export class FoodBilling extends BaseEntity {
    @Column({ nullable: true })
    foodId: number;

    @ManyToOne(() => Food)
    @JoinColumn({
        name: 'foodId',
    })
    food: Food;

    @Column({ nullable: true })
    billingId: number;

    @ManyToOne(() => Billing)
    @JoinColumn({
        name: 'billingId',
    })
    billing: Billing;

    @Column({ nullable: true })
    selectedCount: number;

    @Column({ nullable: true })
    processingCount: number;

    @Column({ nullable: true })
    doneCount: number;

    @Column({ nullable: true })
    canceledCount: number;

    @Column({ nullable: true })
    reasonCanceled: ReasonCanceled;

    @Column({ length: 2000, nullable: true })
    note: string;
}
