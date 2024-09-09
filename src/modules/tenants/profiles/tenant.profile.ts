import { Mapper, createMap } from '@automapper/core';
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { Injectable } from '@nestjs/common';
import { TenantEntity } from '../entities/tenant.entity';
import { TenantDto } from '../dtos/tenant.dto';
import { UserTenantEntity } from '../entities/user-tenant.entity';
import { UserTenantDto } from '../dtos/user-tenant.dto';

@Injectable()
export class TenantProfile extends AutomapperProfile {
    constructor(@InjectMapper() mapper: Mapper) {
        super(mapper);
    }

    override get profile() {
        return (mapper: Mapper) => {
            // ? App
            createMap(mapper, TenantEntity, TenantDto);
            createMap(mapper, UserTenantEntity, UserTenantDto);
        };
    }
}
