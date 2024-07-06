import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateOnBdsEvaluationEnum1720271860633
  implements MigrationInterface
{
  name = 'UpdateOnBdsEvaluationEnum1720271860633';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TYPE "public"."bds_evaluations_selectionmethod_enum" RENAME TO "bds_evaluations_selectionmethod_enum_old"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."bds_evaluations_selectionmethod_enum" AS ENUM('LCS', 'QCBS', 'QBS', 'FBS', 'CQS', 'SSS', 'LPS')`,
    );
    await queryRunner.query(
      `ALTER TABLE "bds_evaluations" ALTER COLUMN "selectionMethod" TYPE "public"."bds_evaluations_selectionmethod_enum" USING "selectionMethod"::"text"::"public"."bds_evaluations_selectionmethod_enum"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."bds_evaluations_selectionmethod_enum_old"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."bds_evaluations_selectionmethod_enum_old" AS ENUM('lowest price', 'highest price')`,
    );
    await queryRunner.query(
      `ALTER TABLE "bds_evaluations" ALTER COLUMN "selectionMethod" TYPE "public"."bds_evaluations_selectionmethod_enum_old" USING "selectionMethod"::"text"::"public"."bds_evaluations_selectionmethod_enum_old"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."bds_evaluations_selectionmethod_enum"`,
    );
    await queryRunner.query(
      `ALTER TYPE "public"."bds_evaluations_selectionmethod_enum_old" RENAME TO "bds_evaluations_selectionmethod_enum"`,
    );
  }
}
