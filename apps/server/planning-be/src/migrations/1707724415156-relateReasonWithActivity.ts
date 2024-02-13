import { MigrationInterface, QueryRunner } from 'typeorm';

export class RelateReasonWithActivity1707724415156
  implements MigrationInterface
{
  name = 'RelateReasonWithActivity1707724415156';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "reasons" RENAME COLUMN "activityId" TO "preBudgetPlanActivityId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "reasons" ALTER COLUMN "preBudgetPlanActivityId" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "budget_years" ADD CONSTRAINT "CHK_f1c91a09b5ae530e5d8657c05a" CHECK ("startDate" < "endDate")`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_budget_plan_timelines" ADD CONSTRAINT "UQ_4f46ad3893047039813d7bb4abb" UNIQUE ("order", "postBudgetPlanActivityId")`,
    );
    await queryRunner.query(
      `ALTER TABLE "pre_budget_plan_timelines" ADD CONSTRAINT "UQ_8c629da7fe47a59122b8610ba2e" UNIQUE ("order", "preBudgetPlanActivityId")`,
    );
    await queryRunner.query(
      `ALTER TABLE "reasons" ADD CONSTRAINT "FK_5c652b7f0f93d02a746a6b01eff" FOREIGN KEY ("preBudgetPlanActivityId") REFERENCES "pre_budget_plan_activities"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "reasons" DROP CONSTRAINT "FK_5c652b7f0f93d02a746a6b01eff"`,
    );
    await queryRunner.query(
      `ALTER TABLE "pre_budget_plan_timelines" DROP CONSTRAINT "UQ_8c629da7fe47a59122b8610ba2e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_budget_plan_timelines" DROP CONSTRAINT "UQ_4f46ad3893047039813d7bb4abb"`,
    );
    await queryRunner.query(
      `ALTER TABLE "budget_years" DROP CONSTRAINT "CHK_f1c91a09b5ae530e5d8657c05a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "reasons" ALTER COLUMN "preBudgetPlanActivityId" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "reasons" RENAME COLUMN "preBudgetPlanActivityId" TO "activityId"`,
    );
  }
}
