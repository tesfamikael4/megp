import { MigrationInterface, QueryRunner } from 'typeorm';

export class CheckBudget1707486473691 implements MigrationInterface {
  name = 'CheckBudget1707486473691';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "budget_years" DROP CONSTRAINT "CHK_f1c91a09b5ae530e5d8657c05a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "budget" DROP CONSTRAINT "CHK_c63a52468905629d681d8f44d2"`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_budget_plan_timelines" DROP CONSTRAINT "UQ_4f46ad3893047039813d7bb4abb"`,
    );
    await queryRunner.query(
      `ALTER TABLE "pre_budget_plan_timelines" DROP CONSTRAINT "UQ_8c629da7fe47a59122b8610ba2e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "budget" ADD CONSTRAINT "CHK_de228b5963ead33e4a78a504c5" CHECK ("availableBudget" >= 0 AND "obligatedBudget" >= 0 AND "revisedBudget" >= 0 AND "allocatedBudget" >= 0 AND "availableBudget" <= "revisedBudget" AND "obligatedBudget" <= "revisedBudget" )`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "budget" DROP CONSTRAINT "CHK_de228b5963ead33e4a78a504c5"`,
    );
    await queryRunner.query(
      `ALTER TABLE "pre_budget_plan_timelines" ADD CONSTRAINT "UQ_8c629da7fe47a59122b8610ba2e" UNIQUE ("preBudgetPlanActivityId", "order")`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_budget_plan_timelines" ADD CONSTRAINT "UQ_4f46ad3893047039813d7bb4abb" UNIQUE ("postBudgetPlanActivityId", "order")`,
    );
    await queryRunner.query(
      `ALTER TABLE "budget" ADD CONSTRAINT "CHK_c63a52468905629d681d8f44d2" CHECK ((("availableBudget" >= 0) AND ("obligatedBudget" >= 0) AND ("revisedBudget" >= 0) AND ("allocatedBudget" >= 0)))`,
    );
    await queryRunner.query(
      `ALTER TABLE "budget_years" ADD CONSTRAINT "CHK_f1c91a09b5ae530e5d8657c05a" CHECK (("startDate" < "endDate"))`,
    );
  }
}
