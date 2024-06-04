import { MigrationInterface, QueryRunner } from 'typeorm';

export class PriceAnalysesBidderId1717488624463 implements MigrationInterface {
  name = 'PriceAnalysesBidderId1717488624463';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "financial_price_analyses" ADD "bidderId" uuid NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "financial_price_analyses" ADD "bidderName" character varying NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "financial_price_analyses" DROP COLUMN "bidderName"`,
    );
    await queryRunner.query(
      `ALTER TABLE "financial_price_analyses" DROP COLUMN "bidderId"`,
    );
  }
}
