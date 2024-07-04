import { MigrationInterface, QueryRunner } from 'typeorm';

export class SavedNotices1720099094431 implements MigrationInterface {
  name = 'SavedNotices1720099094431';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."saved_notices_objecttype_enum" AS ENUM('TENDER', 'RFX')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."saved_notices_savetype_enum" AS ENUM('BOOKMARKED', 'REGISTERED', 'INVITATION')`,
    );
    await queryRunner.query(
      `CREATE TABLE "saved_notices" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "objectType" "public"."saved_notices_objecttype_enum" NOT NULL, "saveType" "public"."saved_notices_savetype_enum" NOT NULL, "userId" character varying NOT NULL, "noticeId" uuid NOT NULL, CONSTRAINT "PK_e103705f20c220f3ffa4dd0aacf" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "tender_notices" ADD "isOpen" boolean NOT NULL DEFAULT true`,
    );
    await queryRunner.query(
      `ALTER TABLE "saved_notices" ADD CONSTRAINT "FK_3b5a7110d2f3a2daa56132bbafd" FOREIGN KEY ("noticeId") REFERENCES "tender_notices"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "saved_notices" DROP CONSTRAINT "FK_3b5a7110d2f3a2daa56132bbafd"`,
    );
    await queryRunner.query(
      `ALTER TABLE "tender_notices" DROP COLUMN "isOpen"`,
    );
    await queryRunner.query(`DROP TABLE "saved_notices"`);
    await queryRunner.query(`DROP TYPE "public"."saved_notices_savetype_enum"`);
    await queryRunner.query(
      `DROP TYPE "public"."saved_notices_objecttype_enum"`,
    );
  }
}
