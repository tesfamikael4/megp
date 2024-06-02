import { MigrationInterface, QueryRunner } from 'typeorm';

export class EvaluatorName1717329927673 implements MigrationInterface {
  name = 'EvaluatorName1717329927673';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "financial_bid_price_assessments" DROP COLUMN "evaluatorName"`,
    );
    await queryRunner.query(
      `ALTER TABLE "financial_bid_price_assessments" ADD "evaluatorName" character varying NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "financial_bid_price_assessments" DROP COLUMN "evaluatorName"`,
    );
    await queryRunner.query(
      `ALTER TABLE "financial_bid_price_assessments" ADD "evaluatorName" uuid NOT NULL`,
    );
  }
}
