import { MigrationInterface, QueryRunner } from 'typeorm';

export class UniqueBudgetCode1713349866283 implements MigrationInterface {
  name = 'UniqueBudgetCode1713349866283';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "budget" ADD CONSTRAINT "UQ_a500a135b40a8bfa90c0f3d0200" UNIQUE ("budgetCode")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "budget" DROP CONSTRAINT "UQ_a500a135b40a8bfa90c0f3d0200"`,
    );
  }
}
