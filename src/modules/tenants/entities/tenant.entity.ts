import { AutoMap } from '@automapper/classes';
import { BaseEntity } from '@libs/shared/entities/base.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { UserTenantEntity } from './user-tenant.entity';

@Entity('app_tenants')
export class TenantEntity extends BaseEntity {
    @Column({ type: 'varchar', length: 255, nullable: false })
    @AutoMap()
    name: string;

    @Column({ type: 'varchar', length: 255, nullable: false })
    @AutoMap()
    code: string;

    @OneToMany(() => UserTenantEntity, (userTenantRole: UserTenantEntity) => userTenantRole.user)
    @AutoMap(() => [UserTenantEntity])
    userTenants: UserTenantEntity[];
}
