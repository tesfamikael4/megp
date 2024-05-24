import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateOnTenderEstimatedAmount1716539043266
  implements MigrationInterface
{
  name = 'UpdateOnTenderEstimatedAmount1716539043266';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "tenders" ALTER COLUMN "budgetAmount" TYPE numeric`,
    );
    await queryRunner.query(
      `ALTER TABLE "tenders" ALTER COLUMN "marketEstimate" TYPE numeric`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "tenders" ALTER COLUMN "marketEstimate" TYPE numeric(10,2)`,
    );
    await queryRunner.query(
      `ALTER TABLE "tenders" ALTER COLUMN "budgetAmount" TYPE numeric(10,2)`,
    );
  }
}
