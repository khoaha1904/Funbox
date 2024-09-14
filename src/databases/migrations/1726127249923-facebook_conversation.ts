import { MigrationInterface, QueryRunner } from "typeorm";

export class FacebookConversation1726127249923 implements MigrationInterface {
    name = 'FacebookConversation1726127249923'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "facebook_conversation_messages" ("is_active" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "id" character varying(255) NOT NULL, "message" text, "is_echo" boolean DEFAULT true, "sending_time" TIMESTAMP WITH TIME ZONE, "facebook_conversation_id" character varying, "attachments" jsonb, CONSTRAINT "PK_ce756c701e7b727734e30c6d4b8" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "facebook_conversation_audiences" ("is_active" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "id" bigint NOT NULL, "name" character varying(255), "email" character varying(255), "facebook_conversations_id" character varying(255), CONSTRAINT "PK_28b90cf9b7a8c57b3c03a32fbe4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "facebook_conversations" ("is_active" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "id" character varying(255) NOT NULL, "facebook_page_id" bigint NOT NULL, "facebook_conversation_audience_id" bigint NOT NULL, "last_message" character varying(255), "last_message_time" TIMESTAMP WITH TIME ZONE, "last_message_attachment" boolean, "is_echo" boolean, CONSTRAINT "PK_b43cd5ef5b895e1d36d3780f6c1" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "facebook_conversation_messages" ADD CONSTRAINT "FK_2b7577169867119f8f52159019e" FOREIGN KEY ("facebook_conversation_id") REFERENCES "facebook_conversations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "facebook_conversation_audiences" ADD CONSTRAINT "FK_648339e97c001fc037bcd7f9192" FOREIGN KEY ("facebook_conversations_id") REFERENCES "facebook_conversations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "facebook_conversations" ADD CONSTRAINT "FK_b174089e196014a9641b366828b" FOREIGN KEY ("facebook_page_id") REFERENCES "facebook_pages"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "facebook_conversations" ADD CONSTRAINT "FK_08e5939638cf9d19b653b1e7061" FOREIGN KEY ("facebook_conversation_audience_id") REFERENCES "facebook_conversation_audiences"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "facebook_conversations" DROP CONSTRAINT "FK_08e5939638cf9d19b653b1e7061"`);
        await queryRunner.query(`ALTER TABLE "facebook_conversations" DROP CONSTRAINT "FK_b174089e196014a9641b366828b"`);
        await queryRunner.query(`ALTER TABLE "facebook_conversation_audiences" DROP CONSTRAINT "FK_648339e97c001fc037bcd7f9192"`);
        await queryRunner.query(`ALTER TABLE "facebook_conversation_messages" DROP CONSTRAINT "FK_2b7577169867119f8f52159019e"`);
        await queryRunner.query(`DROP TABLE "facebook_conversations"`);
        await queryRunner.query(`DROP TABLE "facebook_conversation_audiences"`);
        await queryRunner.query(`DROP TABLE "facebook_conversation_messages"`);
    }

}
