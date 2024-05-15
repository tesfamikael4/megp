import { MigrationInterface, QueryRunner } from 'typeorm';

export class BidderName1715778661006 implements MigrationInterface {
  name = 'BidderName1715778661006';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "bid_opening_checklists" DROP COLUMN "bidderName"`,
    );
    await queryRunner.query(
      `ALTER TABLE "bid_opening_checklists" ADD "bidderName" character varying NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "bid_opening_checklists" DROP COLUMN "bidderName"`,
    );
    await queryRunner.query(
      `ALTER TABLE "bid_opening_checklists" ADD "bidderName" uuid NOT NULL`,
    );
  }
}
