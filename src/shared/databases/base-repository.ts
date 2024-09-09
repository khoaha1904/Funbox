import { DeepPartial, FindManyOptions, FindOneOptions, InsertResult, QueryRunner, SelectQueryBuilder } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { UpsertOptions } from 'typeorm/repository/UpsertOptions';
import { PaginationRequestDto } from '../dtos/pagination.dto';

export interface BaseRepository<T> {
	create: (data: DeepPartial<T>) => T;
	createMany(data: DeepPartial<T>[]): T[];
	save: (data: DeepPartial<T>, runner?: QueryRunner) => Promise<T>;
	saveMany(data: DeepPartial<T>[]): Promise<T[]>;
	findOne: (filterCondition: FindOneOptions<T>) => Promise<T>;
	findOneAndUpdate: (filterCondition: FindOneOptions<T>, data: DeepPartial<T>, runner?: QueryRunner) => Promise<T>;
	findAndCount: (
		filters: FindManyOptions<T>,
		pagination?: PaginationRequestDto,
		runner?: QueryRunner
	) => Promise<[T[], number]>;
	remove: (data: T) => Promise<T>;
	upsert(
		entityOrEntities: QueryDeepPartialEntity<T> | QueryDeepPartialEntity<T>[],
		conflictPathsOrOptions: string[] | UpsertOptions<T>
	): Promise<InsertResult>;
	createQueryBuilder(item?: string): SelectQueryBuilder<T>;
}
