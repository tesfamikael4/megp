import { MigrationInterface, QueryRunner } from 'typeorm';

export class TeamenumStatus1712223826681 implements MigrationInterface {
  name = 'TeamenumStatus1712223826681';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "ipdc" DROP COLUMN "status"`);
    await queryRunner.query(
      `CREATE TYPE "public"."ipdc_status_enum" AS ENUM('DRAFT', 'ACTIVE', 'INACTIVE')`,
    );
    await queryRunner.query(
      `ALTER TABLE "ipdc" ADD "status" "public"."ipdc_status_enum" NOT NULL DEFAULT 'DRAFT'`,
    );
    await queryRunner.query(`ALTER TABLE "adhoc_teams" DROP COLUMN "status"`);
    await queryRunner.query(
      `CREATE TYPE "public"."adhoc_teams_status_enum" AS ENUM('DRAFT', 'ACTIVE', 'INACTIVE')`,
    );
    await queryRunner.query(
      `ALTER TABLE "adhoc_teams" ADD "status" "public"."adhoc_teams_status_enum" NOT NULL DEFAULT 'DRAFT'`,
    );
    await queryRunner.query(
      `ALTER TABLE "procurement_disposal_units" DROP COLUMN "status"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."procurement_disposal_units_status_enum" AS ENUM('DRAFT', 'ACTIVE', 'INACTIVE')`,
    );
    await queryRunner.query(
      `ALTER TABLE "procurement_disposal_units" ADD "status" "public"."procurement_disposal_units_status_enum" NOT NULL DEFAULT 'DRAFT'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "procurement_disposal_units" DROP COLUMN "status"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."procurement_disposal_units_status_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "procurement_disposal_units" ADD "status" character varying NOT NULL DEFAULT 'Draft'`,
    );
    await queryRunner.query(`ALTER TABLE "adhoc_teams" DROP COLUMN "status"`);
    await queryRunner.query(`DROP TYPE "public"."adhoc_teams_status_enum"`);
    await queryRunner.query(
      `ALTER TABLE "adhoc_teams" ADD "status" character varying NOT NULL DEFAULT 'Draft'`,
    );
    await queryRunner.query(`ALTER TABLE "ipdc" DROP COLUMN "status"`);
    await queryRunner.query(`DROP TYPE "public"."ipdc_status_enum"`);
    await queryRunner.query(
      `ALTER TABLE "ipdc" ADD "status" character varying NOT NULL DEFAULT 'Draft'`,
    );
  }
}
