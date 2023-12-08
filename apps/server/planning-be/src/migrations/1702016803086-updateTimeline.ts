import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateTimeline1702016803086 implements MigrationInterface {
  name = 'UpdateTimeline1702016803086';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "budget" ADD "description" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "budget" ADD "fundingSource" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "pre_budget_plan_timelines" ALTER COLUMN "activityName" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "pre_budget_plan_timelines" DROP COLUMN "period"`,
    );
    await queryRunner.query(
      `ALTER TABLE "pre_budget_plan_timelines" ADD "period" integer NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "pre_budget_plan_timelines" ALTER COLUMN "status" SET DEFAULT 'draft'`,
    );
    await queryRunner.query(
      `ALTER TABLE "budget" DROP COLUMN "allocatedBudget"`,
    );
    await queryRunner.query(
      `ALTER TABLE "budget" ADD "allocatedBudget" integer NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "budget" DROP COLUMN "plannedValue"`);
    await queryRunner.query(
      `ALTER TABLE "budget" ADD "plannedValue" integer NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "budget" DROP COLUMN "balance"`);
    await queryRunner.query(
      `ALTER TABLE "budget" ADD "balance" integer NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_budget_plan_timelines" ALTER COLUMN "activityName" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_budget_plan_timelines" DROP COLUMN "period"`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_budget_plan_timelines" ADD "period" integer NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_budget_plan_timelines" ALTER COLUMN "status" SET DEFAULT 'draft'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "post_budget_plan_timelines" ALTER COLUMN "status" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_budget_plan_timelines" DROP COLUMN "period"`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_budget_plan_timelines" ADD "period" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_budget_plan_timelines" ALTER COLUMN "activityName" SET NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "budget" DROP COLUMN "balance"`);
    await queryRunner.query(
      `ALTER TABLE "budget" ADD "balance" character varying NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "budget" DROP COLUMN "plannedValue"`);
    await queryRunner.query(
      `ALTER TABLE "budget" ADD "plannedValue" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "budget" DROP COLUMN "allocatedBudget"`,
    );
    await queryRunner.query(
      `ALTER TABLE "budget" ADD "allocatedBudget" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "pre_budget_plan_timelines" ALTER COLUMN "status" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "pre_budget_plan_timelines" DROP COLUMN "period"`,
    );
    await queryRunner.query(
      `ALTER TABLE "pre_budget_plan_timelines" ADD "period" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "pre_budget_plan_timelines" ALTER COLUMN "activityName" SET NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "budget" DROP COLUMN "fundingSource"`);
    await queryRunner.query(`ALTER TABLE "budget" DROP COLUMN "description"`);
  }
}
