import { MigrationInterface, QueryRunner } from 'typeorm';

export class ProcurementInstitutionDefalut1710394123112
  implements MigrationInterface
{
  name = 'ProcurementInstitutionDefalut1710394123112';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "procurement_institutions" ALTER COLUMN "name" SET DEFAULT 'Default Procurement Institution'`,
    );
    await queryRunner.query(
      `ALTER TABLE "procurement_institutions" ALTER COLUMN "status" SET DEFAULT 'Draft'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "procurement_institutions" ALTER COLUMN "status" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "procurement_institutions" ALTER COLUMN "name" DROP DEFAULT`,
    );
  }
}
