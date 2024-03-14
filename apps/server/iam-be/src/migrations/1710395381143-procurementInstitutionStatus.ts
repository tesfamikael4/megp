import { MigrationInterface, QueryRunner } from 'typeorm';

export class ProcurementInstitutionStatus1710395381143
  implements MigrationInterface
{
  name = 'ProcurementInstitutionStatus1710395381143';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "procurement_institutions" ALTER COLUMN "name" SET DEFAULT 'Default Procurement Institution'`,
    );
    await queryRunner.query(
      `ALTER TABLE "procurement_institutions" DROP COLUMN "status"`,
    );
    await queryRunner.query(
      `ALTER TABLE "procurement_institutions" ADD "status" character varying NOT NULL DEFAULT 'Draft'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "procurement_institutions" DROP COLUMN "status"`,
    );
    await queryRunner.query(
      `ALTER TABLE "procurement_institutions" ADD "status" integer NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "procurement_institutions" ALTER COLUMN "name" DROP DEFAULT`,
    );
  }
}
