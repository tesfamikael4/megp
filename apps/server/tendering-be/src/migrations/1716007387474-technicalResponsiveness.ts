import { MigrationInterface, QueryRunner } from 'typeorm';

export class TechnicalResponsiveness1716007387474
  implements MigrationInterface
{
  name = 'TechnicalResponsiveness1716007387474';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "technical_qualification_assessment_detail" DROP CONSTRAINT "FK_86712bec03da5e29cf537a39db8"`,
    );
    await queryRunner.query(
      `ALTER TABLE "technical_preliminary_assessment_details" DROP CONSTRAINT "FK_8427135ffaf205f1edd505d5215"`,
    );
    await queryRunner.query(
      `ALTER TABLE "technical_qualification_assessment_detail" RENAME COLUMN "spdQualificationId" TO "eqcQualificationId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "technical_preliminary_assessment_details" RENAME COLUMN "spdPreliminaryEvaluationId" TO "eqcPreliminaryExaminationId"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."technical_responsiveness_assessments_qualified_enum" AS ENUM('NOT_DONE', 'IN_PROGRESS', 'NOT_APPLICABLE', 'NOT_COMPLY', 'COMPLY')`,
    );
    await queryRunner.query(
      `CREATE TABLE "technical_responsiveness_assessments" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "bidRegistrationDetailId" uuid NOT NULL, "evaluatorId" uuid NOT NULL, "evaluatorName" character varying NOT NULL, "isTeamAssessment" boolean NOT NULL DEFAULT false, "qualified" "public"."technical_responsiveness_assessments_qualified_enum" NOT NULL DEFAULT 'NOT_DONE', "submit" boolean NOT NULL, "version" integer NOT NULL DEFAULT '1', CONSTRAINT "PK_e1d85ee8f32fad802377ebe2590" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."technical_responsiveness_assessment_detail_qualified_enum" AS ENUM('NOT_DONE', 'IN_PROGRESS', 'NOT_APPLICABLE', 'NOT_COMPLY', 'COMPLY')`,
    );
    await queryRunner.query(
      `CREATE TABLE "technical_responsiveness_assessment_detail" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "organizationId" uuid NOT NULL, "organizationName" character varying NOT NULL, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "technicalResponsivenessAssessmentId" uuid NOT NULL, "spdResponsivenessId" uuid NOT NULL, "qualified" "public"."technical_responsiveness_assessment_detail_qualified_enum" NOT NULL DEFAULT 'NOT_DONE', "remark" character varying, "sorTechnicalRequirementId" uuid, CONSTRAINT "PK_52f12b716d98e3bc5b5e8342e3d" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "technical_responsiveness_assessments" ADD CONSTRAINT "FK_b2a5089c12423aa10b5f14ce8dc" FOREIGN KEY ("bidRegistrationDetailId") REFERENCES "bid_registration_details"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "technical_responsiveness_assessment_detail" ADD CONSTRAINT "FK_682b03c8b81a12fda829ab48926" FOREIGN KEY ("technicalResponsivenessAssessmentId") REFERENCES "technical_responsiveness_assessments"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "technical_responsiveness_assessment_detail" ADD CONSTRAINT "FK_4980f2b2352cdb1cf4743ea5649" FOREIGN KEY ("sorTechnicalRequirementId") REFERENCES "sor_technical_requirements"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "technical_qualification_assessment_detail" ADD CONSTRAINT "FK_72474d19284a1b321904f6a85a3" FOREIGN KEY ("eqcQualificationId") REFERENCES "eqc_qualifications"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "technical_preliminary_assessment_details" ADD CONSTRAINT "FK_4cd4654d6e6459a3ee62f332dd3" FOREIGN KEY ("eqcPreliminaryExaminationId") REFERENCES "eqc_preliminary_examinations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "technical_preliminary_assessment_details" DROP CONSTRAINT "FK_4cd4654d6e6459a3ee62f332dd3"`,
    );
    await queryRunner.query(
      `ALTER TABLE "technical_qualification_assessment_detail" DROP CONSTRAINT "FK_72474d19284a1b321904f6a85a3"`,
    );
    await queryRunner.query(
      `ALTER TABLE "technical_responsiveness_assessment_detail" DROP CONSTRAINT "FK_4980f2b2352cdb1cf4743ea5649"`,
    );
    await queryRunner.query(
      `ALTER TABLE "technical_responsiveness_assessment_detail" DROP CONSTRAINT "FK_682b03c8b81a12fda829ab48926"`,
    );
    await queryRunner.query(
      `ALTER TABLE "technical_responsiveness_assessments" DROP CONSTRAINT "FK_b2a5089c12423aa10b5f14ce8dc"`,
    );
    await queryRunner.query(
      `DROP TABLE "technical_responsiveness_assessment_detail"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."technical_responsiveness_assessment_detail_qualified_enum"`,
    );
    await queryRunner.query(
      `DROP TABLE "technical_responsiveness_assessments"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."technical_responsiveness_assessments_qualified_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "technical_preliminary_assessment_details" RENAME COLUMN "eqcPreliminaryExaminationId" TO "spdPreliminaryEvaluationId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "technical_qualification_assessment_detail" RENAME COLUMN "eqcQualificationId" TO "spdQualificationId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "technical_preliminary_assessment_details" ADD CONSTRAINT "FK_8427135ffaf205f1edd505d5215" FOREIGN KEY ("spdPreliminaryEvaluationId") REFERENCES "spd_preliminary_evaluations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "technical_qualification_assessment_detail" ADD CONSTRAINT "FK_86712bec03da5e29cf537a39db8" FOREIGN KEY ("spdQualificationId") REFERENCES "spd_qualifications"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
