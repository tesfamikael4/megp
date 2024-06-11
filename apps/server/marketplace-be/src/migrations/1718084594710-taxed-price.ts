import { MigrationInterface, QueryRunner } from 'typeorm';

export class TaxedPrice1718084594710 implements MigrationInterface {
  name = 'TaxedPrice1718084594710';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "opened_offers" ADD "taxedPrice" integer NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "opened_offers" DROP COLUMN "taxedPrice"`,
    );
  }
}
