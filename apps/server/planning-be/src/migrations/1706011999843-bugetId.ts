import { MigrationInterface, QueryRunner } from 'typeorm';

export class BugetId1706011999843 implements MigrationInterface {
  name = 'BugetId1706011999843';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "post_budget_plan_activities" ADD "budgetId" uuid NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "budget" ALTER COLUMN "obligatedBudget" SET DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "budget" ALTER COLUMN "availableBudget" SET DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_budget_plan_activities" ADD CONSTRAINT "FK_adb6cdc555dddcf65522c9d0860" FOREIGN KEY ("budgetId") REFERENCES "budget"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "post_budget_plan_activities" DROP CONSTRAINT "FK_adb6cdc555dddcf65522c9d0860"`,
    );
    await queryRunner.query(
      `ALTER TABLE "budget" ALTER COLUMN "availableBudget" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "budget" ALTER COLUMN "obligatedBudget" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_budget_plan_activities" DROP COLUMN "budgetId"`,
    );
  }
}
