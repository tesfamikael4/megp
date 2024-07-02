import { MigrationInterface, QueryRunner } from 'typeorm';

export class BookmarkRegistration1718394012420 implements MigrationInterface {
  name = 'BookmarkRegistration1718394012420';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."notice_bookmarks_objecttype_enum" AS ENUM('TENDER', 'RFX')`,
    );
    await queryRunner.query(
      `CREATE TABLE "notice_bookmarks" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "objectType" "public"."notice_bookmarks_objecttype_enum" NOT NULL, "userId" character varying NOT NULL, "noticeId" uuid NOT NULL, CONSTRAINT "PK_339555638c54418914c9d610a79" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."notice_registrations_objecttype_enum" AS ENUM('TENDER', 'RFX')`,
    );
    await queryRunner.query(
      `CREATE TABLE "notice_registrations" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "objectType" "public"."notice_registrations_objecttype_enum" NOT NULL, "userId" character varying NOT NULL, "noticeId" uuid NOT NULL, CONSTRAINT "PK_e45641ce5ef1a3d47d210c25638" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "tender_notices" DROP COLUMN "objectId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "tender_notices" DROP COLUMN "publishmentDate"`,
    );
    await queryRunner.query(
      `ALTER TABLE "tender_notices" ADD "publishmentDate" TIMESTAMP WITH TIME ZONE NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "tender_notices" DROP COLUMN "closingDate"`,
    );
    await queryRunner.query(
      `ALTER TABLE "tender_notices" ADD "closingDate" TIMESTAMP WITH TIME ZONE NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "notice_bookmarks" ADD CONSTRAINT "FK_72cb8085ef1a6a6da537b8d7fd6" FOREIGN KEY ("noticeId") REFERENCES "tender_notices"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "notice_registrations" ADD CONSTRAINT "FK_7474b3958c9e7c3ef0e537b2972" FOREIGN KEY ("noticeId") REFERENCES "tender_notices"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "notice_registrations" DROP CONSTRAINT "FK_7474b3958c9e7c3ef0e537b2972"`,
    );
    await queryRunner.query(
      `ALTER TABLE "notice_bookmarks" DROP CONSTRAINT "FK_72cb8085ef1a6a6da537b8d7fd6"`,
    );
    await queryRunner.query(
      `ALTER TABLE "tender_notices" DROP COLUMN "closingDate"`,
    );
    await queryRunner.query(
      `ALTER TABLE "tender_notices" ADD "closingDate" TIMESTAMP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "tender_notices" DROP COLUMN "publishmentDate"`,
    );
    await queryRunner.query(
      `ALTER TABLE "tender_notices" ADD "publishmentDate" TIMESTAMP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "tender_notices" ADD "objectId" uuid NOT NULL`,
    );
    await queryRunner.query(`DROP TABLE "notice_registrations"`);
    await queryRunner.query(
      `DROP TYPE "public"."notice_registrations_objecttype_enum"`,
    );
    await queryRunner.query(`DROP TABLE "notice_bookmarks"`);
    await queryRunner.query(
      `DROP TYPE "public"."notice_bookmarks_objecttype_enum"`,
    );
  }
}
