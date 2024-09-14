import { PaginationRequestDto } from "@libs/shared/dtos/pagination.dto";
import { Transform } from "class-transformer";
import { IsNumber, IsString } from "class-validator";

export class GetFacebookConverstaionListRequestDto extends PaginationRequestDto { }