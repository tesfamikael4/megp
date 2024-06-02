import { MigrationInterface, QueryRunner } from 'typeorm';

export class FormulaImplementationResult1717321924099
  implements MigrationInterface
{
  name = 'FormulaImplementationResult1717321924099';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "formula_implementations" ADD "result" integer`,
    );
    await queryRunner.query(
      `ALTER TABLE "financial_bid_price_assessments" ADD "formulaImplementationId" uuid NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "financial_bid_price_assessments" ADD CONSTRAINT "UQ_933c02b8b6eda946034e76952cd" UNIQUE ("formulaImplementationId")`,
    );
    await queryRunner.query(
      `ALTER TYPE "public"."price_adjusting_factors_type_enum" RENAME TO "price_adjusting_factors_type_enum_old"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."price_adjusting_factors_type_enum" AS ENUM('ADDITION', 'DEDUCTION', 'TAXES', 'TOTAL')`,
    );
    await queryRunner.query(
      `ALTER TABLE "price_adjusting_factors" ALTER COLUMN "type" TYPE "public"."price_adjusting_factors_type_enum" USING "type"::"text"::"public"."price_adjusting_factors_type_enum"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."price_adjusting_factors_type_enum_old"`,
    );
    await queryRunner.query(
      `ALTER TYPE "public"."formula_implementations_type_enum" RENAME TO "formula_implementations_type_enum_old"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."formula_implementations_type_enum" AS ENUM('ADDITION', 'DEDUCTION', 'TAXES', 'TOTAL')`,
    );
    await queryRunner.query(
      `ALTER TABLE "formula_implementations" ALTER COLUMN "type" TYPE "public"."formula_implementations_type_enum" USING "type"::"text"::"public"."formula_implementations_type_enum"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."formula_implementations_type_enum_old"`,
    );
    await queryRunner.query(
      `ALTER TYPE "public"."formula_units_type_enum" RENAME TO "formula_units_type_enum_old"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."formula_units_type_enum" AS ENUM('ADDITION', 'DEDUCTION', 'TAXES', 'TOTAL')`,
    );
    await queryRunner.query(
      `ALTER TABLE "formula_units" ALTER COLUMN "type" TYPE "public"."formula_units_type_enum" USING "type"::"text"::"public"."formula_units_type_enum"`,
    );
    await queryRunner.query(`DROP TYPE "public"."formula_units_type_enum_old"`);
    await queryRunner.query(
      `ALTER TABLE "financial_bid_price_assessments" ADD CONSTRAINT "FK_933c02b8b6eda946034e76952cd" FOREIGN KEY ("formulaImplementationId") REFERENCES "formula_implementations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "financial_bid_price_assessments" DROP CONSTRAINT "FK_933c02b8b6eda946034e76952cd"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."formula_units_type_enum_old" AS ENUM('ADDITION', 'DEDUCTION', 'TAXES')`,
    );
    await queryRunner.query(
      `ALTER TABLE "formula_units" ALTER COLUMN "type" TYPE "public"."formula_units_type_enum_old" USING "type"::"text"::"public"."formula_units_type_enum_old"`,
    );
    await queryRunner.query(`DROP TYPE "public"."formula_units_type_enum"`);
    await queryRunner.query(
      `ALTER TYPE "public"."formula_units_type_enum_old" RENAME TO "formula_units_type_enum"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."formula_implementations_type_enum_old" AS ENUM('ADDITION', 'DEDUCTION', 'TAXES')`,
    );
    await queryRunner.query(
      `ALTER TABLE "formula_implementations" ALTER COLUMN "type" TYPE "public"."formula_implementations_type_enum_old" USING "type"::"text"::"public"."formula_implementations_type_enum_old"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."formula_implementations_type_enum"`,
    );
    await queryRunner.query(
      `ALTER TYPE "public"."formula_implementations_type_enum_old" RENAME TO "formula_implementations_type_enum"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."price_adjusting_factors_type_enum_old" AS ENUM('ADDITION', 'DEDUCTION', 'TAXES')`,
    );
    await queryRunner.query(
      `ALTER TABLE "price_adjusting_factors" ALTER COLUMN "type" TYPE "public"."price_adjusting_factors_type_enum_old" USING "type"::"text"::"public"."price_adjusting_factors_type_enum_old"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."price_adjusting_factors_type_enum"`,
    );
    await queryRunner.query(
      `ALTER TYPE "public"."price_adjusting_factors_type_enum_old" RENAME TO "price_adjusting_factors_type_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "financial_bid_price_assessments" DROP CONSTRAINT "UQ_933c02b8b6eda946034e76952cd"`,
    );
    await queryRunner.query(
      `ALTER TABLE "financial_bid_price_assessments" DROP COLUMN "formulaImplementationId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "formula_implementations" DROP COLUMN "result"`,
    );
  }
}
