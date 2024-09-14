import { BaseController } from '@libs/shared/common/controllers';
import { Body, Controller, Get, Inject, Post, Query, UseGuards } from '@nestjs/common';
import { FacebookPageService } from '../services/facebook-page.service';
import { ConnectFacebookRequestDto } from '../dtos/requests/connect-facebook-page-request.dto';
import { CurrentUser } from '@apps/modules/auth/decorators/current-user.decorator';
import { JWTAuthGuard } from '@apps/modules/auth/guards/jwt-auth.guard';
import { CurrentTenantId } from '@apps/modules/auth/decorators/current-tenant.decorator';
import { RolesGuard } from '@apps/modules/auth/guards/role.guard';
import { Roles } from '@apps/modules/auth/decorators/role.decorator';
import { RoleEnum } from '@apps/modules/tenants/enums/role.enum';
import { UserSessionDto } from '@apps/modules/auth/dtos/user-session.dto';
import { GetFacebookPageListRequestDto } from '../dtos/requests/get-facebook-page-list-request.dto';


@Controller('facebook-pages')
export class FacebookPageController extends BaseController {
    constructor(@Inject(FacebookPageService) private readonly _service: FacebookPageService) {
        super();
    }

    @Get()
    @UseGuards(JWTAuthGuard, RolesGuard)
    @Roles(RoleEnum.OWNER, RoleEnum.MANAGER, RoleEnum.CHAT_OPARATOR)
    async getList(@Query() query: GetFacebookPageListRequestDto, @CurrentTenantId() tenantId: string) {
        return {
            data: await this._service.getList(query, tenantId)
        };
    }

    @Post('connect')
    @UseGuards(JWTAuthGuard, RolesGuard)
    @Roles(RoleEnum.OWNER)
    async connectPage(@Body() body: ConnectFacebookRequestDto, @CurrentUser() user: UserSessionDto, @CurrentTenantId() tenantId: string) {
        return {
            data: await this._service.connectFacebook({
                user_access_token: body.user_access_token,
                page_id: body.page_id,
                sync_message: body.sync_message,
            }, user?.id, tenantId),
        };
    }
}
