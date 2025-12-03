import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { User } from './user.entity';
import { NotificationGroup } from '../../notifications/entities/notification-group.entity';

@Entity()
export class Organization {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @OneToMany(() => User, (user) => user.organization)
    users: User[];

    @OneToMany(() => NotificationGroup, (group) => group.organization)
    groups: NotificationGroup[];
}