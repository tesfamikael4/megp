import { MigrationInterface, QueryRunner } from 'typeorm';

export class CheckNegative1706084300635 implements MigrationInterface {
  name = 'CheckNegative1706084300635';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "budget" ADD CONSTRAINT "CHK_c63a52468905629d681d8f44d2" CHECK ("availableBudget" >= 0 AND "obligatedBudget" >= 0 AND "revisedBudget" >= 0 AND "allocatedBudget" >= 0)`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_budget_plan_items" ADD CONSTRAINT "CHK_1031eabc8f736b621a8fc0c50f" CHECK ("unitPrice" >= 0 AND "quantity" >= 0)`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_budget_plan_timelines" ADD CONSTRAINT "CHK_0e8f039cce33d2fb1bd436a67d" CHECK ("order" >= 0 AND "period" >= 0)`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_budget_plan_disbursements" ADD CONSTRAINT "CHK_9caead8d055e76dccca9d9fa70" CHECK ("amount" >= 0 AND "order" >= 0)`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_budget_plan_activities" ADD CONSTRAINT "CHK_9ddbcf4ae28780bd9c8cb4ae10" CHECK ("estimatedAmount" >= 0 AND "calculatedAmount" >= 0)`,
    );
    await queryRunner.query(
      `ALTER TABLE "pre_budget_plan_items" ADD CONSTRAINT "CHK_55e917dd00e9409c1c2345c977" CHECK ("quantity" >= 0 AND "unitPrice" >= 0)`,
    );
    await queryRunner.query(
      `ALTER TABLE "pre_budget_plan_activities" ADD CONSTRAINT "CHK_636d1d5db6446b40b50eff36a7" CHECK ("estimatedAmount" >= 0 AND "calculatedAmount" >= 0)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "pre_budget_plan_activities" DROP CONSTRAINT "CHK_636d1d5db6446b40b50eff36a7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "pre_budget_plan_items" DROP CONSTRAINT "CHK_55e917dd00e9409c1c2345c977"`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_budget_plan_activities" DROP CONSTRAINT "CHK_9ddbcf4ae28780bd9c8cb4ae10"`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_budget_plan_disbursements" DROP CONSTRAINT "CHK_9caead8d055e76dccca9d9fa70"`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_budget_plan_timelines" DROP CONSTRAINT "CHK_0e8f039cce33d2fb1bd436a67d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_budget_plan_items" DROP CONSTRAINT "CHK_1031eabc8f736b621a8fc0c50f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "budget" DROP CONSTRAINT "CHK_c63a52468905629d681d8f44d2"`,
    );
  }
}
