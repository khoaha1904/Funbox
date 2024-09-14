import { CanActivate, ExecutionContext, Inject, Injectable } from '@nestjs/common';
import { AuthService } from '../services/auth.service';

@Injectable()
export class FacebookPageGuard implements CanActivate {
    constructor(@Inject(AuthService) private readonly _authService: AuthService) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const { params, route, headers } = context.switchToHttp().getRequest();

        const tenant_id = headers?.['x-tenant'];

        const path: string = route.path;
        const page_key = path.split('/')[1].replace(/:/g, '');
        const result = await this._authService.verifyFacebookPage({ pageId: params?.[page_key], tenantId: tenant_id })
        return result
    }
}
