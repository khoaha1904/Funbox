import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { AutoMap } from '@automapper/classes';
import { BaseNoneIdEntity } from '@libs/shared/entities/base-none-id.entity';
import { TenantEntity } from '@apps/modules/tenants/entities/tenant.entity';

export class FacebookPageCategory {
    id: string;
    name: string;
}

@Entity('facebook_pages')
export class FacebookPageEntity extends BaseNoneIdEntity {
    @PrimaryColumn({ type: 'int8' })
    @AutoMap()
    id?: number;

    @Column({ type: 'uuid', nullable: true })
    @AutoMap()
    tenantId: string;

    @ManyToOne(() => TenantEntity, (tenant: TenantEntity) => tenant.facebookPages)
    @AutoMap(() => TenantEntity)
    tenant: TenantEntity;

    // @OneToMany(() => FacebookConversationEntity, (conversation) => conversation.facebook_page)
    // @AutoMap(() => [FacebookConversationEntity])
    // conversations: FacebookConversationEntity[];

    @Column({ type: 'varchar', length: 255, nullable: true })
    @AutoMap()
    user_access_token: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    @AutoMap()
    page_access_token: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    @AutoMap()
    name: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    @AutoMap()
    category: string;

    @Column({ type: 'jsonb', nullable: true })
    @AutoMap()
    category_list: FacebookPageCategory[];

    @Column({ type: 'simple-array', nullable: true })
    @AutoMap(() => [String])
    tasks: string[];
}
