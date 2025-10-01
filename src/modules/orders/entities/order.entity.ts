import { Restaurants } from "src/modules/restaurants/entities/restaurant.entity";
import { Users } from "src/modules/users/entities/user.entity";
import { OrderStatus } from "src/utils/enums";
import { Column, CreateDateColumn, Entity, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { OrderItems } from "./order-items";

@Entity()
export class Orders {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({default: OrderStatus.PENDING, type: 'enum', enum: OrderStatus, nullable: false})
    status: OrderStatus

    @ManyToOne(() => Users, { onDelete: 'CASCADE' })
    user: Users

    @ManyToOne(() => Restaurants, { onDelete: 'CASCADE' })
    restaurant: Restaurants;

    @OneToMany(() => OrderItems, (item) => item.order, { cascade: true })
    items: OrderItems[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
