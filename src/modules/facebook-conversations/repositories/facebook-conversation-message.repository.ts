import { BaseRepository } from "@libs/shared/databases/base-repository";
import { FacebookConversationMessageEntity } from "../entities/facebook-conversation-message.entity";


export const FacebookConversationMessageRepository = Symbol.for('FacebookConversationMessageRepository');
export type FacebookConversationMessageRepository = BaseRepository<FacebookConversationMessageEntity>;
