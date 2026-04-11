import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
import { Click } from './Click.entity';

@Entity()
export class ShortUrl {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: true })
    code: string;

    @Column()
    originalUrl: string;

    @Column({ default: 0 })
    totalClicks: number;

    @CreateDateColumn()
    createdAt: Date;

    @OneToMany(() => Click, (click) => click.shortUrl)
    clicks: Click[];
}