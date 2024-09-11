import { BaseController } from '@libs/shared/common/controllers';
import { Body, Controller, Inject, Post, UseGuards } from '@nestjs/common';
import { FacebookPageService } from '../services/facebook-page.service';
import { ConnectFacebookRequestDto } from '../dtos/requests/connect-facebook-page-request.dto';
import { CurrentUser } from '@apps/modules/auth/decorators/current-user.decorator';
import { UserDto } from '@apps/modules/users/dtos/user.dto';
import { JWTAuthGuard } from '@apps/modules/auth/guards/jwt-auth.guard';
import { TenantGuard } from '@apps/modules/auth/guards/tenant.guard';
import { CurrentTenantId } from '@apps/modules/auth/decorators/current-tenant.decorator';
import { RolesGuard } from '@apps/modules/auth/guards/role.guard';
import { Roles } from '@apps/modules/auth/decorators/role.decorator';
import { RoleEnum } from '@apps/modules/tenants/enums/role.enum';
import { UserSessionDto } from '@apps/modules/auth/dtos/user-session.dto';


@Controller('facebook-page')
export class FacebookPageController extends BaseController {
    constructor(@Inject(FacebookPageService) private readonly _service: FacebookPageService) {
        super();
    }

    @Post('connect')
    @UseGuards(JWTAuthGuard, TenantGuard, RolesGuard)
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
