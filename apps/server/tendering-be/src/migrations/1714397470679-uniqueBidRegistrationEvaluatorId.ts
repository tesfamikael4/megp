import { MigrationInterface, QueryRunner } from 'typeorm';

export class UniqueBidRegistrationEvaluatorId1714397470679
  implements MigrationInterface
{
  name = 'UniqueBidRegistrationEvaluatorId1714397470679';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "technical_preliminary_assessments" DROP CONSTRAINT "UQ_a29cb94936f7306724c953436fd"`,
    );
    await queryRunner.query(
      `ALTER TABLE "technical_preliminary_assessments" ADD CONSTRAINT "UQ_10de46b96498367d6b782689de0" UNIQUE ("bidRegistrationDetailId", "spdPreliminaryEvaluationId", "isTeamAssessment", "evaluatorId")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "technical_preliminary_assessments" DROP CONSTRAINT "UQ_10de46b96498367d6b782689de0"`,
    );
    await queryRunner.query(
      `ALTER TABLE "technical_preliminary_assessments" ADD CONSTRAINT "UQ_a29cb94936f7306724c953436fd" UNIQUE ("bidRegistrationDetailId", "spdPreliminaryEvaluationId")`,
    );
  }
}
