import { AutoMap } from '@automapper/classes';
import { RoleEnum } from '../enums/role.enum';
import { UserDto } from '@apps/modules/users/dtos/user.dto';
import { TenantDto } from './tenant.dto';
import { BaseDto } from '@libs/shared/dtos/common.dto';

export class UserTenantDto extends BaseDto {
    @AutoMap()
    userId: string;

    @AutoMap()
    tenantId: string;

    @AutoMap(() => String)
    role: RoleEnum;

    @AutoMap(() => UserDto)
    user?: UserDto;

    @AutoMap(() => TenantDto)
    tenant?: TenantDto;
}
