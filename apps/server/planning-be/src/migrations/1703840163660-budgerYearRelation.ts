import { MigrationInterface, QueryRunner } from 'typeorm';

export class BudgerYearRelation1703840163660 implements MigrationInterface {
  name = 'BudgerYearRelation1703840163660';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "item_budget_line" DROP COLUMN "activityCoAtagId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "activity_budget_lines" ADD "budgetCode" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "pre_budget_plan_activities" ADD CONSTRAINT "UQ_61fabba5759b9ea169407a38a2d" UNIQUE ("procurementReference")`,
    );
    await queryRunner.query(
      `ALTER TABLE "pre_budget_plan_activities" DROP COLUMN "estimatedAmount"`,
    );
    await queryRunner.query(
      `ALTER TABLE "pre_budget_plan_activities" ADD "estimatedAmount" bigint NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "pre_budget_plan_activities" DROP COLUMN "calculatedAmount"`,
    );
    await queryRunner.query(
      `ALTER TABLE "pre_budget_plan_activities" ADD "calculatedAmount" bigint NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "item_budget_line" DROP CONSTRAINT "FK_3be6aa33082620f9ffae4fd6098"`,
    );
    await queryRunner.query(
      `ALTER TABLE "item_budget_line" ALTER COLUMN "activityBudgetLineId" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "apps" DROP CONSTRAINT "FK_d855a79a1fd5aff929051e04b6a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "apps" DROP CONSTRAINT "UQ_d855a79a1fd5aff929051e04b6a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_budget_plan_activities" ADD CONSTRAINT "UQ_ad1143400a9a09b9b8d52985f1f" UNIQUE ("procurementReference")`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_budget_plan_activities" DROP COLUMN "estimatedAmount"`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_budget_plan_activities" ADD "estimatedAmount" bigint NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_budget_plan_activities" DROP COLUMN "calculatedAmount"`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_budget_plan_activities" ADD "calculatedAmount" bigint NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "item_budget_line" ADD CONSTRAINT "FK_3be6aa33082620f9ffae4fd6098" FOREIGN KEY ("activityBudgetLineId") REFERENCES "activity_budget_lines"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "apps" ADD CONSTRAINT "FK_d855a79a1fd5aff929051e04b6a" FOREIGN KEY ("budgetYearId") REFERENCES "budget_years"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "apps" DROP CONSTRAINT "FK_d855a79a1fd5aff929051e04b6a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "item_budget_line" DROP CONSTRAINT "FK_3be6aa33082620f9ffae4fd6098"`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_budget_plan_activities" DROP COLUMN "calculatedAmount"`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_budget_plan_activities" ADD "calculatedAmount" integer NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_budget_plan_activities" DROP COLUMN "estimatedAmount"`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_budget_plan_activities" ADD "estimatedAmount" integer NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_budget_plan_activities" DROP CONSTRAINT "UQ_ad1143400a9a09b9b8d52985f1f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "apps" ADD CONSTRAINT "UQ_d855a79a1fd5aff929051e04b6a" UNIQUE ("budgetYearId")`,
    );
    await queryRunner.query(
      `ALTER TABLE "apps" ADD CONSTRAINT "FK_d855a79a1fd5aff929051e04b6a" FOREIGN KEY ("budgetYearId") REFERENCES "budget_years"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "item_budget_line" ALTER COLUMN "activityBudgetLineId" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "item_budget_line" ADD CONSTRAINT "FK_3be6aa33082620f9ffae4fd6098" FOREIGN KEY ("activityBudgetLineId") REFERENCES "activity_budget_lines"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "pre_budget_plan_activities" DROP COLUMN "calculatedAmount"`,
    );
    await queryRunner.query(
      `ALTER TABLE "pre_budget_plan_activities" ADD "calculatedAmount" integer NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "pre_budget_plan_activities" DROP COLUMN "estimatedAmount"`,
    );
    await queryRunner.query(
      `ALTER TABLE "pre_budget_plan_activities" ADD "estimatedAmount" integer NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "pre_budget_plan_activities" DROP CONSTRAINT "UQ_61fabba5759b9ea169407a38a2d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "activity_budget_lines" DROP COLUMN "budgetCode"`,
    );
    await queryRunner.query(
      `ALTER TABLE "item_budget_line" ADD "activityCoAtagId" character varying NOT NULL`,
    );
  }
}
