import { UserTenantDto } from '@apps/modules/tenants/dtos/user-tenant.dto';
import { RoleEnum } from '@apps/modules/tenants/enums/role.enum';
import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

export const ROLE_KEY = 'roles';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) { }

    canActivate(context: ExecutionContext): boolean {
        const requiredRoles = this.reflector.getAllAndOverride(ROLE_KEY, [context.getHandler(), context.getClass()]);
        if (!requiredRoles) {
            return true;
        }

        const { user, headers } = context.switchToHttp().getRequest();

        const tenant_id = headers?.['x-tenant'];

        const userTenant: UserTenantDto = user.userTenant;

        if (tenant_id !== userTenant?.tenantId) {
            throw new UnauthorizedException()
        }

        return requiredRoles.some((role: RoleEnum) => role?.includes(userTenant.role));
    }
}
