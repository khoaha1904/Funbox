import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class ConnectFacebookRequestDto {
    @IsString()
    user_access_token: string;

    @IsString()
    page_id: string;

    @IsBoolean()
    @IsOptional()
    sync_message: boolean;
}
