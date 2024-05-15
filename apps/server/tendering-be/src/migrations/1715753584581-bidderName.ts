import { MigrationInterface, QueryRunner } from 'typeorm';

export class BidderName1715753584581 implements MigrationInterface {
  name = 'BidderName1715753584581';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "bid_opening_checklists" ADD "bidderName" uuid NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "bid_opening_checklists" DROP COLUMN "bidderName"`,
    );
  }
}
