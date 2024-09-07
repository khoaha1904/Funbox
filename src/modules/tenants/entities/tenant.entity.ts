import { AutoMap } from '@automapper/classes';
import { BaseEntity } from '@libs/shared/entities/base.entity';
import { Column, Entity, OneToMany } from 'typeorm';
// import { UserTenantRoleEntity } from '../../role-permissions/entities/user-tennant-role.entity';

@Entity('app_tenants')
export class TenantEntity extends BaseEntity {
    @Column({ type: 'varchar', length: 255, nullable: false })
    @AutoMap()
    name: string;

    @Column({ type: 'varchar', length: 255, nullable: false })
    @AutoMap()
    code: string;

    // @OneToMany(() => UserTenantRoleEntity, (userTenantRole: UserTenantRoleEntity) => userTenantRole.user)
    // @AutoMap(() => [UserTenantRoleEntity])
    // userTenantRoles: UserTenantRoleEntity[];
}
