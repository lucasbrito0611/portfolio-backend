import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('skills')
export class Skill {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column({ nullable: true }) 
    description: string | null;

    @Column()
    imageUrl: string;

    @Column()
    docUrl: string;

    @Column()
    className: string;

    @Column({ type: 'int', default: 0 })
    order: number;

    @CreateDateColumn()
    createdAt: Date;
}
