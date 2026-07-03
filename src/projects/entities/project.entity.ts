import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('projects')
export class Project {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    title_pt: string;

    @Column()
    title_en: string;

    @Column({ type: 'text' })
    description_pt: string;

    @Column({ type: 'text' })
    description_en: string;

    @Column()
    imageUrl: string;

    @Column({ type: 'text', array: true })
    technologies: string[];

    @Column({ type: 'varchar', nullable: true })
    siteUrl: string | null;

    @Column({ type: 'varchar', nullable: true })
    githubUrl: string | null;

    @Column({ type: 'int', default: 0 })
    order: number;

    @CreateDateColumn()
    createdAt: Date;
}
