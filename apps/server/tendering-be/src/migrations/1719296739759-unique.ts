import { MigrationInterface, QueryRunner } from 'typeorm';

export class Unique1719296739759 implements MigrationInterface {
  name = 'Unique1719296739759';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "technical_preliminary_assessment_details" ADD CONSTRAINT "UQ_542305ffffa598fd875b3c3f132" UNIQUE ("technicalPreliminaryAssessmentId", "eqcPreliminaryExaminationId")`,
    );
    await queryRunner.query(
      `ALTER TABLE "technical_scoring_assessments_details" ADD CONSTRAINT "UQ_e2cf7fa73033d72749e313d77b8" UNIQUE ("technicalScoringAssessmentId", "eqcTechnicalScoringId")`,
    );
    await queryRunner.query(
      `ALTER TABLE "technical_qualification_assessment_details" ADD CONSTRAINT "UQ_796fce8b09904b7723b899e8e6f" UNIQUE ("technicalQualificationAssessmentId", "eqcQualificationId")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "technical_qualification_assessment_details" DROP CONSTRAINT "UQ_796fce8b09904b7723b899e8e6f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "technical_scoring_assessments_details" DROP CONSTRAINT "UQ_e2cf7fa73033d72749e313d77b8"`,
    );
    await queryRunner.query(
      `ALTER TABLE "technical_preliminary_assessment_details" DROP CONSTRAINT "UQ_542305ffffa598fd875b3c3f132"`,
    );
  }
}
