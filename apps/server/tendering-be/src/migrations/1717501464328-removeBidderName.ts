import { MigrationInterface, QueryRunner } from 'typeorm';

export class RemoveBidderName1717501464328 implements MigrationInterface {
  name = 'RemoveBidderName1717501464328';

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
