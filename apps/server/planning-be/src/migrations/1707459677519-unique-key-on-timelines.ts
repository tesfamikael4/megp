import { MigrationInterface, QueryRunner } from 'typeorm';

export class UniqueKeyOnTimelines1707459677519 implements MigrationInterface {
  name = 'UniqueKeyOnTimelines1707459677519';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "post_budget_plan_timelines" ADD CONSTRAINT "UQ_4f46ad3893047039813d7bb4abb" UNIQUE ("order", "postBudgetPlanActivityId")`,
    );
    await queryRunner.query(
      `ALTER TABLE "pre_budget_plan_timelines" ADD CONSTRAINT "UQ_8c629da7fe47a59122b8610ba2e" UNIQUE ("order", "preBudgetPlanActivityId")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "pre_budget_plan_timelines" DROP CONSTRAINT "UQ_8c629da7fe47a59122b8610ba2e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_budget_plan_timelines" DROP CONSTRAINT "UQ_4f46ad3893047039813d7bb4abb"`,
    );
  }
}
