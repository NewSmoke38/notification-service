import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { NotificationGroup } from './notification-group.entity';

@Entity()
export class NotificationTopic {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @ManyToOne(() => NotificationGroup, (group) => group.topics, { onDelete: 'CASCADE' })
    group: NotificationGroup;
}