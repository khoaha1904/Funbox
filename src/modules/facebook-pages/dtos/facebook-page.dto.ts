import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { AutoMap } from '@automapper/classes';
import { TenantEntity } from '@apps/modules/tenants/entities/tenant.entity';
import { BaseNoneIdDto } from '@libs/shared/dtos/common.dto';
import { TenantDto } from '@apps/modules/tenants/dtos/tenant.dto';

export class FacebookPageCategoryDto {
    id: string;
    name: string;
}

export class FacebookPageDto extends BaseNoneIdDto {
    @AutoMap(() => Number)
    id?: number;

    @AutoMap()
    tenantId: string;

    @AutoMap(() => TenantDto)
    tenant: TenantDto;

    // @OneToMany(() => FacebookConversationDto, (conversation) => conversation.facebook_page)
    // @AutoMap(() => [FacebookConversationDto])
    // conversations: FacebookConversationDto[];

    @AutoMap()
    user_access_token: string;

    @AutoMap()
    page_access_token: string;

    @AutoMap()
    name: string;

    @AutoMap()
    category: string;

    @AutoMap()
    category_list: FacebookPageCategoryDto[];

    @AutoMap(() => [String])
    tasks: string[];
}
