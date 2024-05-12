import { MigrationInterface, QueryRunner } from 'typeorm';

export class TechnicalPreliminaryAssessmentDetail1715522806685
  implements MigrationInterface
{
  name = 'TechnicalPreliminaryAssessmentDetail1715522806685';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "technical_preliminary_assessments" DROP CONSTRAINT "FK_6c79345a5c86175beedd3988909"`,
    );
    await queryRunner.query(
      `ALTER TABLE "technical_preliminary_assessments" DROP CONSTRAINT "UQ_10de46b96498367d6b782689de0"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."technical_preliminary_assessment_details_qualified_enum" AS ENUM('NOT_DONE', 'IN_PROGRESS', 'NOT_APPLICABLE', 'NOT_COMPLY', 'COMPLY')`,
    );
    await queryRunner.query(
      `CREATE TABLE "technical_preliminary_assessment_details" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "technicalPreliminaryAssessmentId" uuid NOT NULL, "spdPreliminaryEvaluationId" uuid NOT NULL, "qualified" "public"."technical_preliminary_assessment_details_qualified_enum" NOT NULL DEFAULT 'NOT_DONE', "remark" character varying, CONSTRAINT "UQ_45b2197f6a9cfc8223b1fae2fd1" UNIQUE ("technicalPreliminaryAssessmentId", "spdPreliminaryEvaluationId"), CONSTRAINT "PK_b9042079141d0d29c652ddbf906" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "technical_preliminary_assessments" DROP COLUMN "checked"`,
    );
    await queryRunner.query(
      `ALTER TABLE "technical_preliminary_assessments" DROP COLUMN "spdPreliminaryEvaluationId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "technical_preliminary_assessments" DROP COLUMN "remark"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."technical_preliminary_assessments_qualified_enum" AS ENUM('NOT_DONE', 'IN_PROGRESS', 'NOT_APPLICABLE', 'NOT_COMPLY', 'COMPLY')`,
    );
    await queryRunner.query(
      `ALTER TABLE "technical_preliminary_assessments" ADD "qualified" "public"."technical_preliminary_assessments_qualified_enum" NOT NULL DEFAULT 'NOT_DONE'`,
    );
    await queryRunner.query(
      `ALTER TABLE "technical_preliminary_assessments" ADD CONSTRAINT "UQ_f0c5eedfdadc5412b4f80703020" UNIQUE ("bidRegistrationDetailId", "isTeamAssessment", "evaluatorId")`,
    );
    await queryRunner.query(
      `ALTER TABLE "technical_preliminary_assessment_details" ADD CONSTRAINT "FK_74c9ef57a86737836148803b822" FOREIGN KEY ("technicalPreliminaryAssessmentId") REFERENCES "technical_preliminary_assessments"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "technical_preliminary_assessment_details" ADD CONSTRAINT "FK_8427135ffaf205f1edd505d5215" FOREIGN KEY ("spdPreliminaryEvaluationId") REFERENCES "spd_preliminary_evaluations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "technical_preliminary_assessment_details" DROP CONSTRAINT "FK_8427135ffaf205f1edd505d5215"`,
    );
    await queryRunner.query(
      `ALTER TABLE "technical_preliminary_assessment_details" DROP CONSTRAINT "FK_74c9ef57a86737836148803b822"`,
    );
    await queryRunner.query(
      `ALTER TABLE "technical_preliminary_assessments" DROP CONSTRAINT "UQ_f0c5eedfdadc5412b4f80703020"`,
    );
    await queryRunner.query(
      `ALTER TABLE "technical_preliminary_assessments" DROP COLUMN "qualified"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."technical_preliminary_assessments_qualified_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "technical_preliminary_assessments" ADD "remark" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "technical_preliminary_assessments" ADD "spdPreliminaryEvaluationId" uuid NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "technical_preliminary_assessments" ADD "checked" boolean NOT NULL`,
    );
    await queryRunner.query(
      `DROP TABLE "technical_preliminary_assessment_details"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."technical_preliminary_assessment_details_qualified_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "technical_preliminary_assessments" ADD CONSTRAINT "UQ_10de46b96498367d6b782689de0" UNIQUE ("bidRegistrationDetailId", "spdPreliminaryEvaluationId", "evaluatorId", "isTeamAssessment")`,
    );
    await queryRunner.query(
      `ALTER TABLE "technical_preliminary_assessments" ADD CONSTRAINT "FK_6c79345a5c86175beedd3988909" FOREIGN KEY ("spdPreliminaryEvaluationId") REFERENCES "spd_preliminary_evaluations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
