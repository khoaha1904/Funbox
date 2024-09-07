import { BadRequestException, Inject, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';
import { AppLoggerService, UtilService } from '@libs/shared/services';
import { TenantDto } from '../dtos/tenant.dto';
import { TenantEntity } from '../entities/tenant.entity';
import { TenantService } from './tenant.service';
import { TenantRepository } from '../repositories/tenant.repository';
import { CreateTenantRequestDto } from '../dtos/requests/create-tenant-request.dto';
import { ResponseDescription } from '@libs/shared/constants/descriptions.constant';
import { PaginationResponseDto } from '@libs/shared/dtos/response.dto';
import { GetTenantListRequestDto } from '../dtos/requests/get-tenant-list-request.dto';

@Injectable()
export class TenantServiceImpl implements TenantService {
    constructor(
        @Inject(TenantRepository) private readonly _tenantRepository: TenantRepository,
        @InjectMapper() private _mapper: Mapper,
        private readonly _loggerService: AppLoggerService,
        private readonly _utilService: UtilService,
    ) {
    }


    async getList(request: GetTenantListRequestDto, userId: string): Promise<PaginationResponseDto<TenantDto>> {
        try {
            const [data, total] = await this._tenantRepository.findAndCount({ where: {} }, request);

            return {
                data: this._mapper.mapArray(data, TenantEntity, TenantDto),
                total: total,
            };

        } catch (err) {
            this._loggerService.error(TenantServiceImpl.name, JSON.stringify(err));
            throw new InternalServerErrorException(ResponseDescription.INTERNAL_SERVER_ERROR);
        }
    }

    async getOneById(id: string): Promise<TenantDto> {
        const result = await this._tenantRepository.findOne({ where: { id } });
        return this._mapper.map(result, TenantEntity, TenantDto);
    }

    async create(request: CreateTenantRequestDto, userId: string): Promise<TenantDto> {
        // const role = await this._rolePermissionService.getRoleByName(ROLE_ENUM.OWNER);

        // if (!role) {
        //     return null;
        // }

        // const data = await this._rolePermissionService.getUserTenantRoleList({ roleId: role.id }, userId);

        // if (data.total >= 3) {
        //     throw new BadRequestException('max_tenant_reached');
        // }

        const payload: Partial<TenantEntity> = {
            name: request?.name,
            code: this._utilService.generateUniqueCode(15)
        };
        const entity = this._tenantRepository.create(payload);

        try {
            const result = await this._tenantRepository.save(entity);

            if (!result?.id) {
                return null;
            }

            return this._mapper.map(result, TenantEntity, TenantDto);
        } catch (err) {
            this._loggerService.error(TenantServiceImpl.name, JSON.stringify(err));
            throw new InternalServerErrorException(ResponseDescription.INTERNAL_SERVER_ERROR);
        }
    }
}
