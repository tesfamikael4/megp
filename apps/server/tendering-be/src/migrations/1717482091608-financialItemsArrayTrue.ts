import { MigrationInterface, QueryRunner } from 'typeorm';

export class FinancialItemsArrayTrue1717482091608
  implements MigrationInterface
{
  name = 'FinancialItemsArrayTrue1717482091608';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "bid_registration_details" DROP COLUMN "financialItems"`,
    );
    await queryRunner.query(
      `ALTER TABLE "bid_registration_details" ADD "financialItems" text array`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "bid_registration_details" DROP COLUMN "financialItems"`,
    );
    await queryRunner.query(
      `ALTER TABLE "bid_registration_details" ADD "financialItems" text`,
    );
  }
}
