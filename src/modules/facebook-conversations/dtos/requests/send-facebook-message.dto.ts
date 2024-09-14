import { IsNumber, IsString } from "class-validator";

export class SendFacebookMessageRequestDto {
    @IsString()
    message: string;

    @IsNumber()
    recipientId: number;
}
