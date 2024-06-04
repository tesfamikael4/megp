import { MigrationInterface, QueryRunner } from 'typeorm';

export class PriceAnalysesDetailRelation1717507933715
  implements MigrationInterface
{
  name = 'PriceAnalysesDetailRelation1717507933715';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "financial_price_analyses" ADD "bidderName" character varying NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "financial_price_analyses" DROP COLUMN "bidderName"`,
    );
  }
}
