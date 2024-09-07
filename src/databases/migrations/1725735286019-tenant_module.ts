import { MigrationInterface, QueryRunner } from "typeorm";

export class TenantModule1725735286019 implements MigrationInterface {
    name = 'TenantModule1725735286019'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "app_tenants" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "is_active" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "name" character varying(255) NOT NULL, "code" character varying(255) NOT NULL, CONSTRAINT "PK_e5bdca0947418078b0583721b2a" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "app_tenants"`);
    }

}
