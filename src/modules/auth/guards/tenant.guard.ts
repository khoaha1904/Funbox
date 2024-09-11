import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

export const TENANT_KEY = 'tenants';

@Injectable()
export class TenantGuard implements CanActivate {
    constructor(private reflector: Reflector) { }

    canActivate(context: ExecutionContext): boolean {
        try {
            const { user, headers } = context.switchToHttp().getRequest();

            const tenant_id = headers?.['x-tenant'];

            // const userTenant = user['tenant_id'];

            if (!tenant_id! || tenant_id.trim() == '') {
                throw new UnauthorizedException();
            }
            return true;
        } catch (e) {
            throw new UnauthorizedException();
        }
    }
}
