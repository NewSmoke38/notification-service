import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PreferencesService } from './preferences.service';
import { PreferencesController } from './preferences.controller';
import { UserGroupPreference } from './entities/user-group-preference.entity';
import { UserTopicPreference } from './entities/user-topic-preference.entity';
import { NotificationTopic } from '../notifications/entities/notification-topic.entity';
import { NotificationGroup } from '../notifications/entities/notification-group.entity'; // Added
import { User } from '../organizations/entities/user.entity'; // Added

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserGroupPreference,
      UserTopicPreference,
      NotificationTopic,
      NotificationGroup,
      User,
    ]),
  ],
  controllers: [PreferencesController],
  providers: [PreferencesService],
  exports: [PreferencesService],
})
export class PreferencesModule { }