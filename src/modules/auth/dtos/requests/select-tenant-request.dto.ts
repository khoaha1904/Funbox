import { IsString } from "class-validator";

export class SelectTenantRequestDto {
    @IsString()
    tenantId: string;
}