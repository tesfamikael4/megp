import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateOnSPDModel1707312832133 implements MigrationInterface {
  name = 'UpdateOnSPDModel1707312832133';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "requisitioner_assignments" DROP CONSTRAINT "FK_0b6da07d121a635a05c6ed9608f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "annual_procurement_plan_budget_lines" DROP COLUMN "procurementRequisitionId"`,
    );
    await queryRunner.query(`ALTER TABLE "spd" ADD "document" jsonb`);
    await queryRunner.query(
      `ALTER TABLE "annual_procurement_plan_budget_lines" ALTER COLUMN "currency" SET DEFAULT 'USD'`,
    );
    await queryRunner.query(
      `ALTER TABLE "annual_procurement_plan_items" ADD CONSTRAINT "FK_fc76e6a6023f63b2b43c0a11964" FOREIGN KEY ("annualProcurementPlanActivityId") REFERENCES "annual_procurement_plan_activities"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "annual_procurement_plan_timelines" ADD CONSTRAINT "FK_7334ea68f3d5869176d8cff8552" FOREIGN KEY ("annualProcurementPlanActivityId") REFERENCES "annual_procurement_plan_activities"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "annual_procurement_plan_budget_lines" ADD CONSTRAINT "FK_09f3b42d6a7ee8f18a414d77798" FOREIGN KEY ("annualProcurementPlanActivityId") REFERENCES "annual_procurement_plan_activities"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "annual_procurement_plan_disbursements" ADD CONSTRAINT "FK_2f86ca097e790fa212127e7e141" FOREIGN KEY ("annualProcurementPlanActivityId") REFERENCES "annual_procurement_plan_activities"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "annual_procurement_plan_disbursements" DROP CONSTRAINT "FK_2f86ca097e790fa212127e7e141"`,
    );
    await queryRunner.query(
      `ALTER TABLE "annual_procurement_plan_budget_lines" DROP CONSTRAINT "FK_09f3b42d6a7ee8f18a414d77798"`,
    );
    await queryRunner.query(
      `ALTER TABLE "annual_procurement_plan_timelines" DROP CONSTRAINT "FK_7334ea68f3d5869176d8cff8552"`,
    );
    await queryRunner.query(
      `ALTER TABLE "annual_procurement_plan_items" DROP CONSTRAINT "FK_fc76e6a6023f63b2b43c0a11964"`,
    );
    await queryRunner.query(
      `ALTER TABLE "annual_procurement_plan_budget_lines" ALTER COLUMN "currency" DROP DEFAULT`,
    );
    await queryRunner.query(`ALTER TABLE "spd" DROP COLUMN "document"`);
    await queryRunner.query(
      `ALTER TABLE "annual_procurement_plan_budget_lines" ADD "procurementRequisitionId" uuid NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "requisitioner_assignments" ADD CONSTRAINT "FK_0b6da07d121a635a05c6ed9608f" FOREIGN KEY ("annualProcurementPlanActivityId") REFERENCES "annual_procurement_plan_activities"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
