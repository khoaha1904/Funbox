import { Mapper, createMap, forMember, mapFrom } from '@automapper/core';
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { Injectable } from '@nestjs/common';
import { FacebookPageEntity } from '../entities/facebook-page.entity';
import { FacebookPageDto } from '../dtos/facebook-page.dto';

@Injectable()
export class FacebookPageProfile extends AutomapperProfile {
    constructor(@InjectMapper() mapper: Mapper) {
        super(mapper);
    }

    override get profile() {
        return (mapper: Mapper) => {
            // ? App
            createMap(mapper, FacebookPageEntity, FacebookPageDto, forMember(dest => dest.id, mapFrom(src => Number(src.id))));
        };
    }
}
