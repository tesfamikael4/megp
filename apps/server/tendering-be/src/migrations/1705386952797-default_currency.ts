import { MigrationInterface, QueryRunner } from 'typeorm';

export class DefaultCurrency1705386952797 implements MigrationInterface {
  name = 'DefaultCurrency1705386952797';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "procurement_requisitions" ALTER COLUMN "currency" SET DEFAULT 'USD'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "procurement_requisitions" ALTER COLUMN "currency" DROP DEFAULT`,
    );
  }
}
