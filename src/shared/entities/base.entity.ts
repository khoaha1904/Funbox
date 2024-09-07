import { AutoMap } from '@automapper/classes';
import { PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';
import { BaseEntity as BaseTypeorm } from 'typeorm';

export abstract class BaseEntity extends BaseTypeorm {
	@PrimaryGeneratedColumn('uuid')
	@AutoMap()
	id?: string;

	@Column({ type: 'boolean', default: true })
	@AutoMap()
	isActive: boolean;

	@CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
	@AutoMap(() => Date)
	createdAt: Date;

	@CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
	@AutoMap(() => Date)
	updatedAt: Date;
}
