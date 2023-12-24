import { MigrationInterface, QueryRunner } from 'typeorm';

export class BudgetYearName1703249680859 implements MigrationInterface {
  name = 'BudgetYearName1703249680859';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "post_budget_plan_disbursements" ADD "budgetYearName" character varying NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "post_budget_plan_disbursements" DROP COLUMN "budgetYearName"`,
    );
  }
}
