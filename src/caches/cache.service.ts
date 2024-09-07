import { Injectable } from '@nestjs/common';
import { InjectRedis } from '@nestjs-modules/ioredis';
import Redis from 'ioredis';

@Injectable()
export class AppCacheService {
	constructor(@InjectRedis() private readonly redisClient: Redis) {}

	async getList<T>(key: string): Promise<T[]> {
		return this.redisClient.lrange(key, 0, -1) as any;
	}

	async addToList(key: string, value: string, isUnique = true): Promise<any> {
		if (isUnique) {
			// If the value should be unique, remove any existing occurrences first
			await this.redisClient.lrem(key, 0, value);
		}

		return (await this.redisClient.lpush(key, value)) === 1;
	}

	async removeFromList(key: string, value: string): Promise<boolean> {
		return (await this.redisClient.lrem(key, 1, value)) === 1;
	}

	async setOne(key: string, value: any, ttl = 0): Promise<boolean> {
		if (!value) {
			return false;
		}
		const valueString = JSON.stringify(value);
		let result;

		if (ttl > 0) {
			result = await this.redisClient.set(key, valueString, 'EX', ttl);
		} else {
			result = await this.redisClient.set(key, valueString);
		}
		return result === 'OK';
	}

	async getOne<T>(key: string): Promise<T> {
		const resultString = await this.redisClient.get(key);
		if (!resultString) {
			return null;
		}
		return JSON.parse(resultString);
	}

	async deleteOne(key: string): Promise<boolean> {
		const result = await this.redisClient.del(key);
		return result === 1;
	}

	async getListByPrefix<T>(prefix: string): Promise<T[]> {
		const keys = await this.redisClient.keys(`${prefix}*`);
		const values = await Promise.all(keys.map((key) => this.redisClient.get(key)));
		return values.map((value) => (value ? JSON.parse(value) : null));
	}

	async countByPrefix(prefix: string): Promise<number> {
		const keys = await this.redisClient.keys(`${prefix}*`);
		return keys.length;
	}

	async deleteByPrefix(prefix: string): Promise<void> {
		const keys = await this.redisClient.keys(`${prefix}*`);
		if (keys.length > 0) {
			await this.redisClient.del(...keys);
		}
	}
}
