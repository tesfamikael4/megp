import { MigrationInterface, QueryRunner } from 'typeorm';

export class DefaultStatusForPR1704015885868 implements MigrationInterface {
  name = 'DefaultStatusForPR1704015885868';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "procurement_requisitions" ALTER COLUMN "status" SET DEFAULT 'Draft'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "procurement_requisitions" ALTER COLUMN "status" DROP DEFAULT`,
    );
  }
}
