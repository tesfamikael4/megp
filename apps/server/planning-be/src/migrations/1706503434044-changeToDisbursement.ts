import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChangeToDisbursement1706503434044 implements MigrationInterface {
  name = 'ChangeToDisbursement1706503434044';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "post_budget_plan_disbursements" DROP COLUMN "order"`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_budget_plan_disbursements" DROP COLUMN "quarter"`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_budget_plan_disbursements" ADD "quarter1" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_budget_plan_disbursements" ADD "quarter2" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_budget_plan_disbursements" ADD "quarter3" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_budget_plan_disbursements" ADD "quarter4" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "pre_budget_plan_timelines" ADD CONSTRAINT "CHK_0106570cfd16ef2a0a26424475" CHECK ("order" >= 0 AND "period" >= 0)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "pre_budget_plan_timelines" DROP CONSTRAINT "CHK_0106570cfd16ef2a0a26424475"`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_budget_plan_disbursements" DROP COLUMN "quarter4"`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_budget_plan_disbursements" DROP COLUMN "quarter3"`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_budget_plan_disbursements" DROP COLUMN "quarter2"`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_budget_plan_disbursements" DROP COLUMN "quarter1"`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_budget_plan_disbursements" ADD "quarter" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_budget_plan_disbursements" ADD "order" integer NOT NULL`,
    );
  }
}
