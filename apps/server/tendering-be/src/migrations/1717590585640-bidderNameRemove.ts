import { MigrationInterface, QueryRunner } from 'typeorm';

export class BidderNameRemove1717590585640 implements MigrationInterface {
  name = 'BidderNameRemove1717590585640';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "financial_price_analyses" DROP COLUMN "bidderName"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "financial_price_analyses" ADD "bidderName" character varying NOT NULL`,
    );
  }
}
