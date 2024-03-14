import { MigrationInterface, QueryRunner } from 'typeorm';

export class ProcurementInstitutionOrgId1710385838447
  implements MigrationInterface
{
  name = 'ProcurementInstitutionOrgId1710385838447';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "procurement_institutions" ADD "organizationId" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "procurement_disposal_units" DROP COLUMN "organizationId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "procurement_disposal_units" ADD "organizationId" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "ipdc_members" DROP COLUMN "organizationId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "ipdc_members" ADD "organizationId" character varying NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "ipdc" DROP COLUMN "organizationId"`);
    await queryRunner.query(
      `ALTER TABLE "ipdc" ADD "organizationId" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "adhoc_teams" DROP COLUMN "organizationId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "adhoc_teams" ADD "organizationId" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "adhoc_team_members" DROP COLUMN "organizationId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "adhoc_team_members" ADD "organizationId" character varying NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "adhoc_team_members" DROP COLUMN "organizationId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "adhoc_team_members" ADD "organizationId" uuid`,
    );
    await queryRunner.query(
      `ALTER TABLE "adhoc_teams" DROP COLUMN "organizationId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "adhoc_teams" ADD "organizationId" uuid`,
    );
    await queryRunner.query(`ALTER TABLE "ipdc" DROP COLUMN "organizationId"`);
    await queryRunner.query(`ALTER TABLE "ipdc" ADD "organizationId" uuid`);
    await queryRunner.query(
      `ALTER TABLE "ipdc_members" DROP COLUMN "organizationId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "ipdc_members" ADD "organizationId" uuid`,
    );
    await queryRunner.query(
      `ALTER TABLE "procurement_disposal_units" DROP COLUMN "organizationId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "procurement_disposal_units" ADD "organizationId" uuid`,
    );
    await queryRunner.query(
      `ALTER TABLE "procurement_institutions" DROP COLUMN "organizationId"`,
    );
  }
}
