import { MigrationInterface, QueryRunner } from 'typeorm';

export class SetDefaultForPreference1702295174387
  implements MigrationInterface
{
  name = 'SetDefaultForPreference1702295174387';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "budget" ADD "tag" text NOT NULL`);
    await queryRunner.query(
      `ALTER TABLE "pre_budget_plan_activities" DROP COLUMN "preference"`,
    );
    await queryRunner.query(
      `ALTER TABLE "pre_budget_plan_activities" ADD "preference" text NOT NULL DEFAULT '["Others"]'`,
    );
    await queryRunner.query(
      `ALTER TABLE "budget" ALTER COLUMN "description" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_budget_plan_activities" DROP COLUMN "preference"`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_budget_plan_activities" ADD "preference" text NOT NULL DEFAULT '["Others"]'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "post_budget_plan_activities" DROP COLUMN "preference"`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_budget_plan_activities" ADD "preference" character varying NOT NULL DEFAULT 'Others'`,
    );
    await queryRunner.query(
      `ALTER TABLE "budget" ALTER COLUMN "description" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "pre_budget_plan_activities" DROP COLUMN "preference"`,
    );
    await queryRunner.query(
      `ALTER TABLE "pre_budget_plan_activities" ADD "preference" character varying NOT NULL DEFAULT 'Others'`,
    );
    await queryRunner.query(`ALTER TABLE "budget" DROP COLUMN "tag"`);
  }
}
