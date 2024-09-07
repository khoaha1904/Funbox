import { Transform, Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';
// import { De } from 'class-transformer';

export class PaginationRequestDto {
	@IsString()
	@IsOptional()
	filter?: string;

	@IsNumber()
	@IsOptional()
	@Type(() => Number)
	@Transform(({ value }) => (value !== undefined ? Number(value) : 0))
	pageIndex?: number;

	@IsNumber()
	@IsOptional()
	@Transform(({ value }) => (value !== undefined ? Number(value) : 10))
	pageSize?: number;

	@IsString()
	@IsOptional()
	sort?: string;

	constructor(partial: Partial<PaginationRequestDto>) {
		Object.assign(this, partial);
		this.pageIndex = this.pageIndex != undefined ? Number(this.pageIndex) : 0;
		this.pageSize = this.pageSize != undefined ? Number(this.pageSize) : 10;
	}
}
