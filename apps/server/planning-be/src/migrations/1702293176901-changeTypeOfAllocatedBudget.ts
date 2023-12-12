import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChangeTypeOfAllocatedBudget1702293176901
  implements MigrationInterface
{
  name = 'ChangeTypeOfAllocatedBudget1702293176901';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "budget" DROP COLUMN "allocatedBudget"`,
    );
    await queryRunner.query(
      `ALTER TABLE "budget" ADD "allocatedBudget" bigint NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "budget" DROP COLUMN "allocatedBudget"`,
    );
    await queryRunner.query(
      `ALTER TABLE "budget" ADD "allocatedBudget" integer NOT NULL`,
    );
  }
}
