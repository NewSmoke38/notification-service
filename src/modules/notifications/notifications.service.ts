import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotificationGroup } from './entities/notification-group.entity';
import { NotificationTopic } from './entities/notification-topic.entity';
import { Organization } from '../organizations/entities/organization.entity';
import { CreateGroupDto } from './dto/create-group.dto';
import { CreateTopicDto } from './dto/create-topic.dto';

@Injectable()
export class NotificationsService {
    constructor(
        @InjectRepository(NotificationGroup)
        private groupRepo: Repository<NotificationGroup>,
        @InjectRepository(NotificationTopic)
        private topicRepo: Repository<NotificationTopic>,
    ) { }

    async createGroup(orgId: string, dto: CreateGroupDto) {
        const group = this.groupRepo.create({
            ...dto,
            organization: { id: orgId } as Organization,
        });
        return this.groupRepo.save(group);
    }

    async createTopic(groupId: string, dto: CreateTopicDto) {
        const group = await this.groupRepo.findOneBy({ id: groupId });
        if (!group) throw new NotFoundException('Group not found');

        const topic = this.topicRepo.create({
            ...dto,
            group: group,
        });
        return this.topicRepo.save(topic);
    }

    async findAllByOrg(orgId: string) {
        return this.groupRepo.find({
            where: { organization: { id: orgId } },
            relations: ['topics'],
        });
    }
}