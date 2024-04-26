import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUserReference1714130694043 implements MigrationInterface {
  name = 'AddUserReference1714130694043';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "procurement_requisitions" ADD "isUsed" boolean NOT NULL DEFAULT false`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_budget_plan_activities" ADD "userReference" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_budget_plan_activities" ADD CONSTRAINT "UQ_970044ea41c1a6649f15c2ee025" UNIQUE ("userReference")`,
    );
    await queryRunner.query(
      `ALTER TABLE "pre_budget_plan_activities" ADD "userReference" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "pre_budget_plan_activities" ADD CONSTRAINT "UQ_2cbb67b8374b66e90a6b227f0fb" UNIQUE ("userReference")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "pre_budget_plan_activities" DROP CONSTRAINT "UQ_2cbb67b8374b66e90a6b227f0fb"`,
    );
    await queryRunner.query(
      `ALTER TABLE "pre_budget_plan_activities" DROP COLUMN "userReference"`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_budget_plan_activities" DROP CONSTRAINT "UQ_970044ea41c1a6649f15c2ee025"`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_budget_plan_activities" DROP COLUMN "userReference"`,
    );
    await queryRunner.query(
      `ALTER TABLE "procurement_requisitions" DROP COLUMN "isUsed"`,
    );
  }
}
