import { MigrationInterface, QueryRunner } from 'typeorm';

export class BudgetIdNullable1706061186803 implements MigrationInterface {
  name = 'BudgetIdNullable1706061186803';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "reasons" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "organizationId" uuid, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "objectId" uuid NOT NULL, "activityId" uuid NOT NULL, "type" character varying NOT NULL, "reason" text NOT NULL, "remark" text NOT NULL, CONSTRAINT "PK_b8104b87e316aacce0c709000a2" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_budget_plan_activities" DROP CONSTRAINT "FK_adb6cdc555dddcf65522c9d0860"`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_budget_plan_activities" ALTER COLUMN "budgetId" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_budget_plan_activities" ADD CONSTRAINT "FK_adb6cdc555dddcf65522c9d0860" FOREIGN KEY ("budgetId") REFERENCES "budget"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "post_budget_plan_activities" DROP CONSTRAINT "FK_adb6cdc555dddcf65522c9d0860"`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_budget_plan_activities" ALTER COLUMN "budgetId" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_budget_plan_activities" ADD CONSTRAINT "FK_adb6cdc555dddcf65522c9d0860" FOREIGN KEY ("budgetId") REFERENCES "budget"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(`DROP TABLE "reasons"`);
  }
}
