import { MigrationInterface, QueryRunner } from 'typeorm';

export class EvaluationVersion1717679227002 implements MigrationInterface {
  name = 'EvaluationVersion1717679227002';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "eval_assessments" DROP CONSTRAINT "UQ_9a98b78b09bf576982d536f8148"`,
    );
    await queryRunner.query(
      `ALTER TABLE "eval_item_responses" DROP CONSTRAINT "UQ_345355742b40f58f730609bbabd"`,
    );
    await queryRunner.query(
      `ALTER TABLE "eval_responses" DROP CONSTRAINT "UQ_883ac62c23b465b62126129a5c8"`,
    );
    await queryRunner.query(
      `ALTER TABLE "eval_assessments" ADD "version" integer NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "eval_item_responses" ADD "version" integer NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "rfxes" ADD "version" integer NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "eval_responses" ADD "version" integer NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TYPE "public"."rfxes_status_enum" RENAME TO "rfxes_status_enum_old"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."rfxes_status_enum" AS ENUM('DRAFT', 'TEAM_REVIEWAL', 'ADJUSTEDMENT', 'SUBMITTED', 'SUBMITTED_EVALUATION', 'APPROVED', 'REJECTED', 'CANCELLED', 'EVALUATION', 'EVALUATION_REJECTED', 'AUCTION', 'ENDED')`,
    );
    await queryRunner.query(
      `ALTER TABLE "rfxes" ALTER COLUMN "status" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "rfxes" ALTER COLUMN "status" TYPE "public"."rfxes_status_enum" USING "status"::"text"::"public"."rfxes_status_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rfxes" ALTER COLUMN "status" SET DEFAULT 'DRAFT'`,
    );
    await queryRunner.query(`DROP TYPE "public"."rfxes_status_enum_old"`);
    await queryRunner.query(
      `ALTER TABLE "eval_assessments" ADD CONSTRAINT "UQ_48e3ae8465500ccaa7b6526b8bf" UNIQUE ("teamMemberId", "rfxId", "isTeamAssessment", "solRegistrationId", "version")`,
    );
    await queryRunner.query(
      `ALTER TABLE "eval_item_responses" ADD CONSTRAINT "UQ_18208557e9028103b45b1881c70" UNIQUE ("teamMemberId", "rfxProductInvitaitonId", "isTeamAssessment", "version")`,
    );
    await queryRunner.query(
      `ALTER TABLE "eval_responses" ADD CONSTRAINT "UQ_3bd8a207d4f30922d9c11eb7613" UNIQUE ("teamMemberId", "rfxId", "isTeamAssessment", "openedResponseId", "version")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "eval_responses" DROP CONSTRAINT "UQ_3bd8a207d4f30922d9c11eb7613"`,
    );
    await queryRunner.query(
      `ALTER TABLE "eval_item_responses" DROP CONSTRAINT "UQ_18208557e9028103b45b1881c70"`,
    );
    await queryRunner.query(
      `ALTER TABLE "eval_assessments" DROP CONSTRAINT "UQ_48e3ae8465500ccaa7b6526b8bf"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."rfxes_status_enum_old" AS ENUM('DRAFT', 'TEAM_REVIEWAL', 'ADJUSTEDMENT', 'SUBMITTED', 'SUBMITTED_EVALUATION', 'APPROVED', 'REJECTED', 'CANCELLED', 'EVALUATION', 'AUCTION', 'ENDED')`,
    );
    await queryRunner.query(
      `ALTER TABLE "rfxes" ALTER COLUMN "status" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "rfxes" ALTER COLUMN "status" TYPE "public"."rfxes_status_enum_old" USING "status"::"text"::"public"."rfxes_status_enum_old"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rfxes" ALTER COLUMN "status" SET DEFAULT 'DRAFT'`,
    );
    await queryRunner.query(`DROP TYPE "public"."rfxes_status_enum"`);
    await queryRunner.query(
      `ALTER TYPE "public"."rfxes_status_enum_old" RENAME TO "rfxes_status_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "eval_responses" DROP COLUMN "version"`,
    );
    await queryRunner.query(`ALTER TABLE "rfxes" DROP COLUMN "version"`);
    await queryRunner.query(
      `ALTER TABLE "eval_item_responses" DROP COLUMN "version"`,
    );
    await queryRunner.query(
      `ALTER TABLE "eval_assessments" DROP COLUMN "version"`,
    );
    await queryRunner.query(
      `ALTER TABLE "eval_responses" ADD CONSTRAINT "UQ_883ac62c23b465b62126129a5c8" UNIQUE ("isTeamAssessment", "openedResponseId", "teamMemberId", "rfxId")`,
    );
    await queryRunner.query(
      `ALTER TABLE "eval_item_responses" ADD CONSTRAINT "UQ_345355742b40f58f730609bbabd" UNIQUE ("isTeamAssessment", "teamMemberId", "rfxProductInvitaitonId")`,
    );
    await queryRunner.query(
      `ALTER TABLE "eval_assessments" ADD CONSTRAINT "UQ_9a98b78b09bf576982d536f8148" UNIQUE ("isTeamAssessment", "teamMemberId", "rfxId", "solRegistrationId")`,
    );
  }
}
