import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChangeToEnumPrStatus1709795781101 implements MigrationInterface {
  name = 'ChangeToEnumPrStatus1709795781101';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "procurement_requisitions" ADD "postBudgetPlanId" uuid`,
    );
    await queryRunner.query(
      `ALTER TABLE "procurement_requisitions" DROP COLUMN "status"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."procurement_requisitions_status_enum" AS ENUM('DRAFT', 'SUBMITTED', 'APPROVED', 'ADJUSTED', 'REJECTED')`,
    );
    await queryRunner.query(
      `ALTER TABLE "procurement_requisitions" ADD "status" "public"."procurement_requisitions_status_enum" NOT NULL DEFAULT 'DRAFT'`,
    );
    await queryRunner.query(
      `ALTER TABLE "procurement_requisitions" ADD CONSTRAINT "FK_2fef51181a2a512503ed7b57ff8" FOREIGN KEY ("postBudgetPlanId") REFERENCES "post_budget_plans"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "procurement_requisitions" DROP CONSTRAINT "FK_2fef51181a2a512503ed7b57ff8"`,
    );
    await queryRunner.query(
      `ALTER TABLE "procurement_requisitions" DROP COLUMN "status"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."procurement_requisitions_status_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "procurement_requisitions" ADD "status" character varying NOT NULL DEFAULT 'Draft'`,
    );
    await queryRunner.query(
      `ALTER TABLE "procurement_requisitions" DROP COLUMN "postBudgetPlanId"`,
    );
  }
}
