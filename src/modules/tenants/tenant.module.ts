import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TerminusModule, TypeOrmHealthIndicator } from '@nestjs/terminus';
import { SharedModule } from '@libs/shared/services';
import { AutomapperModule } from '@automapper/nestjs';
import { classes } from '@automapper/classes';
import { TenantController } from './controllers/tenant.controller';
import { TenantEntity } from './entities/tenant.entity';
import { TenantService } from './services/tenant.service';
import { TenantServiceImpl } from './services/tenant.service.impl';
import { TenantRepository } from './repositories/tenant.repository';
import { TenantRepositoryImpl } from './repositories/tenant.repository.impl';
import { DatabaseModule } from '@apps/databases/database.module';
import { TenantProfile } from './profiles/tenant.profile';
import { UserTenantRepository } from './repositories/user-tenant.repository';
import { UserTenantRepositoryImpl } from './repositories/user-tenant.repository.impl';
import { UserTenantEntity } from './entities/user-tenant.entity';

const services = [{ provide: TenantService, useClass: TenantServiceImpl }];
const providers = [
    { provide: TenantRepository, useClass: TenantRepositoryImpl },
    { provide: UserTenantRepository, useClass: UserTenantRepositoryImpl }
];
const profiles = [TenantProfile];

@Module({
    imports: [
        SharedModule,
        TerminusModule,
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: '.env',
        }),
        DatabaseModule,
        DatabaseModule.forFeature([TenantEntity, UserTenantEntity]),
        AutomapperModule.forRoot({
            strategyInitializer: classes(),
        }),
    ],
    controllers: [TenantController],
    providers: [TypeOrmHealthIndicator, ...providers, ...profiles, ...services],
    exports: [...services],
})
export class TenantModule { }
