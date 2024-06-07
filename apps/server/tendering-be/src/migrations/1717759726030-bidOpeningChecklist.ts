import { MigrationInterface, QueryRunner } from 'typeorm';

export class BidOpeningChecklist1717759726030 implements MigrationInterface {
  name = 'BidOpeningChecklist1717759726030';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."bid_opening_checklist_assessments_qualified_enum" AS ENUM('NOT_DONE', 'IN_PROGRESS', 'NOT_APPLICABLE', 'NOT_COMPLY', 'COMPLY')`,
    );
    await queryRunner.query(
      `CREATE TABLE "bid_opening_checklist_assessments" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "organizationId" uuid NOT NULL, "organizationName" character varying NOT NULL, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "tenderId" uuid NOT NULL, "lotId" uuid NOT NULL, "bidRegistrationDetailId" uuid NOT NULL, "bidderId" uuid NOT NULL, "bidderName" character varying NOT NULL, "openerId" uuid NOT NULL, "openerName" character varying NOT NULL, "isTeamAssessment" boolean NOT NULL DEFAULT false, "qualified" "public"."bid_opening_checklist_assessments_qualified_enum" NOT NULL DEFAULT 'NOT_DONE', "submit" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_741a4d4bb9a8f8fd4209ccbd3cb" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "bid_opening_checklist_assessment_details" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "organizationId" uuid NOT NULL, "organizationName" character varying NOT NULL, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "bidOpeningChecklistAssessmentId" uuid NOT NULL, "spdOpeningChecklistId" uuid NOT NULL, "checked" boolean NOT NULL, "remark" character varying, "complete" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_999d421c2e7e7ac4efa03632660" PRIMARY KEY ("id"))`,
    );
    // await queryRunner.query(
    //   `ALTER TABLE "financial_price_analyses" ADD "bidderName" character varying NOT NULL`,
    // );
    await queryRunner.query(
      `ALTER TABLE "bid_opening_checklist_assessments" ADD CONSTRAINT "FK_098740b5162819c9c065c9a26a9" FOREIGN KEY ("tenderId") REFERENCES "tenders"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "bid_opening_checklist_assessments" ADD CONSTRAINT "FK_a60cf1fcd3f36381911c13a96e7" FOREIGN KEY ("lotId") REFERENCES "lots"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "bid_opening_checklist_assessments" ADD CONSTRAINT "FK_3bc56af6db53b368d3ee83c2863" FOREIGN KEY ("bidRegistrationDetailId") REFERENCES "bid_registration_details"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "bid_opening_checklist_assessment_details" ADD CONSTRAINT "FK_02cc2cf700a834a1f31a1960598" FOREIGN KEY ("bidOpeningChecklistAssessmentId") REFERENCES "bid_opening_checklist_assessments"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "bid_opening_checklist_assessment_details" ADD CONSTRAINT "FK_e691b918c07696a7bd14b3eda57" FOREIGN KEY ("spdOpeningChecklistId") REFERENCES "spd_opening_checklists"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "bid_opening_checklist_assessment_details" DROP CONSTRAINT "FK_e691b918c07696a7bd14b3eda57"`,
    );
    await queryRunner.query(
      `ALTER TABLE "bid_opening_checklist_assessment_details" DROP CONSTRAINT "FK_02cc2cf700a834a1f31a1960598"`,
    );
    await queryRunner.query(
      `ALTER TABLE "bid_opening_checklist_assessments" DROP CONSTRAINT "FK_3bc56af6db53b368d3ee83c2863"`,
    );
    await queryRunner.query(
      `ALTER TABLE "bid_opening_checklist_assessments" DROP CONSTRAINT "FK_a60cf1fcd3f36381911c13a96e7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "bid_opening_checklist_assessments" DROP CONSTRAINT "FK_098740b5162819c9c065c9a26a9"`,
    );
    // await queryRunner.query(
    //   `ALTER TABLE "financial_price_analyses" DROP COLUMN "bidderName"`,
    // );
    await queryRunner.query(
      `DROP TABLE "bid_opening_checklist_assessment_details"`,
    );
    await queryRunner.query(`DROP TABLE "bid_opening_checklist_assessments"`);
    await queryRunner.query(
      `DROP TYPE "public"."bid_opening_checklist_assessments_qualified_enum"`,
    );
  }
}
