import { UserTenantDto } from "@apps/modules/tenants/dtos/user-tenant.dto";

export class UserSessionDto {
	id: string;
	email: string;
	phone: string;
	name: string;
	userTenant?: UserTenantDto;
}
