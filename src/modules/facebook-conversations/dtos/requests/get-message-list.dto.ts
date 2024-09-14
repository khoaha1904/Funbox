import { PaginationRequestDto } from "@libs/shared/dtos/pagination.dto";
import { IsOptional, IsString } from "class-validator";

export class GetFacebookMessageListRequestDto extends PaginationRequestDto {
    @IsString()
    @IsOptional()
    lastMessageTime?: string;
}