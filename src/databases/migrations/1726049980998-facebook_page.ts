import { MigrationInterface, QueryRunner } from "typeorm";

export class FacebookPage1726049980998 implements MigrationInterface {
    name = 'FacebookPage1726049980998'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "facebook_pages" ("is_active" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "id" bigint NOT NULL, "user_access_token" character varying(255), "page_access_token" character varying(255), "name" character varying(255), "category" character varying(255), "category_list" jsonb, "tasks" text, "tenant_id" uuid, CONSTRAINT "PK_496674684a6f17fd3aee100be28" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "facebook_pages" ADD CONSTRAINT "FK_7a44a0161958ffa03114cfba2b1" FOREIGN KEY ("tenant_id") REFERENCES "app_tenants"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "facebook_pages" DROP CONSTRAINT "FK_7a44a0161958ffa03114cfba2b1"`);
        await queryRunner.query(`DROP TABLE "facebook_pages"`);
    }

}
