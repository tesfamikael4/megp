import { MigrationInterface, QueryRunner } from 'typeorm';

export class RemoveDonor1703157790692 implements MigrationInterface {
  name = 'RemoveDonor1703157790692';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "post_budget_plan_activities" DROP COLUMN "donor"`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_budget_plan_activities" DROP COLUMN "preference"`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_budget_plan_activities" DROP COLUMN "procurementProcess"`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_budget_plan_activities" ADD "classification" jsonb`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "post_budget_plan_activities" DROP COLUMN "classification"`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_budget_plan_activities" ADD "procurementProcess" character varying NOT NULL DEFAULT 'Online'`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_budget_plan_activities" ADD "preference" jsonb NOT NULL DEFAULT '["Others"]'`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_budget_plan_activities" ADD "donor" json NOT NULL`,
    );
  }
}
