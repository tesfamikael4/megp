import { MigrationInterface, QueryRunner } from 'typeorm';

export class ProcurementInstitutionDraft1710407166329
  implements MigrationInterface
{
  name = 'ProcurementInstitutionDraft1710407166329';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "ipdc" ALTER COLUMN "status" SET DEFAULT 'Draft'`,
    );
    await queryRunner.query(
      `ALTER TABLE "adhoc_teams" ALTER COLUMN "status" SET DEFAULT 'Draft'`,
    );
    await queryRunner.query(
      `ALTER TABLE "procurement_disposal_units" ALTER COLUMN "status" SET DEFAULT 'Draft'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "procurement_disposal_units" ALTER COLUMN "status" SET DEFAULT 'InActive'`,
    );
    await queryRunner.query(
      `ALTER TABLE "adhoc_teams" ALTER COLUMN "status" SET DEFAULT 'InActive'`,
    );
    await queryRunner.query(
      `ALTER TABLE "ipdc" ALTER COLUMN "status" SET DEFAULT 'InActive'`,
    );
  }
}
