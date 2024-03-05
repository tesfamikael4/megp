import { MigrationInterface, QueryRunner } from 'typeorm';

export class VendorentityDatatatype1709631517497 implements MigrationInterface {
  name = 'VendorentityDatatatype1709631517497';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "isr_vendors" ALTER COLUMN "status" SET DEFAULT 'Draft'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "isr_vendors" ALTER COLUMN "status" SET DEFAULT 'Active'`,
    );
  }
}
