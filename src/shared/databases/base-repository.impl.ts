import {
	DeepPartial,
	FindManyOptions,
	FindOneOptions,
	FindOptionsOrder,
	InsertResult,
	QueryRunner,
	Repository,
	SelectQueryBuilder,
} from 'typeorm';

import { NotFoundException } from '@nestjs/common';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { UpsertOptions } from 'typeorm/repository/UpsertOptions';
import { BaseEntity } from '../entities/base.entity';
import { BaseNoneIdEntity } from '../entities/base-none-id.entity';
import { BaseRepository } from './base-repository';
import { PaginationRequestDto } from '../dtos/pagination.dto';

export abstract class BaseRepositoryImpl<T extends BaseEntity | BaseNoneIdEntity> implements BaseRepository<T> {
	private entity: Repository<T>;

	protected constructor(entity: Repository<T>) {
		this.entity = entity;
	}

	public create(data: DeepPartial<T>): T {
		return this.entity.create({
			...data,
		});
	}

	public createMany(data: DeepPartial<T>[]): T[] {
		return this.entity.create(data);
	}

	public async save(data: DeepPartial<T>, runner?: QueryRunner): Promise<T> {
		if (runner) {
			return (await runner.manager.save(this.entity.target, data)) as T;
		}
		return await this.entity.save(data);
	}

	public async saveMany(data: DeepPartial<T>[]): Promise<T[]> {
		return await this.entity.save(data);
	}

	public async findOne(filterCondition: FindOneOptions<T>): Promise<T> {
		return await this.entity.findOne(filterCondition);
	}

	public async findWithRelations(relations: FindManyOptions<T>): Promise<T[]> {
		return await this.entity.find(relations);
	}

	public async findOneAndUpdate(
		filterCondition: FindOneOptions<T>,
		data: DeepPartial<T>,
		runner: QueryRunner
	): Promise<T> {
		const entity = await this.entity.findOne(filterCondition);
		if (!entity) {
			throw new NotFoundException('Entity not found');
		}

		const newEntity = { ...entity, ...data };
		if (runner) {
			return await runner.manager.save(this.entity.target, newEntity);
		}
		return await this.entity.save(newEntity);
	}

	public async findAndCount(
		filters: FindManyOptions<T> = {},
		pagination: PaginationRequestDto,
		runner?: QueryRunner
	): Promise<[T[], number]> {
		// remove filter field
		const { pageIndex = 0, pageSize = 10, sort, filter } = pagination;

		const sortData = sort?.split(':');
		const order = {
			[sortData?.[0] || 'createdAt']: sortData?.[1] || 'desc',
		} as FindOptionsOrder<T>;

		filters.skip = pageIndex * pageSize;
		filters.take = pageSize;
		filters.order = order;

		if (runner) {
			return (await runner.manager.findAndCount(this.entity.target, filters)) as [T[], number];
		}

		return await this.entity.findAndCount(filters);
	}

	public async remove(data: T, runner?: QueryRunner): Promise<T> {
		if (runner) {
			return (await runner.manager.remove(data)) as T;
		}
		return await this.entity.remove(data);
	}

	public async softRemove(data: T, runner?: QueryRunner): Promise<T> {
		if (runner) {
			return (await runner.manager.softRemove(data)) as T;
		}
		return await this.entity.softRemove(data);
	}

	public createQueryBuilder(item?: string): SelectQueryBuilder<T> {
		return this.entity.createQueryBuilder(item);
	}

	public async upsert(
		entityOrEntities: QueryDeepPartialEntity<T> | QueryDeepPartialEntity<T>[],
		conflictPathsOrOptions: string[] | UpsertOptions<T>
	): Promise<InsertResult> {
		return this.entity.upsert(entityOrEntities, conflictPathsOrOptions);
	}

	// public async findAll(options?: FindManyOptions<T>): Promise<T[]> {
	// 	return await this.entity.find(options);
	// }

	// public async preload(entityLike: DeepPartial<T>): Promise<T> {
	// 	return await this.entity.preload(entityLike);
	// }

	// public async findOneById(id: any): Promise<T> {
	// 	const options: FindOptionsWhere<T> = {
	// 		id: id,
	// 	};
	// 	return await this.entity.findOneBy(options);
	// }
}
