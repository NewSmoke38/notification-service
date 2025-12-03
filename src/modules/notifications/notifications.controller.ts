import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { CreateTopicDto } from './dto/create-topic.dto';

@Controller()
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) { }

  @Post('organizations/:orgId/groups')
  createGroup(
    @Param('orgId') orgId: string,
    @Body() dto: CreateGroupDto,
  ) {
    return this.notificationsService.createGroup(orgId, dto);
  }

  @Post('groups/:groupId/topics')
  createTopic(
    @Param('groupId') groupId: string,
    @Body() dto: CreateTopicDto,
  ) {
  }

  @Get('organizations/:orgId/notifications')
  findAll(@Param('orgId') orgId: string) {
    return this.notificationsService.findAllByOrg(orgId);
  }
}