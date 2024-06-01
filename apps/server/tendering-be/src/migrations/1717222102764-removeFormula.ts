import { MigrationInterface, QueryRunner } from 'typeorm';

export class RemoveFormula1717222102764 implements MigrationInterface {
  name = 'RemoveFormula1717222102764';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "formula_units" DROP CONSTRAINT "FK_9e96e8aa7553426a5650f4e1072"`,
    );
    await queryRunner.query(
      `ALTER TABLE "formula_units" DROP CONSTRAINT "UQ_c1348cf431199f89c67ee13ec80"`,
    );
    await queryRunner.query(
      `ALTER TABLE "formula_units" RENAME COLUMN "formulaId" TO "lotId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "formula_units" ADD CONSTRAINT "UQ_ac6f68dd4ed008a238108020991" UNIQUE ("lotId", "name")`,
    );
    await queryRunner.query(
      `ALTER TABLE "formula_units" ADD CONSTRAINT "FK_a7fb65e66d602597e065be64b36" FOREIGN KEY ("lotId") REFERENCES "lots"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "formula_units" DROP CONSTRAINT "FK_a7fb65e66d602597e065be64b36"`,
    );
    await queryRunner.query(
      `ALTER TABLE "formula_units" DROP CONSTRAINT "UQ_ac6f68dd4ed008a238108020991"`,
    );
    await queryRunner.query(
      `ALTER TABLE "formula_units" RENAME COLUMN "lotId" TO "formulaId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "formula_units" ADD CONSTRAINT "UQ_c1348cf431199f89c67ee13ec80" UNIQUE ("name", "formulaId")`,
    );
    await queryRunner.query(
      `ALTER TABLE "formula_units" ADD CONSTRAINT "FK_9e96e8aa7553426a5650f4e1072" FOREIGN KEY ("formulaId") REFERENCES "formulas"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
