import { MigrationInterface, QueryRunner } from "typeorm";

export class InitUserTenantEntity1725737045323 implements MigrationInterface {
    name = 'InitUserTenantEntity1725737045323'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "app_user_tenant" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "is_active" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "user_id" uuid NOT NULL, "tenant_id" uuid NOT NULL, "role" character varying(255) NOT NULL, CONSTRAINT "PK_29ed668eb2c458a129aa6bbd31a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "app_user_tenant" ADD CONSTRAINT "FK_43e336f5da00d0ccbbc0717c887" FOREIGN KEY ("user_id") REFERENCES "app_users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "app_user_tenant" ADD CONSTRAINT "FK_4609a72809a46eadd1a9c88a46f" FOREIGN KEY ("tenant_id") REFERENCES "app_tenants"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "app_user_tenant" DROP CONSTRAINT "FK_4609a72809a46eadd1a9c88a46f"`);
        await queryRunner.query(`ALTER TABLE "app_user_tenant" DROP CONSTRAINT "FK_43e336f5da00d0ccbbc0717c887"`);
        await queryRunner.query(`DROP TABLE "app_user_tenant"`);
    }

}
