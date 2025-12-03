import { IsString, IsBoolean, IsNotEmpty, IsEnum } from 'class-validator';

export class UpdateTopicPreferenceDto {
    @IsString()
    @IsNotEmpty()
    userId: string;

    @IsString()
    @IsNotEmpty()
    topicId: string;

    @IsString()
    @IsNotEmpty()
    channel: string; // e.g. "email", "sms"

    @IsBoolean()
    enabled: boolean;
}