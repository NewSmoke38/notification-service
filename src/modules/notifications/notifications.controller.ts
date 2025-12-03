import { Controller, Post, Get, Body, Param, UseGuards } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { CreateTopicDto } from './dto/create-topic.dto';
import { AdminGuard } from '../../common/guards/admin.guard';


@Controller()
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) { }

  @Post('organizations/:orgId/groups')
  @UseGuards(AdminGuard)
  createGroup(
    @Param('orgId') orgId: string,
    @Body() dto: CreateGroupDto,
  ) {
    return this.notificationsService.createGroup(orgId, dto);
  }

  @Post('groups/:groupId/topics')
  @UseGuards(AdminGuard)
  createTopic(
    @Param('groupId') groupId: string,
    @Body() dto: CreateTopicDto,
  ) {
    return this.notificationsService.createTopic(groupId, dto);
  }

  @Get('organizations/:orgId/notifications')
  findAll(@Param('orgId') orgId: string) {
    return this.notificationsService.findAllByOrg(orgId);
  }
}