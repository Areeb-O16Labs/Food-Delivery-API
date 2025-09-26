import { Restaurants } from "src/modules/restaurants/entities/restaurant.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Menus {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;
    
    @Column()
    description: string;
    
    @Column({ type: 'decimal', precision: 10, scale: 2 })
    price: number;

    @Column({default: true})
    isActive: boolean

    @ManyToOne(() => Restaurants)
    restaurant: Restaurants

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
