import { BaseRepository } from "@libs/shared/databases/base-repository";
import { FacebookConversationAudienceEntity } from "../entities/facebook-conversation-audience.entity";


export const FacebookConversationAudienceRepository = Symbol.for('FacebookConversationAudienceRepository');
export type FacebookConversationAudienceRepository = BaseRepository<FacebookConversationAudienceEntity>;
