import { MigrationInterface, QueryRunner } from 'typeorm';

export class Scoring1716293386446 implements MigrationInterface {
  name = 'Scoring1716293386446';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."technical_scoring_assessment_detail_qualified_enum" AS ENUM('NOT_DONE', 'IN_PROGRESS', 'NOT_APPLICABLE', 'NOT_COMPLY', 'COMPLY')`,
    );
    await queryRunner.query(
      `CREATE TABLE "technical_scoring_assessment_detail" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "organizationId" uuid NOT NULL, "organizationName" character varying NOT NULL, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "technicalScoringAssessmentId" uuid NOT NULL, "eqcTechnicalScoringId" uuid NOT NULL, "qualified" "public"."technical_scoring_assessment_detail_qualified_enum" NOT NULL DEFAULT 'NOT_DONE', "remark" character varying, CONSTRAINT "PK_7b759057b189f0b008286ad32d8" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."technical_scoring_assessments_qualified_enum" AS ENUM('NOT_DONE', 'IN_PROGRESS', 'NOT_APPLICABLE', 'NOT_COMPLY', 'COMPLY')`,
    );
    await queryRunner.query(
      `CREATE TABLE "technical_scoring_assessments" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "bidRegistrationDetailId" uuid NOT NULL, "evaluatorId" uuid NOT NULL, "evaluatorName" character varying NOT NULL, "isTeamAssessment" boolean NOT NULL DEFAULT false, "qualified" "public"."technical_scoring_assessments_qualified_enum" NOT NULL DEFAULT 'NOT_DONE', "submit" boolean NOT NULL, "version" integer NOT NULL DEFAULT '1', CONSTRAINT "PK_605f5f66df18d57bd5f386bffea" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "technical_scoring_assessment_detail" ADD CONSTRAINT "FK_1cc38368014e1973b6144faa5d0" FOREIGN KEY ("technicalScoringAssessmentId") REFERENCES "technical_scoring_assessments"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "technical_scoring_assessment_detail" ADD CONSTRAINT "FK_88397a217e5064319d9c845cf7a" FOREIGN KEY ("eqcTechnicalScoringId") REFERENCES "eqc_technical_scorings"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "technical_scoring_assessments" ADD CONSTRAINT "FK_f30e360af60f01703127cf0b805" FOREIGN KEY ("bidRegistrationDetailId") REFERENCES "bid_registration_details"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "technical_scoring_assessments" DROP CONSTRAINT "FK_f30e360af60f01703127cf0b805"`,
    );
    await queryRunner.query(
      `ALTER TABLE "technical_scoring_assessment_detail" DROP CONSTRAINT "FK_88397a217e5064319d9c845cf7a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "technical_scoring_assessment_detail" DROP CONSTRAINT "FK_1cc38368014e1973b6144faa5d0"`,
    );
    await queryRunner.query(`DROP TABLE "technical_scoring_assessments"`);
    await queryRunner.query(
      `DROP TYPE "public"."technical_scoring_assessments_qualified_enum"`,
    );
    await queryRunner.query(`DROP TABLE "technical_scoring_assessment_detail"`);
    await queryRunner.query(
      `DROP TYPE "public"."technical_scoring_assessment_detail_qualified_enum"`,
    );
  }
}
