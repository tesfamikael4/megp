import { MigrationInterface, QueryRunner } from 'typeorm';

export class OneToOneAPPMechanism1706617220535 implements MigrationInterface {
  name = 'OneToOneAPPMechanism1706617220535';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "procurement_mechanisms" DROP CONSTRAINT "FK_bcce08703e6ebfc7cd4f492e2fa"`,
    );
    await queryRunner.query(
      `ALTER TABLE "procurement_mechanisms" ADD CONSTRAINT "UQ_bcce08703e6ebfc7cd4f492e2fa" UNIQUE ("annualProcurementPlanActivityId")`,
    );
    await queryRunner.query(
      `ALTER TABLE "procurement_mechanisms" ADD CONSTRAINT "FK_bcce08703e6ebfc7cd4f492e2fa" FOREIGN KEY ("annualProcurementPlanActivityId") REFERENCES "annual_procurement_plan_activities"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "requisitioner_assignments" ADD CONSTRAINT "FK_0b6da07d121a635a05c6ed9608f" FOREIGN KEY ("annualProcurementPlanActivityId") REFERENCES "annual_procurement_plan_activities"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "requisitioner_assignments" DROP CONSTRAINT "FK_0b6da07d121a635a05c6ed9609f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "procurement_mechanisms" DROP CONSTRAINT "FK_bcce08703e6ebfc7cd4f492e2fa"`,
    );
    await queryRunner.query(
      `ALTER TABLE "procurement_mechanisms" DROP CONSTRAINT "UQ_bcce08703e6ebfc7cd4f492e2fa"`,
    );
    await queryRunner.query(
      `ALTER TABLE "procurement_mechanisms" ADD CONSTRAINT "FK_bcce08703e6ebfc7cd4f492e2fa" FOREIGN KEY ("annualProcurementPlanActivityId") REFERENCES "annual_procurement_plan_activities"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
