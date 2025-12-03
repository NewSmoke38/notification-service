import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { PreferencesService } from './preferences.service';
import { UpdateGroupPreferenceDto } from './dto/update-group-preference.dto';
import { UpdateTopicPreferenceDto } from './dto/update-topic-preference.dto';
import { CheckNotificationDto } from './dto/check-notification.dto';

@Controller('preferences')
export class PreferencesController {
  constructor(private readonly preferencesService: PreferencesService) { }

  @Post('group')
  setGroupPreference(@Body() dto: UpdateGroupPreferenceDto) {
    return this.preferencesService.setGroupPreference(dto);
  }

  @Post('topic')
  setTopicPreference(@Body() dto: UpdateTopicPreferenceDto) {
    return this.preferencesService.setTopicPreference(dto);
  }

  @Post('check')
  check(@Body() dto: CheckNotificationDto) {
    return this.preferencesService.checkNotification(dto);
  }

  //  get full settings tree of a user
  @Get('user/:userId')
  getUserPreferences(@Param('userId') userId: string) {
    return this.preferencesService.getUserPreferences(userId);
  }
}