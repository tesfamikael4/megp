import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddVersion1717962526926 implements MigrationInterface {
  name = 'AddVersion1717962526926';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "bid_opening_checklist_assessment_details" DROP COLUMN "complete"`,
    );
    await queryRunner.query(
      `ALTER TABLE "bid_opening_checklist_assessment_details" DROP COLUMN "checked"`,
    );
    await queryRunner.query(
      `ALTER TABLE "bid_opening_checklist_assessments" ADD "version" integer NOT NULL DEFAULT '1'`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."bid_opening_checklist_assessment_details_qualified_enum" AS ENUM('NOT_DONE', 'IN_PROGRESS', 'NOT_APPLICABLE', 'NOT_COMPLY', 'COMPLY')`,
    );
    await queryRunner.query(
      `ALTER TABLE "bid_opening_checklist_assessment_details" ADD "qualified" "public"."bid_opening_checklist_assessment_details_qualified_enum" NOT NULL DEFAULT 'NOT_DONE'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "bid_opening_checklist_assessment_details" DROP COLUMN "qualified"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."bid_opening_checklist_assessment_details_qualified_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "bid_opening_checklist_assessments" DROP COLUMN "version"`,
    );
    await queryRunner.query(
      `ALTER TABLE "bid_opening_checklist_assessment_details" ADD "checked" boolean NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "bid_opening_checklist_assessment_details" ADD "complete" boolean NOT NULL DEFAULT false`,
    );
  }
}
