import { PaginationResponseDto } from "@libs/shared/dtos/response.dto";
import { CreateTenantRequestDto } from "../dtos/requests/create-tenant-request.dto";
import { GetTenantListRequestDto } from "../dtos/requests/get-tenant-list-request.dto";
import { TenantDto } from "../dtos/tenant.dto";
import { UserTenantDto } from "../dtos/user-tenant.dto";


export const TenantService = Symbol.for('TenantService');
export type TenantService = {
    getOneById(id: string): Promise<TenantDto>;
    getList(request: GetTenantListRequestDto, userId: string): Promise<PaginationResponseDto<UserTenantDto>>
    create(request: CreateTenantRequestDto, userId: string): Promise<TenantDto>;
};
