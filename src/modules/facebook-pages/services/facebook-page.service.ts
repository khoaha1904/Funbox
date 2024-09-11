import { PaginationResponseDto } from "@libs/shared/dtos/response.dto";
import { GetFacebookPageListRequestDto } from "../dtos/requests/get-facebook-page-list-request.dto";
import { FacebookPageDto } from "../dtos/facebook-page.dto";

export const FacebookPageService = Symbol.for('FacebookPageService');
export type FacebookPageService = {
    getList(request: GetFacebookPageListRequestDto, userId: string): Promise<PaginationResponseDto<FacebookPageDto>>;
    connectFacebook(data: {
        user_access_token: string;
        page_id: string;
        sync_message?: boolean;
    }, userId: string, tenantId: string): Promise<boolean>
};
