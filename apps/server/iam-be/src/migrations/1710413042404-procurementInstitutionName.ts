import { MigrationInterface, QueryRunner } from 'typeorm';

export class ProcurementInstitutionName1710413042404
  implements MigrationInterface
{
  name = 'ProcurementInstitutionName1710413042404';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "ipdc" ADD "name" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "adhoc_teams" ADD "name" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "procurement_disposal_units" ADD "unitId" uuid NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "ipdc_members" DROP COLUMN "organizationId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "ipdc_members" ADD "organizationId" uuid`,
    );
    await queryRunner.query(`ALTER TABLE "ipdc_members" DROP COLUMN "userId"`);
    await queryRunner.query(
      `ALTER TABLE "ipdc_members" ADD "userId" uuid NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "ipdc" DROP COLUMN "organizationId"`);
    await queryRunner.query(`ALTER TABLE "ipdc" ADD "organizationId" uuid`);
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
    await queryRunner.query(
      `ALTER TABLE "procurement_institutions" DROP COLUMN "status"`,
    );
    await queryRunner.query(
      `ALTER TABLE "procurement_institutions" ADD "status" integer NOT NULL DEFAULT 'Draft'`,
    );
    await queryRunner.query(
      `ALTER TABLE "procurement_disposal_units" DROP COLUMN "organizationId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "procurement_disposal_units" ADD "organizationId" uuid`,
    );
    await queryRunner.query(
      `ALTER TABLE "ipdc_members" ADD CONSTRAINT "FK_d5e3775ad4795ae5fd2d2878241" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "procurement_disposal_units" ADD CONSTRAINT "FK_b546c233dbe051c41db738537da" FOREIGN KEY ("unitId") REFERENCES "units"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "procurement_disposal_units" DROP CONSTRAINT "FK_b546c233dbe051c41db738537da"`,
    );
    await queryRunner.query(
      `ALTER TABLE "ipdc_members" DROP CONSTRAINT "FK_d5e3775ad4795ae5fd2d2878241"`,
    );
    await queryRunner.query(
      `ALTER TABLE "procurement_disposal_units" DROP COLUMN "organizationId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "procurement_disposal_units" ADD "organizationId" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "procurement_institutions" DROP COLUMN "status"`,
    );
    await queryRunner.query(
      `ALTER TABLE "procurement_institutions" ADD "status" character varying NOT NULL DEFAULT 'Draft'`,
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
    await queryRunner.query(`ALTER TABLE "ipdc" DROP COLUMN "organizationId"`);
    await queryRunner.query(
      `ALTER TABLE "ipdc" ADD "organizationId" character varying NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "ipdc_members" DROP COLUMN "userId"`);
    await queryRunner.query(
      `ALTER TABLE "ipdc_members" ADD "userId" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "ipdc_members" DROP COLUMN "organizationId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "ipdc_members" ADD "organizationId" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "procurement_disposal_units" DROP COLUMN "unitId"`,
    );
    await queryRunner.query(`ALTER TABLE "adhoc_teams" DROP COLUMN "name"`);
    await queryRunner.query(`ALTER TABLE "ipdc" DROP COLUMN "name"`);
  }
}
