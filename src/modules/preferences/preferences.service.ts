import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserGroupPreference } from './entities/user-group-preference.entity';
import { UserTopicPreference } from './entities/user-topic-preference.entity';
import { NotificationTopic } from '../notifications/entities/notification-topic.entity';
import { NotificationGroup } from '../notifications/entities/notification-group.entity';
import { User } from '../organizations/entities/user.entity';
import { UpdateGroupPreferenceDto } from './dto/update-group-preference.dto';
import { UpdateTopicPreferenceDto } from './dto/update-topic-preference.dto';
import { CheckNotificationDto } from './dto/check-notification.dto';

@Injectable()
export class PreferencesService {
    constructor(
        @InjectRepository(UserGroupPreference)
        private groupPrefRepo: Repository<UserGroupPreference>,
        @InjectRepository(UserTopicPreference)
        private topicPrefRepo: Repository<UserTopicPreference>,
        @InjectRepository(NotificationTopic)
        private topicRepo: Repository<NotificationTopic>,
        @InjectRepository(NotificationGroup)
        private groupRepo: Repository<NotificationGroup>,
        @InjectRepository(User)
        private userRepo: Repository<User>,
    ) { }

    // 1. Set Group Preference (The Kill Switch)
    async setGroupPreference(dto: UpdateGroupPreferenceDto) {
        let pref = await this.groupPrefRepo.findOne({
            where: {
                user: { id: dto.userId },
                group: { id: dto.groupId },
            },
        });

        if (pref) {
            pref.isEnabled = dto.enabled;
        } else {
            pref = this.groupPrefRepo.create({
                user: { id: dto.userId },
                group: { id: dto.groupId },
                isEnabled: dto.enabled,
            });
        }

        return this.groupPrefRepo.save(pref);
    }

    // 2. Set Topic Preference (Fine Tuning)
    async setTopicPreference(dto: UpdateTopicPreferenceDto) {
        let pref = await this.topicPrefRepo.findOne({
            where: {
                user: { id: dto.userId },
                topic: { id: dto.topicId },
                channel: dto.channel,
            },
        });

        if (pref) {
            pref.isEnabled = dto.enabled;
        } else {
            pref = this.topicPrefRepo.create({
                user: { id: dto.userId },
                topic: { id: dto.topicId },
                channel: dto.channel,
                isEnabled: dto.enabled,
            });
        }

        return this.topicPrefRepo.save(pref);
    }

    // 3. THE CORE LOGIC: Check if Notification is Allowed
    async checkNotification(dto: CheckNotificationDto) {
        // Step A: Find the Topic to get its Group ID
        const topic = await this.topicRepo.findOne({
            where: { id: dto.topicId },
            relations: ['group'],
        });

        if (!topic) {
            return { allowed: false, reason: 'Topic not found' };
        }

        // Step B: GATE 1 - CHECK GROUP PREFERENCE
        const groupPref = await this.groupPrefRepo.findOne({
            where: {
                user: { id: dto.userId },
                group: { id: topic.group.id },
            },
        });

        if (groupPref && groupPref.isEnabled === false) {
            return { allowed: false, reason: 'Group disabled by user' };
        }

        // Step C: GATE 2 - CHECK TOPIC/CHANNEL PREFERENCE
        const topicPref = await this.topicPrefRepo.findOne({
            where: {
                user: { id: dto.userId },
                topic: { id: dto.topicId },
                channel: dto.channel,
            },
        });

        if (topicPref && topicPref.isEnabled === true) {
            return { allowed: true };
        }

        // Step D: DEFAULT BLOCK
        return { allowed: false, reason: 'No explicit preference (Opt-in)' };
    }

    // 4. GET FULL PREFERENCES TREE (The "Settings Page" API)
    async getUserPreferences(userId: string) {
        // A. Find User to get their Org ID
        const user = await this.userRepo.findOne({
            where: { id: userId },
            relations: ['organization'],
        });
        if (!user) throw new NotFoundException('User not found');

        // B. Fetch all Groups & Topics for this Org
        const groups = await this.groupRepo.find({
            where: { organization: { id: user.organization.id } },
            relations: ['topics'],
        });

        // C. Fetch user's existing overrides
        const groupPrefs = await this.groupPrefRepo.find({
            where: { user: { id: userId } },
        });
        const topicPrefs = await this.topicPrefRepo.find({
            where: { user: { id: userId } },
        });

        // D. Merge Data
        return {
            userId: user.id,
            orgId: user.organization.id,
            preferences: groups.map((group) => {
                // Check Group Status
                const groupOverride = groupPrefs.find((p) => p.group.id === group.id);
                const isGroupEnabled = groupOverride ? groupOverride.isEnabled : true; // Default True

                return {
                    groupId: group.id,
                    groupName: group.name,
                    enabled: isGroupEnabled,
                    topics: group.topics.map((topic) => {
                        // Find all channel prefs for this topic
                        const thesePrefs = topicPrefs.filter((p) => p.topic.id === topic.id);

                        return {
                            topicId: topic.id,
                            topicName: topic.name,
                            channels: {
                                email: thesePrefs.find((p) => p.channel === 'email')?.isEnabled || false,
                                sms: thesePrefs.find((p) => p.channel === 'sms')?.isEnabled || false,
                                push: thesePrefs.find((p) => p.channel === 'push')?.isEnabled || false,
                                in_app: thesePrefs.find((p) => p.channel === 'in_app')?.isEnabled || false,
                                chat: thesePrefs.find((p) => p.channel === 'chat')?.isEnabled || false,
                                whatsapp: thesePrefs.find((p) => p.channel === 'whatsapp')?.isEnabled || false,
                            },
                        };
                    }),
                };
            }),
        };
    }
}