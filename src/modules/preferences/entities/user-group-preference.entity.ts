import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from '../../organizations/entities/user.entity';
import { NotificationGroup } from '../../notifications/entities/notification-group.entity';

@Entity()
export class UserGroupPreference {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => User, { onDelete: 'CASCADE' })
    user: User;

    @ManyToOne(() => NotificationGroup, { onDelete: 'CASCADE' })
    group: NotificationGroup;

    @Column({ default: true })
    isEnabled: boolean;
}