import { IsString } from 'class-validator';

export class CreateTenantRequestDto {
    @IsString()
    name: string;

    code: string;
}
