import { MigrationInterface, QueryRunner } from 'typeorm';

export class RfxStatusAdjust1715340374066 implements MigrationInterface {
  name = 'RfxStatusAdjust1715340374066';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "rfx_bid_procedures" ALTER COLUMN "isReverseAuction" SET DEFAULT 'false'`,
    );
    await queryRunner.query(
      `ALTER TYPE "public"."rfxs_status_enum" RENAME TO "rfxs_status_enum_old"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."rfxs_status_enum" AS ENUM('DRAFT', 'TEAM_REVIEWAL', 'ADJUSTEDMENT', 'SUBMITTED', 'APPROVED', 'REJECTED', 'CANCELLED')`,
    );
    await queryRunner.query(
      `ALTER TABLE "rfxs" ALTER COLUMN "status" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "rfxs" ALTER COLUMN "status" TYPE "public"."rfxs_status_enum" USING "status"::"text"::"public"."rfxs_status_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rfxs" ALTER COLUMN "status" SET DEFAULT 'DRAFT'`,
    );
    await queryRunner.query(`DROP TYPE "public"."rfxs_status_enum_old"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."rfxs_status_enum_old" AS ENUM('DRAFT', 'TEAM_REVIEWAL', 'ADJUSTED', 'SUBMITTED', 'APPROVED', 'REJECTED', 'CANCELLED')`,
    );
    await queryRunner.query(
      `ALTER TABLE "rfxs" ALTER COLUMN "status" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "rfxs" ALTER COLUMN "status" TYPE "public"."rfxs_status_enum_old" USING "status"::"text"::"public"."rfxs_status_enum_old"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rfxs" ALTER COLUMN "status" SET DEFAULT 'DRAFT'`,
    );
    await queryRunner.query(`DROP TYPE "public"."rfxs_status_enum"`);
    await queryRunner.query(
      `ALTER TYPE "public"."rfxs_status_enum_old" RENAME TO "rfxs_status_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rfx_bid_procedures" ALTER COLUMN "isReverseAuction" SET DEFAULT false`,
    );
  }
}
