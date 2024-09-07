import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitDb1725670397806 implements MigrationInterface {
    name = 'InitDb1725670397806';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE "app_users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "is_active" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "name" character varying(254), "email" character varying(254) NOT NULL, "password" character varying(255) NOT NULL, "verify" boolean NOT NULL DEFAULT false, CONSTRAINT "UQ_14241fb016a330600a7e0efae93" UNIQUE ("email"), CONSTRAINT "PK_9b97e4fbff9c2f3918fda27f999" PRIMARY KEY ("id"))`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "app_users"`);
    }
}
