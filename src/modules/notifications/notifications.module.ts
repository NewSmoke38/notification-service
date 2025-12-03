import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationsService } from './notifications.service';
import { NotificationsController } from './notifications.controller';
import { NotificationGroup } from './entities/notification-group.entity';
import { NotificationTopic } from './entities/notification-topic.entity';
import { User } from '../organizations/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([NotificationGroup, NotificationTopic, User])
  ],
  controllers: [NotificationsController],
  providers: [NotificationsService],
  exports: [NotificationsService],
})
export class NotificationsModule { }