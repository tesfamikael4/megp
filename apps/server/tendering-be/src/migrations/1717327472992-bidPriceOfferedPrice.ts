import { MigrationInterface, QueryRunner } from 'typeorm';

export class BidPriceOfferedPrice1717327472992 implements MigrationInterface {
  name = 'BidPriceOfferedPrice1717327472992';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "financial_bid_price_assessments" DROP COLUMN "bidPrice"`,
    );
    await queryRunner.query(
      `ALTER TABLE "financial_bid_price_assessments" DROP COLUMN "offeredPrice"`,
    );
    await queryRunner.query(
      `ALTER TABLE "financial_bid_price_assessments" ADD "bidderId" uuid NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "financial_bid_price_assessments" ADD "offeredUnitPrice" integer NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "financial_bid_price_assessments" ADD "calculatedBidUnitPrice" integer NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "financial_bid_price_assessments" DROP COLUMN "calculatedBidUnitPrice"`,
    );
    await queryRunner.query(
      `ALTER TABLE "financial_bid_price_assessments" DROP COLUMN "offeredUnitPrice"`,
    );
    await queryRunner.query(
      `ALTER TABLE "financial_bid_price_assessments" DROP COLUMN "bidderId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "financial_bid_price_assessments" ADD "offeredPrice" integer NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "financial_bid_price_assessments" ADD "bidPrice" integer NOT NULL`,
    );
  }
}
