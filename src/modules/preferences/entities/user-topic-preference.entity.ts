import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from '../../organizations/entities/user.entity';
import { NotificationTopic } from '../../notifications/entities/notification-topic.entity';

@Entity()
export class UserTopicPreference {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => User, { onDelete: 'CASCADE' })
    user: User;

    @ManyToOne(() => NotificationTopic, { onDelete: 'CASCADE' })
    topic: NotificationTopic;

    @Column()
    channel: string; // email, sms, etc.

    @Column({ default: true })
    isEnabled: boolean;
}