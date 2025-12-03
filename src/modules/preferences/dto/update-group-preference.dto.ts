import { IsString, IsBoolean, IsNotEmpty } from 'class-validator';

export class UpdateGroupPreferenceDto {
    @IsString()
    @IsNotEmpty()
    userId: string;

    @IsString()
    @IsNotEmpty()
    groupId: string;

    @IsBoolean()
    enabled: boolean;
}