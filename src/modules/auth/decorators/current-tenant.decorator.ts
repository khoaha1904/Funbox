import { createParamDecorator, ExecutionContext, ForbiddenException } from '@nestjs/common';

export const CurrentTenantId = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
    try {
        const request = ctx.switchToHttp().getRequest();
        return request.headers['x-tenant']; // Header names are case-insensitive
    } catch {
        throw new ForbiddenException();
    }
});
