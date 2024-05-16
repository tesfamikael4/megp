import { MigrationInterface, QueryRunner } from 'typeorm';

export class Qualification1715843980783 implements MigrationInterface {
  name = 'Qualification1715843980783';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "tender_milestones" DROP CONSTRAINT "UQ_7d45b007cb50e243f8467f54a5f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "technical_preliminary_assessment_details" DROP CONSTRAINT "UQ_45b2197f6a9cfc8223b1fae2fd1"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."technical_qualification_assessments_qualified_enum" AS ENUM('NOT_DONE', 'IN_PROGRESS', 'NOT_APPLICABLE', 'NOT_COMPLY', 'COMPLY')`,
    );
    await queryRunner.query(
      `CREATE TABLE "technical_qualification_assessments" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "bidRegistrationDetailId" uuid NOT NULL, "evaluatorId" uuid NOT NULL, "evaluatorName" character varying NOT NULL, "isTeamAssessment" boolean NOT NULL DEFAULT false, "qualified" "public"."technical_qualification_assessments_qualified_enum" NOT NULL DEFAULT 'NOT_DONE', "submit" boolean NOT NULL, "version" integer NOT NULL DEFAULT '1', CONSTRAINT "PK_150e11a9e6fb9616e0ea7aeb0c1" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."technical_qualification_assessment_detail_qualified_enum" AS ENUM('NOT_DONE', 'IN_PROGRESS', 'NOT_APPLICABLE', 'NOT_COMPLY', 'COMPLY')`,
    );
    await queryRunner.query(
      `CREATE TABLE "technical_qualification_assessment_detail" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "organizationId" uuid NOT NULL, "organizationName" character varying NOT NULL, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "technicalQualificationAssessmentId" uuid NOT NULL, "spdQualificationId" uuid NOT NULL, "qualified" "public"."technical_qualification_assessment_detail_qualified_enum" NOT NULL DEFAULT 'NOT_DONE', "remark" character varying, CONSTRAINT "PK_2d82b8657a27632fbe0c0272d90" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "bid_opening_checklists" ADD "bidRegistrationDetailId" uuid NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "bid_opening_checklists" DROP COLUMN "bidderName"`,
    );
    await queryRunner.query(
      `ALTER TABLE "bid_opening_checklists" ADD "bidderName" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "tender_milestones" ADD CONSTRAINT "UQ_dee4d72868fb9237de5ee8cfc86" UNIQUE ("lotId", "milestoneNum", "isCurrent")`,
    );
    await queryRunner.query(
      `ALTER TABLE "bid_opening_checklists" ADD CONSTRAINT "FK_7323200c8e343ceec41b03f326c" FOREIGN KEY ("bidRegistrationDetailId") REFERENCES "bid_registration_details"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "technical_qualification_assessments" ADD CONSTRAINT "FK_8a7460645ba5245edc7bbbab4f9" FOREIGN KEY ("bidRegistrationDetailId") REFERENCES "bid_registration_details"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "technical_qualification_assessment_detail" ADD CONSTRAINT "FK_90853706993b68593dbb0b8633e" FOREIGN KEY ("technicalQualificationAssessmentId") REFERENCES "technical_qualification_assessments"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "technical_qualification_assessment_detail" ADD CONSTRAINT "FK_86712bec03da5e29cf537a39db8" FOREIGN KEY ("spdQualificationId") REFERENCES "spd_qualifications"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "technical_qualification_assessment_detail" DROP CONSTRAINT "FK_86712bec03da5e29cf537a39db8"`,
    );
    await queryRunner.query(
      `ALTER TABLE "technical_qualification_assessment_detail" DROP CONSTRAINT "FK_90853706993b68593dbb0b8633e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "technical_qualification_assessments" DROP CONSTRAINT "FK_8a7460645ba5245edc7bbbab4f9"`,
    );
    await queryRunner.query(
      `ALTER TABLE "bid_opening_checklists" DROP CONSTRAINT "FK_7323200c8e343ceec41b03f326c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "tender_milestones" DROP CONSTRAINT "UQ_dee4d72868fb9237de5ee8cfc86"`,
    );
    await queryRunner.query(
      `ALTER TABLE "bid_opening_checklists" DROP COLUMN "bidderName"`,
    );
    await queryRunner.query(
      `ALTER TABLE "bid_opening_checklists" ADD "bidderName" uuid NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "bid_opening_checklists" DROP COLUMN "bidRegistrationDetailId"`,
    );
    await queryRunner.query(
      `DROP TABLE "technical_qualification_assessment_detail"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."technical_qualification_assessment_detail_qualified_enum"`,
    );
    await queryRunner.query(`DROP TABLE "technical_qualification_assessments"`);
    await queryRunner.query(
      `DROP TYPE "public"."technical_qualification_assessments_qualified_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "technical_preliminary_assessment_details" ADD CONSTRAINT "UQ_45b2197f6a9cfc8223b1fae2fd1" UNIQUE ("technicalPreliminaryAssessmentId", "spdPreliminaryEvaluationId")`,
    );
    await queryRunner.query(
      `ALTER TABLE "tender_milestones" ADD CONSTRAINT "UQ_7d45b007cb50e243f8467f54a5f" UNIQUE ("lotId", "isCurrent")`,
    );
  }
}
