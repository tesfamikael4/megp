import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddIsCustomInPr1708153845053 implements MigrationInterface {
  name = 'AddIsCustomInPr1708153845053';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "procurement_requisitions" ADD "isCustom" boolean NOT NULL DEFAULT true`,
    );
    await queryRunner.query(
      `ALTER TABLE "procurement_requisitions" ALTER COLUMN "budgetYear" DROP NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "procurement_requisitions" ALTER COLUMN "budgetYear" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "procurement_requisitions" DROP COLUMN "isCustom"`,
    );
  }
}
