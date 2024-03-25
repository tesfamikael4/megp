import { MigrationInterface, QueryRunner } from 'typeorm';

export class OrganizationId1711375310324 implements MigrationInterface {
  name = 'OrganizationId1711375310324';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "ipdc_members" DROP COLUMN "organizationId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "ipdc_members" DROP COLUMN "organizationName"`,
    );
    await queryRunner.query(
      `ALTER TABLE "ipdc" DROP COLUMN "organizationName"`,
    );
    await queryRunner.query(`ALTER TABLE "ipdc" DROP COLUMN "organizationId"`);
    await queryRunner.query(
      `ALTER TABLE "adhoc_team_members" DROP COLUMN "organizationName"`,
    );
    await queryRunner.query(
      `ALTER TABLE "adhoc_team_members" DROP COLUMN "organizationId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "adhoc_teams" DROP COLUMN "organizationName"`,
    );
    await queryRunner.query(
      `ALTER TABLE "adhoc_teams" DROP COLUMN "organizationId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "procurement_disposal_units" DROP COLUMN "organizationName"`,
    );
    await queryRunner.query(
      `ALTER TABLE "procurement_disposal_units" DROP COLUMN "organizationId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "procurement_institutions" DROP COLUMN "organizationId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "procurement_institutions" ADD "organizationId" uuid NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "procurement_institutions" ADD CONSTRAINT "FK_c06fc41c008a1bfa53881c4c066" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "procurement_institutions" DROP CONSTRAINT "FK_c06fc41c008a1bfa53881c4c066"`,
    );
    await queryRunner.query(
      `ALTER TABLE "procurement_institutions" DROP COLUMN "organizationId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "procurement_institutions" ADD "organizationId" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "procurement_disposal_units" ADD "organizationId" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "procurement_disposal_units" ADD "organizationName" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "adhoc_teams" ADD "organizationId" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "adhoc_teams" ADD "organizationName" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "adhoc_team_members" ADD "organizationId" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "adhoc_team_members" ADD "organizationName" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "ipdc" ADD "organizationId" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "ipdc" ADD "organizationName" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "ipdc_members" ADD "organizationName" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "ipdc_members" ADD "organizationId" character varying NOT NULL`,
    );
  }
}
