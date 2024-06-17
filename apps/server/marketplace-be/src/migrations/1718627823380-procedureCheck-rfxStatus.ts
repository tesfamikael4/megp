import { MigrationInterface, QueryRunner } from 'typeorm';

export class ProcedureCheckRfxStatus1718627823380
  implements MigrationInterface
{
  name = 'ProcedureCheckRfxStatus1718627823380';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "rfx_bid_procedures" DROP CONSTRAINT "CHK_67e53717b3ef9d87cc22ecfdda"`,
    );
    await queryRunner.query(`ALTER TABLE "sol_rounds" DROP COLUMN "start"`);
    await queryRunner.query(`ALTER TABLE "sol_rounds" DROP COLUMN "end"`);
    await queryRunner.query(
      `ALTER TABLE "sol_rounds" ADD "startingTime" TIMESTAMP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "sol_rounds" ADD "endingTime" TIMESTAMP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TYPE "public"."rfxes_status_enum" RENAME TO "rfxes_status_enum_old"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."rfxes_status_enum" AS ENUM('DRAFT', 'TEAM_REVIEWAL', 'ADJUSTMENT', 'SUBMITTED', 'SUBMITTED_EVALUATION', 'APPROVED', 'REJECTED', 'CANCELLED', 'EVALUATION', 'EVALUATION_REJECTED', 'AUCTION', 'ENDED')`,
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
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."rfxes_status_enum_old" AS ENUM('DRAFT', 'TEAM_REVIEWAL', 'ADJUSTEDMENT', 'SUBMITTED', 'SUBMITTED_EVALUATION', 'APPROVED', 'REJECTED', 'CANCELLED', 'EVALUATION', 'EVALUATION_REJECTED', 'AUCTION', 'ENDED')`,
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
      `ALTER TABLE "sol_rounds" DROP COLUMN "endingTime"`,
    );
    await queryRunner.query(
      `ALTER TABLE "sol_rounds" DROP COLUMN "startingTime"`,
    );
    await queryRunner.query(
      `ALTER TABLE "sol_rounds" ADD "end" TIMESTAMP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "sol_rounds" ADD "start" TIMESTAMP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "rfx_bid_procedures" ADD CONSTRAINT "CHK_67e53717b3ef9d87cc22ecfdda" CHECK (("submissionDeadline" > CURRENT_TIMESTAMP))`,
    );
  }
}
