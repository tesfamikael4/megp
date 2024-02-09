import { MigrationInterface, QueryRunner } from 'typeorm';

export class BudgetYearDate1707462851559 implements MigrationInterface {
  name = 'BudgetYearDate1707462851559';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "budget_years" ADD CONSTRAINT "CHK_f1c91a09b5ae530e5d8657c05a" CHECK ("startDate" < "endDate")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "budget_years" DROP CONSTRAINT "CHK_f1c91a09b5ae530e5d8657c05a"`,
    );
  }
}
