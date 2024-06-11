import { MigrationInterface, QueryRunner } from 'typeorm';

export class CalculatedPrice1718103328443 implements MigrationInterface {
  name = 'CalculatedPrice1718103328443';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "opened_offers" RENAME COLUMN "taxedPrice" TO "calculatedPrice"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "opened_offers" RENAME COLUMN "calculatedPrice" TO "taxedPrice"`,
    );
  }
}
