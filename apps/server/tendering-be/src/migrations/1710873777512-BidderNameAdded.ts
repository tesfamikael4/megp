import { MigrationInterface, QueryRunner } from 'typeorm';

export class BidderNameAdded1710873777512 implements MigrationInterface {
  name = 'BidderNameAdded1710873777512';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "bid_registrations" ADD "bidderName" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "bid_bookmarks" ADD "bidderName" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "tenders" ADD "organizationName" character varying NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "tenders" DROP COLUMN "organizationName"`,
    );
    await queryRunner.query(
      `ALTER TABLE "bid_bookmarks" DROP COLUMN "bidderName"`,
    );
    await queryRunner.query(
      `ALTER TABLE "bid_registrations" DROP COLUMN "bidderName"`,
    );
  }
}
