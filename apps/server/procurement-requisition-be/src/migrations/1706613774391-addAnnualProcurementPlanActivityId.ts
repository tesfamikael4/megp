import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddAnnualProcurementPlanActivityId1706613774391
  implements MigrationInterface
{
  name = 'AddAnnualProcurementPlanActivityId1706613774391';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "procurement_mechanisms" RENAME COLUMN "annualProcurementPlanId" TO "annualProcurementPlanActivityId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "procurement_mechanisms" ADD CONSTRAINT "FK_bcce08703e6ebfc7cd4f492e2fa" FOREIGN KEY ("annualProcurementPlanActivityId") REFERENCES "annual_procurement_plan_activities"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "procurement_mechanisms" DROP CONSTRAINT "FK_bcce08703e6ebfc7cd4f492e2fa"`,
    );
    await queryRunner.query(
      `ALTER TABLE "procurement_mechanisms" RENAME COLUMN "annualProcurementPlanActivityId" TO "annualProcurementPlanId"`,
    );
  }
}
