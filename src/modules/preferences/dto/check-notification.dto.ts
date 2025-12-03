import { IsString, IsNotEmpty } from 'class-validator';

export class CheckNotificationDto {
    @IsString()
    @IsNotEmpty()
    userId: string;

    @IsString()
    @IsNotEmpty()
    topicId: string;

    @IsString()
    @IsNotEmpty()
    channel: string;
}