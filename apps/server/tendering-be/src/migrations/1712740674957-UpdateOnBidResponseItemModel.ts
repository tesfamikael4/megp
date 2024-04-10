import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateOnBidResponseItemModel1712740674957
  implements MigrationInterface
{
  name = 'UpdateOnBidResponseItemModel1712740674957';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "bid_registration_details" ADD "technicalItems" text`,
    );
    await queryRunner.query(
      `ALTER TABLE "bid_registration_details" ADD "financialItems" text`,
    );
    await queryRunner.query(
      `ALTER TABLE "bid_opening_checklists" ADD "submit" boolean NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "bds_evaluations" DROP COLUMN "evaluationMethod"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."bds_evaluations_evaluationmethod_enum" AS ENUM('point system', 'compliance')`,
    );
    await queryRunner.query(
      `ALTER TABLE "bds_evaluations" ADD "evaluationMethod" "public"."bds_evaluations_evaluationmethod_enum" NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "bds_evaluations" DROP COLUMN "selectionMethod"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."bds_evaluations_selectionmethod_enum" AS ENUM('lowest price', 'highest price')`,
    );
    await queryRunner.query(
      `ALTER TABLE "bds_evaluations" ADD "selectionMethod" "public"."bds_evaluations_selectionmethod_enum" NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "bds_evaluations" DROP COLUMN "awardType"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."bds_evaluations_awardtype_enum" AS ENUM('item based', 'lot based')`,
    );
    await queryRunner.query(
      `ALTER TABLE "bds_evaluations" ADD "awardType" "public"."bds_evaluations_awardtype_enum" NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "teams" DROP CONSTRAINT "UQ_0e0f1ddb4f2fdb3b64ca3a41fe0"`,
    );
    await queryRunner.query(
      `ALTER TYPE "public"."teams_teamtype_enum" RENAME TO "teams_teamtype_enum_old"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."teams_teamtype_enum" AS ENUM('TECHNICAL_OPENER', 'TECHNICAL_EVALUATOR', 'FINANCIAL_OPENER', 'FINANCIAL_EVALUATOR')`,
    );
    await queryRunner.query(
      `ALTER TABLE "teams" ALTER COLUMN "teamType" TYPE "public"."teams_teamtype_enum" USING "teamType"::"text"::"public"."teams_teamtype_enum"`,
    );
    await queryRunner.query(`DROP TYPE "public"."teams_teamtype_enum_old"`);
    await queryRunner.query(
      `ALTER TABLE "teams" ADD CONSTRAINT "UQ_0e0f1ddb4f2fdb3b64ca3a41fe0" UNIQUE ("lotId", "teamType")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "teams" DROP CONSTRAINT "UQ_0e0f1ddb4f2fdb3b64ca3a41fe0"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."teams_teamtype_enum_old" AS ENUM('opener', 'evaluator')`,
    );
    await queryRunner.query(
      `ALTER TABLE "teams" ALTER COLUMN "teamType" TYPE "public"."teams_teamtype_enum_old" USING "teamType"::"text"::"public"."teams_teamtype_enum_old"`,
    );
    await queryRunner.query(`DROP TYPE "public"."teams_teamtype_enum"`);
    await queryRunner.query(
      `ALTER TYPE "public"."teams_teamtype_enum_old" RENAME TO "teams_teamtype_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "teams" ADD CONSTRAINT "UQ_0e0f1ddb4f2fdb3b64ca3a41fe0" UNIQUE ("lotId", "teamType")`,
    );
    await queryRunner.query(
      `ALTER TABLE "bds_evaluations" DROP COLUMN "awardType"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."bds_evaluations_awardtype_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "bds_evaluations" ADD "awardType" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "bds_evaluations" DROP COLUMN "selectionMethod"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."bds_evaluations_selectionmethod_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "bds_evaluations" ADD "selectionMethod" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "bds_evaluations" DROP COLUMN "evaluationMethod"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."bds_evaluations_evaluationmethod_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "bds_evaluations" ADD "evaluationMethod" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "bid_opening_checklists" DROP COLUMN "submit"`,
    );
    await queryRunner.query(
      `ALTER TABLE "bid_registration_details" DROP COLUMN "financialItems"`,
    );
    await queryRunner.query(
      `ALTER TABLE "bid_registration_details" DROP COLUMN "technicalItems"`,
    );
  }
}
