import { MigrationInterface, QueryRunner } from 'typeorm';

export class Defalutvalue1706003683125 implements MigrationInterface {
  name = 'Defalutvalue1706003683125';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "budget" ALTER COLUMN "obligatedBudget" SET DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "budget" ALTER COLUMN "availableBudget" SET DEFAULT '0'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "budget" ALTER COLUMN "availableBudget" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "budget" ALTER COLUMN "obligatedBudget" DROP DEFAULT`,
    );
  }
}
