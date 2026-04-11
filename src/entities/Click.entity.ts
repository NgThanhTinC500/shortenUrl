import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { ShortUrl } from './ShortUrl.entity';

@Entity()
export class Click {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    shortUrlId: number;

    @ManyToOne(() => ShortUrl, (shortUrl) => shortUrl.clicks)
    @JoinColumn({ name: 'shortUrlId' })
    shortUrl: ShortUrl;

    @Column({ nullable: true })
    ip: string;

    @Column({ nullable: true })
    browser: string;

    @Column({ nullable: true })
    os: string;

    @Column({ nullable: true })
    country: string;

    @Column({ nullable: true })
    referrer: string;

    @CreateDateColumn()
    clickedAt: Date;
}