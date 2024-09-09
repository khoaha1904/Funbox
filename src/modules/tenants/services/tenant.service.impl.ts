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
import { UserTenantRepository } from '../repositories/user-tenant.repository';
import { Transactional } from 'typeorm-transactional';
import { RoleEnum } from '../enums/role.enum';
import { UserTenantEntity } from '../entities/user-tenant.entity';
import { UserTenantDto } from '../dtos/user-tenant.dto';

@Injectable()
export class TenantServiceImpl implements TenantService {
    constructor(
        @Inject(TenantRepository) private readonly _tenantRepository: TenantRepository,
        @Inject(UserTenantRepository) private readonly _userTenantRepository: UserTenantRepository,
        @InjectMapper() private _mapper: Mapper,
        private readonly _loggerService: AppLoggerService,
        private readonly _utilService: UtilService,
    ) {
    }

    async getList(request: GetTenantListRequestDto, userId: string): Promise<PaginationResponseDto<UserTenantDto>> {
        try {
            const [data, total] = await this._userTenantRepository.findAndCount({ where: { userId }, relations: { tenant: true } }, request);
            return {
                data: this._mapper.mapArray(data, UserTenantEntity, UserTenantDto),
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

    @Transactional()
    async create(request: CreateTenantRequestDto, userId: string): Promise<TenantDto> {
        const [_, total] = await this._userTenantRepository.findAndCount({ where: { userId } })
        if (total >= 3) {
            throw new BadRequestException('max_tenant_reached');
        }

        try {
            // ? Create tenant
            const payload = this._tenantRepository.create({
                name: request?.name,
                code: this._utilService.generateUniqueCode(15)
            });
            const entity = await this._tenantRepository.save(payload);

            if (!entity?.id) {
                return null;
            }

            // ? Add owner role to this tenant
            const userTenantPayload = this._userTenantRepository.create({
                userId: userId,
                tenantId: entity.id,
                role: RoleEnum.OWNER
            });
            const userTenantEntity = await this._userTenantRepository.save(userTenantPayload);
            if (!userTenantEntity) {
                throw new BadRequestException()
            }

            return this._mapper.map(entity, TenantEntity, TenantDto);
        } catch (err) {
            this._loggerService.error(TenantServiceImpl.name, JSON.stringify(err));
            throw new InternalServerErrorException(ResponseDescription.INTERNAL_SERVER_ERROR);
        }
    }
}
