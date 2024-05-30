import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddPostBudgetActivityIdForPr1717069404470
  implements MigrationInterface
{
  name = 'AddPostBudgetActivityIdForPr1717069404470';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "procurement_requisitions" DROP COLUMN "isCustom"`,
    );
    await queryRunner.query(
      `ALTER TABLE "procurement_requisition_technical_teams" ADD "isTeamLeader" boolean NOT NULL DEFAULT false`,
    );
    await queryRunner.query(
      `ALTER TABLE "procurement_requisitions" ADD "postBudgetPlanActivityId" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "procurement_requisitions" ADD "postBudgetActivityId" uuid`,
    );
    await queryRunner.query(
      `ALTER TABLE "procurement_requisitions" ALTER COLUMN "userReference" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "procurement_requisitions" DROP CONSTRAINT "UQ_742abcd7d3c08cdc1fd90b3384b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "budget" ADD CONSTRAINT "CHK_de228b5963ead33e4a78a504c5" CHECK ("availableBudget" >= 0 AND "obligatedBudget" >= 0 AND "revisedBudget" >= 0 AND "allocatedBudget" >= 0 AND "availableBudget" <= "revisedBudget" AND "obligatedBudget" <= "revisedBudget" )`,
    );
    await queryRunner.query(
      `ALTER TABLE "procurement_requisitions" ADD CONSTRAINT "FK_b673f0a6b1d41634892347907ca" FOREIGN KEY ("postBudgetActivityId") REFERENCES "post_budget_plan_activities"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "procurement_requisitions" DROP CONSTRAINT "FK_b673f0a6b1d41634892347907ca"`,
    );
    await queryRunner.query(
      `ALTER TABLE "budget" DROP CONSTRAINT "CHK_de228b5963ead33e4a78a504c5"`,
    );
    await queryRunner.query(
      `ALTER TABLE "procurement_requisitions" ADD CONSTRAINT "UQ_742abcd7d3c08cdc1fd90b3384b" UNIQUE ("userReference")`,
    );
    await queryRunner.query(
      `ALTER TABLE "procurement_requisitions" ALTER COLUMN "userReference" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "procurement_requisitions" DROP COLUMN "postBudgetActivityId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "procurement_requisitions" DROP COLUMN "postBudgetPlanActivityId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "procurement_requisition_technical_teams" DROP COLUMN "isTeamLeader"`,
    );
    await queryRunner.query(
      `ALTER TABLE "procurement_requisitions" ADD "isCustom" boolean NOT NULL DEFAULT true`,
    );
  }
}
