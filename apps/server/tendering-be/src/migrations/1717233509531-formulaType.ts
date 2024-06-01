import { MigrationInterface, QueryRunner } from 'typeorm';

export class FormulaType1717233509531 implements MigrationInterface {
  name = 'FormulaType1717233509531';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."formula_units_type_enum" AS ENUM('ADDITION', 'DEDUCTION', 'TAXES')`,
    );
    await queryRunner.query(
      `ALTER TABLE "formula_units" ADD "type" "public"."formula_units_type_enum" NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "formula_units" DROP COLUMN "type"`);
    await queryRunner.query(`DROP TYPE "public"."formula_units_type_enum"`);
  }
}
