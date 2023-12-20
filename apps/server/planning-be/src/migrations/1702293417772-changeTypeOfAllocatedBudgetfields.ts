import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChangeTypeOfAllocatedBudgetfields1702293417772
  implements MigrationInterface
{
  name = 'ChangeTypeOfAllocatedBudgetfields1702293417772';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "budget" DROP COLUMN "plannedValue"`);
    await queryRunner.query(
      `ALTER TABLE "budget" ADD "plannedValue" bigint NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "budget" DROP COLUMN "balance"`);
    await queryRunner.query(
      `ALTER TABLE "budget" ADD "balance" bigint NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "budget" DROP COLUMN "balance"`);
    await queryRunner.query(
      `ALTER TABLE "budget" ADD "balance" integer NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "budget" DROP COLUMN "plannedValue"`);
    await queryRunner.query(
      `ALTER TABLE "budget" ADD "plannedValue" integer NOT NULL`,
    );
  }
}
