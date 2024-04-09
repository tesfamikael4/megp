import { MigrationInterface, QueryRunner } from 'typeorm';

export class TeamTableRelation1712669492468 implements MigrationInterface {
  name = 'TeamTableRelation1712669492468';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "bid_opening_checklists" DROP COLUMN "checked"`,
    );
    await queryRunner.query(
      `ALTER TABLE "bid_opening_checklists" ADD "checked" boolean NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "team_members" DROP COLUMN "personnelName"`,
    );
    await queryRunner.query(
      `ALTER TABLE "team_members" ADD "personnelName" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "team_members" ALTER COLUMN "isActive" SET DEFAULT true`,
    );
    await queryRunner.query(`ALTER TABLE "teams" DROP COLUMN "envelopeType"`);
    await queryRunner.query(
      `CREATE TYPE "public"."teams_envelopetype_enum" AS ENUM('single envelop', 'two envelop')`,
    );
    await queryRunner.query(
      `ALTER TABLE "teams" ADD "envelopeType" "public"."teams_envelopetype_enum" NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "teams" DROP COLUMN "teamType"`);
    await queryRunner.query(
      `CREATE TYPE "public"."teams_teamtype_enum" AS ENUM('opener', 'evaluator')`,
    );
    await queryRunner.query(
      `ALTER TABLE "teams" ADD "teamType" "public"."teams_teamtype_enum" NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "openings" DROP COLUMN "status"`);
    await queryRunner.query(
      `CREATE TYPE "public"."openings_status_enum" AS ENUM('PENDING', 'COMPLETED', 'CANCELED')`,
    );
    await queryRunner.query(
      `ALTER TABLE "openings" ADD "status" "public"."openings_status_enum" NOT NULL DEFAULT 'PENDING'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "openings" DROP COLUMN "status"`);
    await queryRunner.query(`DROP TYPE "public"."openings_status_enum"`);
    await queryRunner.query(
      `ALTER TABLE "openings" ADD "status" character varying NOT NULL DEFAULT 'PENDING'`,
    );
    await queryRunner.query(`ALTER TABLE "teams" DROP COLUMN "teamType"`);
    await queryRunner.query(`DROP TYPE "public"."teams_teamtype_enum"`);
    await queryRunner.query(
      `ALTER TABLE "teams" ADD "teamType" integer NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "teams" DROP COLUMN "envelopeType"`);
    await queryRunner.query(`DROP TYPE "public"."teams_envelopetype_enum"`);
    await queryRunner.query(
      `ALTER TABLE "teams" ADD "envelopeType" integer NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "team_members" ALTER COLUMN "isActive" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "team_members" DROP COLUMN "personnelName"`,
    );
    await queryRunner.query(
      `ALTER TABLE "team_members" ADD "personnelName" uuid NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "bid_opening_checklists" DROP COLUMN "checked"`,
    );
    await queryRunner.query(
      `ALTER TABLE "bid_opening_checklists" ADD "checked" character varying NOT NULL`,
    );
  }
}
