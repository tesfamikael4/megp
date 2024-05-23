import { MigrationInterface, QueryRunner } from 'typeorm';

export class SolStatuses1716299928417 implements MigrationInterface {
  name = 'SolStatuses1716299928417';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "sol_offers" RENAME COLUMN "roundWinner" TO "status"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."sol_rounds_status_enum" AS ENUM('PENDING', 'STARTED', 'COMPLETED')`,
    );
    await queryRunner.query(
      `ALTER TABLE "sol_rounds" ADD "status" "public"."sol_rounds_status_enum" NOT NULL DEFAULT 'PENDING'`,
    );
    await queryRunner.query(`ALTER TABLE "sol_offers" DROP COLUMN "status"`);
    await queryRunner.query(
      `CREATE TYPE "public"."sol_offers_status_enum" AS ENUM('PENDING', 'WINNER', 'NEXT')`,
    );
    await queryRunner.query(
      `ALTER TABLE "sol_offers" ADD "status" "public"."sol_offers_status_enum" NOT NULL DEFAULT 'PENDING'`,
    );
    await queryRunner.query(
      `ALTER TYPE "public"."rfx_bid_invitations_status_enum" RENAME TO "rfx_bid_invitations_status_enum_old"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."rfx_bid_invitations_status_enum" AS ENUM('DRAFT', 'PENDING', 'SUBMITTED', 'APPROVED', 'REJECTED', 'CANCELLED', 'ACCEPTED', 'DISCARDED')`,
    );
    await queryRunner.query(
      `ALTER TABLE "rfx_bid_invitations" ALTER COLUMN "status" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "rfx_bid_invitations" ALTER COLUMN "status" TYPE "public"."rfx_bid_invitations_status_enum" USING "status"::"text"::"public"."rfx_bid_invitations_status_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rfx_bid_invitations" ALTER COLUMN "status" SET DEFAULT 'DRAFT'`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."rfx_bid_invitations_status_enum_old"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rfx_bid_procedures" ALTER COLUMN "roundDuration" DROP NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "rfx_items" DROP COLUMN "prId"`);
    await queryRunner.query(
      `ALTER TYPE "public"."rfx_bid_invitations_status_enum" RENAME TO "rfx_bid_invitations_status_enum_old"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."rfx_bid_invitations_status_enum" AS ENUM('DRAFT', 'PENDING', 'SUBMITTED', 'APPROVED', 'REJECTED', 'CANCELLED', 'ACCEPTED', 'DISCARDED', 'WITHDRAWN', 'ENDED', 'EXPIRED')`,
    );
    await queryRunner.query(
      `ALTER TABLE "rfx_bid_invitations" ALTER COLUMN "status" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "rfx_bid_invitations" ALTER COLUMN "status" TYPE "public"."rfx_bid_invitations_status_enum" USING "status"::"text"::"public"."rfx_bid_invitations_status_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rfx_bid_invitations" ALTER COLUMN "status" SET DEFAULT 'DRAFT'`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."rfx_bid_invitations_status_enum_old"`,
    );
    await queryRunner.query(
      `ALTER TYPE "public"."rfx_items_status_enum" RENAME TO "rfx_items_status_enum_old"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."rfx_items_status_enum" AS ENUM('DRAFT', 'PENDING', 'INVITATION_PREPARED', 'SUBMITTED', 'APPROVED', 'COMPLETED', 'REJECTED', 'ENDED')`,
    );
    await queryRunner.query(
      `ALTER TABLE "rfx_items" ALTER COLUMN "status" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "rfx_items" ALTER COLUMN "status" TYPE "public"."rfx_items_status_enum" USING "status"::"text"::"public"."rfx_items_status_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rfx_items" ALTER COLUMN "status" SET DEFAULT 'DRAFT'`,
    );
    await queryRunner.query(`DROP TYPE "public"."rfx_items_status_enum_old"`);
    await queryRunner.query(
      `ALTER TYPE "public"."rfxs_status_enum" RENAME TO "rfxs_status_enum_old"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."rfxs_status_enum" AS ENUM('DRAFT', 'TEAM_REVIEWAL', 'ADJUSTEDMENT', 'SUBMITTED', 'APPROVED', 'REJECTED', 'CANCELLED', 'ENDED')`,
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
      `CREATE TYPE "public"."rfxs_status_enum_old" AS ENUM('DRAFT', 'TEAM_REVIEWAL', 'ADJUSTEDMENT', 'SUBMITTED', 'APPROVED', 'REJECTED', 'CANCELLED')`,
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
      `CREATE TYPE "public"."rfx_items_status_enum_old" AS ENUM('DRAFT', 'PENDING', 'INVITATION_PREPARED', 'SUBMITTED', 'COMPLETED', 'APPROVED', 'REJECTED')`,
    );
    await queryRunner.query(
      `ALTER TABLE "rfx_items" ALTER COLUMN "status" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "rfx_items" ALTER COLUMN "status" TYPE "public"."rfx_items_status_enum_old" USING "status"::"text"::"public"."rfx_items_status_enum_old"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rfx_items" ALTER COLUMN "status" SET DEFAULT 'DRAFT'`,
    );
    await queryRunner.query(`DROP TYPE "public"."rfx_items_status_enum"`);
    await queryRunner.query(
      `ALTER TYPE "public"."rfx_items_status_enum_old" RENAME TO "rfx_items_status_enum"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."rfx_bid_invitations_status_enum_old" AS ENUM('DRAFT', 'PENDING', 'SUBMITTED', 'APPROVED', 'REJECTED', 'CANCELLED', 'ACCEPTED', 'DISCARDED')`,
    );
    await queryRunner.query(
      `ALTER TABLE "rfx_bid_invitations" ALTER COLUMN "status" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "rfx_bid_invitations" ALTER COLUMN "status" TYPE "public"."rfx_bid_invitations_status_enum_old" USING "status"::"text"::"public"."rfx_bid_invitations_status_enum_old"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rfx_bid_invitations" ALTER COLUMN "status" SET DEFAULT 'DRAFT'`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."rfx_bid_invitations_status_enum"`,
    );
    await queryRunner.query(
      `ALTER TYPE "public"."rfx_bid_invitations_status_enum_old" RENAME TO "rfx_bid_invitations_status_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rfx_items" ADD "prId" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "rfx_bid_procedures" ALTER COLUMN "roundDuration" SET NOT NULL`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."rfx_bid_invitations_status_enum_old" AS ENUM('DRAFT', 'PENDING', 'SUBMITTED', 'APPROVED', 'REJECTED', 'CANCELLED', 'ACCEPTED')`,
    );
    await queryRunner.query(
      `ALTER TABLE "rfx_bid_invitations" ALTER COLUMN "status" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "rfx_bid_invitations" ALTER COLUMN "status" TYPE "public"."rfx_bid_invitations_status_enum_old" USING "status"::"text"::"public"."rfx_bid_invitations_status_enum_old"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rfx_bid_invitations" ALTER COLUMN "status" SET DEFAULT 'DRAFT'`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."rfx_bid_invitations_status_enum"`,
    );
    await queryRunner.query(
      `ALTER TYPE "public"."rfx_bid_invitations_status_enum_old" RENAME TO "rfx_bid_invitations_status_enum"`,
    );
    await queryRunner.query(`ALTER TABLE "sol_offers" DROP COLUMN "status"`);
    await queryRunner.query(`DROP TYPE "public"."sol_offers_status_enum"`);
    await queryRunner.query(
      `ALTER TABLE "sol_offers" ADD "status" boolean NOT NULL DEFAULT false`,
    );
    await queryRunner.query(`ALTER TABLE "sol_rounds" DROP COLUMN "status"`);
    await queryRunner.query(`DROP TYPE "public"."sol_rounds_status_enum"`);
    await queryRunner.query(
      `ALTER TABLE "sol_offers" RENAME COLUMN "status" TO "roundWinner"`,
    );
  }
}
