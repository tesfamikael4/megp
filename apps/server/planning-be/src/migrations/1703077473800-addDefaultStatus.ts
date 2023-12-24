import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddDefaultStatus1703077473800 implements MigrationInterface {
  name = 'AddDefaultStatus1703077473800';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "post_budget_plan_activities" DROP COLUMN "multiYearBudget"`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_budget_plan_activities" DROP COLUMN "fundingSource"`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_budget_plan_activities" DROP COLUMN "procurementMethod"`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_budget_plan_activities" DROP COLUMN "procurementType"`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_budget_plan_activities" DROP COLUMN "procurementStatus"`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_budget_plan_activities" ADD "status" character varying NOT NULL DEFAULT 'Draft'`,
    );
    await queryRunner.query(
      `ALTER TABLE "pre_budget_plan_activities" ALTER COLUMN "status" SET DEFAULT 'Draft'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "pre_budget_plan_activities" ALTER COLUMN "status" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_budget_plan_activities" DROP COLUMN "status"`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_budget_plan_activities" ADD "procurementStatus" character varying NOT NULL DEFAULT 'Draft'`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_budget_plan_activities" ADD "procurementType" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_budget_plan_activities" ADD "procurementMethod" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_budget_plan_activities" ADD "fundingSource" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_budget_plan_activities" ADD "multiYearBudget" json NOT NULL`,
    );
  }
}
