import { Menus } from "src/modules/menus/entities/menu.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Orders } from "./order.entity";

@Entity()
export class OrderItems {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => Orders, { onDelete: 'CASCADE' })
    order: Orders;

    @ManyToOne(() => Menus, { onDelete: 'CASCADE' })
    menu: Menus;

    @Column({ type: "int" })
    quantity: number;

    @Column({ type: "decimal", precision: 10, scale: 2 })
    price: number;
}