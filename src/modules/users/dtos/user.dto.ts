import { AutoMap } from '@automapper/classes';
import { BaseDto } from '@libs/shared/dtos/common.dto';

export class UserDto extends BaseDto {
	@AutoMap()
	name?: string;

	@AutoMap()
	email: string;
}
