import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { Organization } from '../../organizations/entities/organization.entity';
import { NotificationTopic } from './notification-topic.entity';

@Entity()
export class NotificationGroup {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @ManyToOne(() => Organization, (org) => org.groups, { onDelete: 'CASCADE' })
    organization: Organization;

    @OneToMany(() => NotificationTopic, (topic) => topic.group)
    topics: NotificationTopic[];
}