import { MigrationInterface, QueryRunner } from 'typeorm';

export class BudgetYearIdAdded1703242258160 implements MigrationInterface {
  name = 'BudgetYearIdAdded1703242258160';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "budget" DROP CONSTRAINT "FK_9523022156de2ef2547161f4f53"`,
    );
    await queryRunner.query(
      `ALTER TABLE "budget" DROP CONSTRAINT "UQ_9523022156de2ef2547161f4f53"`,
    );
    await queryRunner.query(`ALTER TABLE "budget" DROP COLUMN "budget_year"`);
    await queryRunner.query(
      `ALTER TABLE "post_budget_plan_items" ADD "currency" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "apps" ADD "budgetYearId" uuid NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "apps" ADD CONSTRAINT "UQ_d855a79a1fd5aff929051e04b6a" UNIQUE ("budgetYearId")`,
    );
    await queryRunner.query(`ALTER TABLE "budget" DROP COLUMN "budgetYearId"`);
    await queryRunner.query(
      `ALTER TABLE "budget" ADD "budgetYearId" uuid NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "budget" ADD CONSTRAINT "UQ_6ddfa3525052351795ce2013d87" UNIQUE ("budgetYearId")`,
    );
    await queryRunner.query(
      `ALTER TABLE "budget" ADD CONSTRAINT "FK_6ddfa3525052351795ce2013d87" FOREIGN KEY ("budgetYearId") REFERENCES "budget_years"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "apps" ADD CONSTRAINT "FK_d855a79a1fd5aff929051e04b6a" FOREIGN KEY ("budgetYearId") REFERENCES "budget_years"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "apps" DROP CONSTRAINT "FK_d855a79a1fd5aff929051e04b6a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "budget" DROP CONSTRAINT "FK_6ddfa3525052351795ce2013d87"`,
    );
    await queryRunner.query(
      `ALTER TABLE "budget" DROP CONSTRAINT "UQ_6ddfa3525052351795ce2013d87"`,
    );
    await queryRunner.query(`ALTER TABLE "budget" DROP COLUMN "budgetYearId"`);
    await queryRunner.query(
      `ALTER TABLE "budget" ADD "budgetYearId" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "apps" DROP CONSTRAINT "UQ_d855a79a1fd5aff929051e04b6a"`,
    );
    await queryRunner.query(`ALTER TABLE "apps" DROP COLUMN "budgetYearId"`);
    await queryRunner.query(
      `ALTER TABLE "post_budget_plan_items" DROP COLUMN "currency"`,
    );
    await queryRunner.query(`ALTER TABLE "budget" ADD "budget_year" uuid`);
    await queryRunner.query(
      `ALTER TABLE "budget" ADD CONSTRAINT "UQ_9523022156de2ef2547161f4f53" UNIQUE ("budget_year")`,
    );
    await queryRunner.query(
      `ALTER TABLE "budget" ADD CONSTRAINT "FK_9523022156de2ef2547161f4f53" FOREIGN KEY ("budget_year") REFERENCES "budget_years"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
