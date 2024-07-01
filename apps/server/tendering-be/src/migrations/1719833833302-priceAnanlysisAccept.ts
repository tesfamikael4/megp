import { MigrationInterface, QueryRunner } from 'typeorm';

export class PriceAnanlysisAccept1719833833302 implements MigrationInterface {
  name = 'PriceAnanlysisAccept1719833833302';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "financial_price_analyses_details" DROP COLUMN "difference"`,
    );
    await queryRunner.query(
      `ALTER TABLE "financial_price_analyses_details" ADD "remark" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "financial_price_analyses_details" ADD "accept" boolean NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "financial_price_analyses_details" DROP COLUMN "accept"`,
    );
    await queryRunner.query(
      `ALTER TABLE "financial_price_analyses_details" DROP COLUMN "remark"`,
    );
    await queryRunner.query(
      `ALTER TABLE "financial_price_analyses_details" ADD "difference" integer NOT NULL`,
    );
  }
}
