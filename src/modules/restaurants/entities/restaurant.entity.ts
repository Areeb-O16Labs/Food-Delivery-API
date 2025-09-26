import { Menus } from "src/modules/menus/entities/menu.entity";
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Restaurants {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;
    
    @Column()
    address: string; 
    
    @Column()
    phoneNumber: string;

    @Column({ type: "float" })
    rating: number;

    @OneToMany(() => Menus, (menu) => menu.restaurant)
    menus: Menus[]

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
