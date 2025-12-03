import { Controller, Post, Body, Param, Get } from '@nestjs/common';
import { OrganizationsService } from './organizations.service';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('organizations')
export class OrganizationsController {
  constructor(private readonly organizationsService: OrganizationsService) { }

  @Post()
  create(@Body() createOrganizationDto: CreateOrganizationDto) {
    return this.organizationsService.createOrganization(createOrganizationDto);
  }

  @Post(':id/users')
  createUser(
    @Param('id') id: string,
    @Body() createUserDto: CreateUserDto,
  ) {
    return this.organizationsService.createUser(id, createUserDto);
  }

  @Get(':id')
  getOne(@Param('id') id: string) {
    return this.organizationsService.findOne(id);
  }
}