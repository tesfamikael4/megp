import { MigrationInterface, QueryRunner } from 'typeorm';

export class ProcuremntMechanishm1720510459545 implements MigrationInterface {
  name = 'ProcuremntMechanishm1720510459545';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "rfx_procurement_mechanisms" RENAME COLUMN "PRRfxProcurementMechanisms" TO "PRProcurementMechanisms"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "rfx_procurement_mechanisms" RENAME COLUMN "PRProcurementMechanisms" TO "PRRfxProcurementMechanisms"`,
    );
  }
}
