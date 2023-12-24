import { MigrationInterface, QueryRunner } from 'typeorm';

export class FixBudgetId1703232775467 implements MigrationInterface {
  name = 'FixBudgetId1703232775467';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "post_budget_plan_items" DROP COLUMN "metaData"`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_budget_plan_items" DROP COLUMN "currency"`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_budget_plan_items" DROP COLUMN "uomName"`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_budget_plan_items" ADD "budgetId" uuid NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_budget_plan_items" ADD CONSTRAINT "FK_124490bacba564dae74fb2683e5" FOREIGN KEY ("budgetId") REFERENCES "budget"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "post_budget_plan_items" DROP CONSTRAINT "FK_124490bacba564dae74fb2683e5"`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_budget_plan_items" DROP COLUMN "budgetId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_budget_plan_items" ADD "uomName" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_budget_plan_items" ADD "currency" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_budget_plan_items" ADD "metaData" json NOT NULL`,
    );
  }
}
