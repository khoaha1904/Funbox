import { FacebookExternalsPagingDto, FacebookPagingExternalsResponse } from "./responses/common";


export class FacebookExternalsAudience {
    name: string;
    email: string;
    id: string;
}

export class FacebookExternalMessageAttachment {
    id: string;
    name: string;
    size: number;
    mime_type: string;
    file_url?: string;
    image_data?: {
        url: string;
        width: number;
        height: number;
        max_width: number;
        image_type: number;
        max_height: number;
        preview_url: string;
        render_as_sticker: boolean;
    };
}

export class FacebookExternalsMessage {
    id: number;
    message: string;
    created_time: string;
    from: FacebookExternalsAudience;
    to: { data: FacebookExternalsAudience[] };
    attachments?: FacebookPagingExternalsResponse<FacebookExternalMessageAttachment>;
}

export class FacebookExternalsConversationDto {
    id: string;
    participants: {
        data: FacebookExternalsAudience[];
    };
    messages: {
        data: FacebookExternalsMessage[];
        paging: FacebookExternalsPagingDto;
    };
}
