import { AppLoggerService, UtilService } from "@libs/shared/services";
import { BadRequestException, Inject, Injectable, InternalServerErrorException } from "@nestjs/common";
import { FacebookPageService } from "./facebook-page.service";
import { PaginationResponseDto } from "@libs/shared/dtos/response.dto";
import { FacebookPageDto } from "../dtos/facebook-page.dto";
import { GetFacebookPageListRequestDto } from "../dtos/requests/get-facebook-page-list-request.dto";
import { FacebookExternalService } from "src/externals/facebook-externals/facebook-external.service";
import { FacebookPageRepository } from "../repositories/facebook-page.repository";
import { FacebookPageEntity } from "../entities/facebook-page.entity";
import { Transactional } from "typeorm-transactional";
import { ResponseDescription } from "@libs/shared/constants/descriptions.constant";

@Injectable()
export class FacebookPageServiceImpl implements FacebookPageService {
    constructor(
        private readonly _loggerService: AppLoggerService,
        private readonly _utilService: UtilService,
        private readonly _facebook_external_service: FacebookExternalService,
        @Inject(FacebookPageRepository) private readonly _facebookPageRepository: FacebookPageRepository
    ) {
    }

    @Transactional()
    async connectFacebook(data: {
        user_access_token: string;
        page_id: string;
        sync_message?: boolean;
    }, userId: string, tenantId: string): Promise<boolean> {
        try {
            const { user_access_token, page_id } = data;

            // ? Get facebook page list by user access token
            const pageListResult = await this._facebook_external_service.getFacebookPageList(user_access_token);
            const connect_page = pageListResult.find((_item) => _item.id === page_id);
            if (!connect_page) {
                throw new BadRequestException('page_not_valid');
            }


            // ? Check page is the page already exist in another tenant or not.
            const existPage = await this._facebookPageRepository.findOne({ where: { id: Number(page_id) } })
            if (existPage?.tenantId && existPage?.tenantId !== tenantId) {
                throw new BadRequestException('exist_in_another_tenant');
            }

            // ? Save page to db
            const payload = this._facebookPageRepository.create({
                id: Number(connect_page.id),
                tenantId,
                user_access_token,
                page_access_token: connect_page.access_token,
                category: connect_page.category,
                category_list: connect_page.category_list,
                name: connect_page.name,
                tasks: connect_page.tasks,
            })

            const page = await this._facebookPageRepository.save(payload);

            return !!page;
        } catch (err) {
            this._loggerService.error(FacebookPageServiceImpl.name, JSON.stringify(err));
            throw new InternalServerErrorException(ResponseDescription.INTERNAL_SERVER_ERROR);
        }
        // ? Update user permission for the page
        // const all_permissions = [
        // 	PERMISSION_ENUM.SELECT,
        // 	PERMISSION_ENUM.INSERT,
        // 	PERMISSION_ENUM.UPDATE,
        // 	PERMISSION_ENUM.DELETE,
        // ];

        // const user_permissions: UserPagePermissionModel[] = all_permissions.map((_per) => {
        // 	return {
        // 		user_id: user_id,
        // 		permission: _per,
        // 		facebook_page_id: connect_page.id,
        // 	};
        // });

        // const permission_result = await this._supabase.from(TABLE_NAME.APP_USER_PERMISSION).upsert(user_permissions, {
        // 	onConflict: 'user_id, permission, facebook_page_id',
        // 	ignoreDuplicates: false,
        // });

        // if (data.sync_message) {
        // 	const sync_mess_result = await this.syncConversation({ page_id }, tenant_id);
        // 	return !result.error && !permission_result.error && sync_mess_result;
        // }

        // return !result.error && !permission_result.error;
    }

    getList(request: GetFacebookPageListRequestDto, userId: string): Promise<PaginationResponseDto<FacebookPageDto>> {
        throw new Error("Method not implemented.");
    }

}