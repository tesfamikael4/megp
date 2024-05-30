import { MigrationInterface, QueryRunner } from 'typeorm';

export class IsComplete1717066541454 implements MigrationInterface {
  name = 'IsComplete1717066541454';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "technical_scoring_assessments_details" ADD "isComplete" boolean NOT NULL DEFAULT false`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "technical_scoring_assessments_details" DROP COLUMN "isComplete"`,
    );
  }
}
