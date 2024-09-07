import { AutoMap } from '@automapper/classes';
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryColumn } from 'typeorm';
// import { UserTenantRoleEntity } from '../../role-permissions/entities/user-tennant-role.entity';
import { BaseEntity } from '@libs/shared/entities/base.entity';

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

	// @Column({ type: 'uuid', nullable: true })
	// user_tenant_role_id: string;

	// @OneToMany(() => UserTenantRoleEntity, (userTenantRole: UserTenantRoleEntity) => userTenantRole.user)
	// @AutoMap(() => [UserTenantRoleEntity])
	// userTenantRoles: UserTenantRoleEntity[];
}
