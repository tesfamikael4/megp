import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChangeRelation1703250968679 implements MigrationInterface {
  name = 'ChangeRelation1703250968679';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "budget" DROP CONSTRAINT "FK_6ddfa3525052351795ce2013d87"`,
    );
    await queryRunner.query(
      `ALTER TABLE "budget" DROP CONSTRAINT "UQ_6ddfa3525052351795ce2013d87"`,
    );
    await queryRunner.query(
      `ALTER TABLE "budget" ADD CONSTRAINT "FK_6ddfa3525052351795ce2013d87" FOREIGN KEY ("budgetYearId") REFERENCES "budget_years"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "budget" DROP CONSTRAINT "FK_6ddfa3525052351795ce2013d87"`,
    );
    await queryRunner.query(
      `ALTER TABLE "budget" ADD CONSTRAINT "UQ_6ddfa3525052351795ce2013d87" UNIQUE ("budgetYearId")`,
    );
    await queryRunner.query(
      `ALTER TABLE "budget" ADD CONSTRAINT "FK_6ddfa3525052351795ce2013d87" FOREIGN KEY ("budgetYearId") REFERENCES "budget_years"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
