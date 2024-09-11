import { AutoMap } from '@automapper/classes';
import { BaseEntity } from '@libs/shared/entities/base.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { UserTenantEntity } from './user-tenant.entity';
import { FacebookPageEntity } from '@apps/modules/facebook-pages/entities/facebook-page.entity';

@Entity('app_tenants')
export class TenantEntity extends BaseEntity {
    @Column({ type: 'varchar', length: 255, nullable: false })
    @AutoMap()
    name: string;

    @Column({ type: 'varchar', length: 255, nullable: false })
    @AutoMap()
    code: string;

    @OneToMany(() => UserTenantEntity, (userTenant: UserTenantEntity) => userTenant.user)
    @AutoMap(() => [UserTenantEntity])
    userTenants: UserTenantEntity[];

    @OneToMany(() => FacebookPageEntity, (facebookPage: FacebookPageEntity) => facebookPage.tenant)
    @AutoMap(() => [FacebookPageEntity])
    facebookPages: FacebookPageEntity[];
}
