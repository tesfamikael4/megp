import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChangeEstimatedAmount1703157400228 implements MigrationInterface {
  name = 'ChangeEstimatedAmount1703157400228';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "post_budget_plan_activities" RENAME COLUMN "totalEstimatedAmount" TO "estimatedAmount"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "post_budget_plan_activities" RENAME COLUMN "estimatedAmount" TO "totalEstimatedAmount"`,
    );
  }
}
