import { MigrationInterface, QueryRunner } from 'typeorm';

export class TenderInviteeAdded1720275755693 implements MigrationInterface {
  name = 'TenderInviteeAdded1720275755693';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "tender_notices" RENAME COLUMN "publishmentDate" TO "publishedDate"`,
    );
    await queryRunner.query(
      `CREATE TABLE "tender_procurement_mechanisms" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "tenderId" uuid NOT NULL, "PRProcurementMechanisms" json NOT NULL, "invitationType" character varying, "marketApproach" character varying, "stageType" character varying, "stage" integer, CONSTRAINT "REL_041f45654de9e3e705edc4559c" UNIQUE ("tenderId"), CONSTRAINT "PK_3e42fab3eb78040870e1e60f204" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "saved_notices" DROP COLUMN "objectType"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."saved_notices_objecttype_enum"`,
    );
    await queryRunner.query(`ALTER TABLE "saved_notices" DROP COLUMN "userId"`);
    await queryRunner.query(
      `ALTER TABLE "saved_notices" ADD "bidderId" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "saved_notices" ADD "bidderName" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "tender_procurement_mechanisms" ADD CONSTRAINT "FK_041f45654de9e3e705edc4559c0" FOREIGN KEY ("tenderId") REFERENCES "tender_notices"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "tender_procurement_mechanisms" DROP CONSTRAINT "FK_041f45654de9e3e705edc4559c0"`,
    );
    await queryRunner.query(
      `ALTER TABLE "saved_notices" DROP COLUMN "bidderName"`,
    );
    await queryRunner.query(
      `ALTER TABLE "saved_notices" DROP COLUMN "bidderId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "saved_notices" ADD "userId" character varying NOT NULL`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."saved_notices_objecttype_enum" AS ENUM('TENDER', 'RFX')`,
    );
    await queryRunner.query(
      `ALTER TABLE "saved_notices" ADD "objectType" "public"."saved_notices_objecttype_enum" NOT NULL`,
    );
    await queryRunner.query(`DROP TABLE "tender_procurement_mechanisms"`);
    await queryRunner.query(
      `ALTER TABLE "tender_notices" RENAME COLUMN "publishedDate" TO "publishmentDate"`,
    );
  }
}
