import { MigrationInterface, QueryRunner } from 'typeorm';

export class ProcurementDisposalUnitName1710416503495
  implements MigrationInterface
{
  name = 'ProcurementDisposalUnitName1710416503495';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "procurement_disposal_units" DROP COLUMN "name"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "procurement_disposal_units" ADD "name" character varying NOT NULL`,
    );
  }
}
