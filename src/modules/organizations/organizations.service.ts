import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Organization } from './entities/organization.entity';
import { User } from './entities/user.entity';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class OrganizationsService {
    constructor(
        @InjectRepository(Organization)
        private orgRepo: Repository<Organization>,
        @InjectRepository(User)
        private userRepo: Repository<User>,
    ) { }

    async createOrganization(dto: CreateOrganizationDto) {
        const org = this.orgRepo.create(dto);
        return this.orgRepo.save(org);
    }

    async createUser(orgId: string, dto: CreateUserDto) {
        const org = await this.orgRepo.findOneBy({ id: orgId });


        if (!org) {
            throw new NotFoundException('Organization not found');
        }


        const user = this.userRepo.create({
            ...dto,
            organization: org,
        });
        return this.userRepo.save(user);
    }

    //  Get Org with Users
    async findOne(id: string) {
        return this.orgRepo.findOne({
            where: { id },
            relations: ['users'],
        });
    }
}