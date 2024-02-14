import { MigrationInterface, QueryRunner } from 'typeorm';

export class PostReason1707898127020 implements MigrationInterface {
  name = 'PostReason1707898127020';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "reasons" ADD "postBudgetPlanActivityId" character varying`,
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
      `ALTER TABLE "reasons" DROP COLUMN "postBudgetPlanActivityId"`,
    );
  }
}
