import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddOrder1702021032978 implements MigrationInterface {
  name = 'AddOrder1702021032978';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "pre_budget_plan_timelines" ADD "order" integer NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_budget_plan_timelines" ADD "order" integer NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "post_budget_plan_timelines" DROP COLUMN "order"`,
    );
    await queryRunner.query(
      `ALTER TABLE "pre_budget_plan_timelines" DROP COLUMN "order"`,
    );
  }
}
