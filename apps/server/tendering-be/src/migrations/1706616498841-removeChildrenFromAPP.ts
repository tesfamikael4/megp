import { MigrationInterface, QueryRunner } from 'typeorm';

export class RemoveChildrenFromAPP1706616498841 implements MigrationInterface {
  name = 'RemoveChildrenFromAPP1706616498841';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "requisitioner_assignments" ADD CONSTRAINT "FK_0b6da07d121a635a05c6ed9609f" FOREIGN KEY ("annualProcurementPlanActivityId") REFERENCES "annual_procurement_plan_activities"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "requisitioner_assignments" DROP CONSTRAINT "FK_0b6da07d121a635a05c6ed9609f"`,
    );
  }
}
