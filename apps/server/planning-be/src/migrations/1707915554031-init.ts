import { MigrationInterface, QueryRunner } from 'typeorm';

export class Init1707915554031 implements MigrationInterface {
  name = 'Init1707915554031';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "budget" DROP CONSTRAINT "CHK_c63a52468905629d681d8f44d2"`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_budget_plan_items" DROP COLUMN "specification"`,
    );
    await queryRunner.query(
      `ALTER TABLE "reasons" ADD "postBudgetPlanActivityId" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "budget" ADD CONSTRAINT "CHK_de228b5963ead33e4a78a504c5" CHECK ("availableBudget" >= 0 AND "obligatedBudget" >= 0 AND "revisedBudget" >= 0 AND "allocatedBudget" >= 0 AND "availableBudget" <= "revisedBudget" AND "obligatedBudget" <= "revisedBudget" )`,
    );
    await queryRunner.query(
      `ALTER TABLE "reasons" ADD CONSTRAINT "FK_5c652b7f0f93d02a746a6b01eff" FOREIGN KEY ("preBudgetPlanActivityId") REFERENCES "post_budget_plan_activities"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "reasons" DROP CONSTRAINT "FK_5c652b7f0f93d02a746a6b01eff"`,
    );
    await queryRunner.query(
      `ALTER TABLE "budget" DROP CONSTRAINT "CHK_de228b5963ead33e4a78a504c5"`,
    );
    await queryRunner.query(
      `ALTER TABLE "reasons" DROP COLUMN "postBudgetPlanActivityId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_budget_plan_items" ADD "specification" json`,
    );
    await queryRunner.query(
      `ALTER TABLE "budget" ADD CONSTRAINT "CHK_c63a52468905629d681d8f44d2" CHECK ((("availableBudget" >= 0) AND ("obligatedBudget" >= 0) AND ("revisedBudget" >= 0) AND ("allocatedBudget" >= 0)))`,
    );
  }
}
