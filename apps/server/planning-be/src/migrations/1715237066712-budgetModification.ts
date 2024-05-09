import { MigrationInterface, QueryRunner } from 'typeorm';

export class BudgetModification1715237066712 implements MigrationInterface {
  name = 'BudgetModification1715237066712';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "budget" DROP COLUMN "allocatedBudget"`,
    );
    await queryRunner.query(
      `ALTER TABLE "budget" ADD "allocatedBudget" numeric(14,2) NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "budget" DROP COLUMN "revisedBudget"`);
    await queryRunner.query(
      `ALTER TABLE "budget" ADD "revisedBudget" numeric(14,2) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "budget" DROP COLUMN "obligatedBudget"`,
    );
    await queryRunner.query(
      `ALTER TABLE "budget" ADD "obligatedBudget" numeric(14,2) NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "budget" DROP COLUMN "availableBudget"`,
    );
    await queryRunner.query(
      `ALTER TABLE "budget" ADD "availableBudget" numeric(14,2) NOT NULL DEFAULT '0'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "budget" DROP COLUMN "availableBudget"`,
    );
    await queryRunner.query(
      `ALTER TABLE "budget" ADD "availableBudget" bigint NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "budget" DROP COLUMN "obligatedBudget"`,
    );
    await queryRunner.query(
      `ALTER TABLE "budget" ADD "obligatedBudget" bigint NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(`ALTER TABLE "budget" DROP COLUMN "revisedBudget"`);
    await queryRunner.query(
      `ALTER TABLE "budget" ADD "revisedBudget" bigint NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "budget" DROP COLUMN "allocatedBudget"`,
    );
    await queryRunner.query(
      `ALTER TABLE "budget" ADD "allocatedBudget" bigint NOT NULL`,
    );
  }
}
