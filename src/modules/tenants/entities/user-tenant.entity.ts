import { AutoMap } from '@automapper/classes';
import { Column, Entity, ManyToOne } from 'typeorm';
import { UserEntity } from '../../users/entities/user.entity';
import { BaseEntity } from '@libs/shared/entities/base.entity';
import { TenantEntity } from './tenant.entity';
import { RoleEnum } from '../enums/role.enum';

@Entity('app_user_tenant')
export class UserTenantEntity extends BaseEntity {
    @Column({ type: 'uuid', nullable: false })
    @AutoMap()
    userId: string;

    @Column({ type: 'uuid', nullable: false })
    @AutoMap()
    tenantId: string;

    @Column({ type: 'varchar', length: 255, nullable: false })
    @AutoMap(() => String)
    role: RoleEnum;

    @ManyToOne(() => UserEntity, (user) => user.userTenants)
    @AutoMap(() => UserEntity)
    user?: UserEntity;

    @ManyToOne(() => TenantEntity, (tenant) => tenant.userTenants)
    @AutoMap(() => TenantEntity)
    tenant?: TenantEntity;
}
