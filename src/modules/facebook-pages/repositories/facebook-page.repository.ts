import { BaseRepository } from "@libs/shared/databases/base-repository";
import { FacebookPageEntity } from "../entities/facebook-page.entity";


export const FacebookPageRepository = Symbol.for('FacebookPageRepository');
export type FacebookPageRepository = BaseRepository<FacebookPageEntity>;
