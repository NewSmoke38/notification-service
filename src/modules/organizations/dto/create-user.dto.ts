import { IsString, IsEmail, IsEnum, IsNotEmpty } from 'class-validator';
import { UserRole } from '../entities/user.entity';

export class CreateUserDto {
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsEnum(UserRole)
    role: UserRole;
}