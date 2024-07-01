import { MigrationInterface, QueryRunner } from 'typeorm';

export class NullableRemark1719834228181 implements MigrationInterface {
  name = 'NullableRemark1719834228181';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "financial_price_analyses_details" ALTER COLUMN "remark" DROP NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "financial_price_analyses_details" ALTER COLUMN "remark" SET NOT NULL`,
    );
  }
}
