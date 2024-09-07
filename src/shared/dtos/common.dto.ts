import { AutoMap } from '@automapper/classes';

export class BaseDto {
	@AutoMap()
	id?: string;

	@AutoMap()
	isActive: boolean;

	@AutoMap(() => Date)
	createdAt: Date;

	@AutoMap(() => Date)
	updatedAt: Date;
}

export class BaseNoneIdDto {
	@AutoMap()
	isActive: boolean;

	@AutoMap(() => Date)
	createdAt: Date;

	@AutoMap(() => Date)
	updatedAt: Date;
}
