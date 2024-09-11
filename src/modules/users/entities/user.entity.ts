import { AutoMap } from '@automapper/classes';
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryColumn } from 'typeorm';
import { BaseEntity } from '@libs/shared/entities/base.entity';
import { UserTenantEntity } from '@apps/modules/tenants/entities/user-tenant.entity';


@Entity('app_users')
export class UserEntity extends BaseEntity {
	@Column({ type: 'varchar', length: 254, nullable: true })
	@AutoMap()
	name?: string;

	@Column({ type: 'varchar', length: 254, unique: true, nullable: false })
	@AutoMap()
	email: string;

	@Column({ type: 'varchar', length: 255, nullable: false })
	password: string;

	@Column({ type: 'boolean', nullable: false, default: false })
	verify: boolean;

	@OneToMany(() => UserTenantEntity, (userTenantRole: UserTenantEntity) => userTenantRole.user)
	@AutoMap(() => [UserTenantEntity])
	userTenants: UserTenantEntity[];
}