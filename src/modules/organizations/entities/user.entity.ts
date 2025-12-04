import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Organization } from './organization.entity';

export enum UserRole {
    ADMIN = 'admin',
    CUSTOMER = 'customer',
}

@Entity()
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column()
    email: string;

    @Column({
        type: 'simple-enum',
        enum: UserRole,
        default: UserRole.CUSTOMER,
    })
    role: UserRole;

    @ManyToOne(() => Organization, (org) => org.users, { onDelete: 'CASCADE' })
    organization: Organization;
}