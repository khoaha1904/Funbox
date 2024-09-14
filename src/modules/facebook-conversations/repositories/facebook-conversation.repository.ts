import { BaseRepository } from "@libs/shared/databases/base-repository";
import { FacebookConversationEntity } from "../entities/facebook-conversation.entity";


export const FacebookConversationRepository = Symbol.for('FacebookConversationRepository');
export type FacebookConversationRepository = BaseRepository<FacebookConversationEntity>;
