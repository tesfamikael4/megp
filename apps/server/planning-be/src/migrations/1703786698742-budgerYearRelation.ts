import { MigrationInterface, QueryRunner } from 'typeorm';

export class BudgerYearRelation1703786698742 implements MigrationInterface {
  name = 'BudgerYearRelation1703786698742';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "apps" DROP CONSTRAINT "FK_d855a79a1fd5aff929051e04b6a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "apps" DROP CONSTRAINT "UQ_d855a79a1fd5aff929051e04b6a"`,
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
      `ALTER TABLE "apps" ADD CONSTRAINT "UQ_d855a79a1fd5aff929051e04b6a" UNIQUE ("budgetYearId")`,
    );
    await queryRunner.query(
      `ALTER TABLE "apps" ADD CONSTRAINT "FK_d855a79a1fd5aff929051e04b6a" FOREIGN KEY ("budgetYearId") REFERENCES "budget_years"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
