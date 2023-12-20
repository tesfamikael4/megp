import { MigrationInterface, QueryRunner } from 'typeorm';

export class ModifyPostBudgetDefaults1702285083859
  implements MigrationInterface
{
  name = 'ModifyPostBudgetDefaults1702285083859';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "post_budget_plan_activities" ALTER COLUMN "calculatedAmount" SET DEFAULT '0'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "post_budget_plan_activities" ALTER COLUMN "calculatedAmount" DROP DEFAULT`,
    );
  }
}
