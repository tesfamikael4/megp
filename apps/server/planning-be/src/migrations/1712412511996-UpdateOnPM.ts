import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateOnPM1712412511996 implements MigrationInterface {
  name = 'UpdateOnPM1712412511996';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "procurement_requisitions" ADD "budgetYearId" uuid`,
    );
    await queryRunner.query(
      `ALTER TABLE "reasons" ADD "procurementRequisitionId" uuid`,
    );
    await queryRunner.query(
      `ALTER TABLE "procurement_requisitions" ADD CONSTRAINT "FK_d63d359feede2cc4b9023d7cb62" FOREIGN KEY ("budgetYearId") REFERENCES "budget_years"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "reasons" ADD CONSTRAINT "FK_82dab153bd1fa6b09bcc031592e" FOREIGN KEY ("procurementRequisitionId") REFERENCES "procurement_requisitions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "reasons" DROP CONSTRAINT "FK_82dab153bd1fa6b09bcc031592e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "procurement_requisitions" DROP CONSTRAINT "FK_d63d359feede2cc4b9023d7cb62"`,
    );
    await queryRunner.query(
      `ALTER TABLE "reasons" DROP COLUMN "procurementRequisitionId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "procurement_requisitions" DROP COLUMN "budgetYearId"`,
    );
  }
}
