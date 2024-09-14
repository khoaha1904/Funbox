import { PaginationResponseDto } from "@libs/shared/dtos/response.dto";
import { GetFacebookConverstaionListRequestDto } from "../dtos/requests/get-facebook-conversation-list.dto";
import { FacebookConversationDto } from "../dtos/facebook-conversation.dto";
import { GetFacebookMessageListRequestDto } from "../dtos/requests/get-message-list.dto";
import { FacebookConversationMessageDto } from "../dtos/facebook-conversation-message.dto";

export const FacebookConversationService = Symbol.for('FacebookConversationService');
export type FacebookConversationService = {
    sendMessage(data: { pageId: number, message: string, recipientId: number }): Promise<boolean>;
    syncConversation(facebookPageId: number, facebookPageToken: string, tenant_id: string): Promise<boolean>
    getMessageList(request: GetFacebookMessageListRequestDto, pageId: number, conversationId: string): Promise<PaginationResponseDto<FacebookConversationMessageDto>>
    getConversationList(request: GetFacebookConverstaionListRequestDto, pageId: number): Promise<PaginationResponseDto<FacebookConversationDto>>;
};
