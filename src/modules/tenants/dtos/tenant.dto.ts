import { AutoMap } from '@automapper/classes';
import { BaseDto } from '@libs/shared/dtos/common.dto';

export class TenantDto extends BaseDto {
    @AutoMap()
    name?: string;

    @AutoMap()
    code?: string;
}
