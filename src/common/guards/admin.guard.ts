import { CanActivate, ExecutionContext, Injectable, ForbiddenException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User, UserRole } from '../../modules/organizations/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AdminGuard implements CanActivate {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();

        const userId = request.headers['x-user-id'];

        if (!userId) {
            throw new UnauthorizedException('Missing x-user-id header. Please simulate login.');
        }

        const user = await this.userRepository.findOne({ where: { id: userId } });

        if (!user) {
            throw new UnauthorizedException('User not found.');
        }

        if (user.role !== UserRole.ADMIN) {
            throw new ForbiddenException('Access denied. Only Admins can perform this action.');
        }

        return true;
    }
}