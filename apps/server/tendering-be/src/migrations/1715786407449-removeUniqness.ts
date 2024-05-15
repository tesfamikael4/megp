import { MigrationInterface, QueryRunner } from 'typeorm';

export class RemoveUniqness1715786407449 implements MigrationInterface {
  name = 'RemoveUniqness1715786407449';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "technical_preliminary_assessment_details" DROP CONSTRAINT "UQ_45b2197f6a9cfc8223b1fae2fd1"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "technical_preliminary_assessment_details" ADD CONSTRAINT "UQ_45b2197f6a9cfc8223b1fae2fd1" UNIQUE ("technicalPreliminaryAssessmentId", "spdPreliminaryEvaluationId")`,
    );
  }
}
