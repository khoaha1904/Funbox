import {
    Body,
    Controller,
    Get,
    Inject,
    Post,
    Query,
    UseGuards,
} from '@nestjs/common';
import { UserDto } from '../../users/dtos/user.dto';
import { TenantService } from '../services/tenant.service';
import { BaseController } from '@libs/shared/common/controllers';
import { JWTAuthGuard } from '@apps/modules/auth/guards/jwt-auth.guard';
import { CurrentUser } from '@apps/modules/auth/decorators/current-user.decorator';
import { ResponseDescription } from '@libs/shared/constants/descriptions.constant';
import { CreateTenantRequestDto } from '../dtos/requests/create-tenant-request.dto';
import { GetTenantListRequestDto } from '../dtos/requests/get-tenant-list-request.dto';
import { UserSessionDto } from '@apps/modules/auth/dtos/user-session.dto';

@Controller('tenants')
export class TenantController extends BaseController {
    constructor(
        @Inject(TenantService) private readonly _tenantService: TenantService
    ) {
        super();
    }

    @Get()
    @UseGuards(JWTAuthGuard)
    async getList(@Query() request: GetTenantListRequestDto, @CurrentUser() user: UserSessionDto) {
        return {
            data: await this._tenantService.getList(request, user.id),
            message: ResponseDescription.OK,
        };
    }

    @Post()
    @UseGuards(JWTAuthGuard)
    async createTenant(@Body() request: CreateTenantRequestDto, @CurrentUser() user: UserSessionDto) {
        return {
            data: await this._tenantService.create(request, user.id),
            message: ResponseDescription.CREATED,
        };
    }
}
