import { MigrationInterface, QueryRunner } from 'typeorm';

export class ProcurementInstitution1710322522117 implements MigrationInterface {
  name = 'ProcurementInstitution1710322522117';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "procurement_disposal_units" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "organizationId" uuid, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "procurementInstitutionId" uuid NOT NULL, "name" character varying NOT NULL, "status" character varying NOT NULL, CONSTRAINT "REL_de3cba598087eb37b6fa921399" UNIQUE ("procurementInstitutionId"), CONSTRAINT "PK_eb5de343a2d9554858b865ceb28" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."ipdc_members_type_enum" AS ENUM('MEMBER', 'SECRETARY', 'CHAIRPERSON')`,
    );
    await queryRunner.query(
      `CREATE TABLE "ipdc_members" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "organizationId" uuid, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "iPDCId" uuid NOT NULL, "type" "public"."ipdc_members_type_enum" NOT NULL DEFAULT 'MEMBER', "userId" character varying NOT NULL, CONSTRAINT "PK_04a9cae4b6fdebe240cc4031ef1" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "ipdc" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "organizationId" uuid, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "procurementInstitutionId" uuid NOT NULL, "status" character varying NOT NULL, "startDate" TIMESTAMP NOT NULL, "endDate" TIMESTAMP NOT NULL, CONSTRAINT "PK_2e5467e07f08bf571ae75254624" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."adhoc_team_members_type_enum" AS ENUM('MEMBER', 'SECRETARY', 'CHAIRPERSON')`,
    );
    await queryRunner.query(
      `CREATE TABLE "adhoc_team_members" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "organizationId" uuid, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "adhocTeamId" uuid NOT NULL, "userId" uuid NOT NULL, "type" "public"."adhoc_team_members_type_enum" NOT NULL DEFAULT 'MEMBER', CONSTRAINT "PK_55a0c618ba271844289e37a7c2b" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "adhoc_teams" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "organizationId" uuid, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "procurementInstitutionId" uuid NOT NULL, "status" character varying NOT NULL, "startDate" TIMESTAMP NOT NULL, "endDate" TIMESTAMP NOT NULL, CONSTRAINT "PK_4e1e68a2dab0a8a34b1e76b13f4" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "procurement_institutions" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "status" integer NOT NULL, CONSTRAINT "PK_1cae6806b672065abac7a9fef0b" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "procurement_disposal_units" ADD CONSTRAINT "FK_de3cba598087eb37b6fa921399f" FOREIGN KEY ("procurementInstitutionId") REFERENCES "procurement_institutions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "ipdc_members" ADD CONSTRAINT "FK_1e0113db3687c460c0ba9f10dc3" FOREIGN KEY ("iPDCId") REFERENCES "ipdc"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "ipdc" ADD CONSTRAINT "FK_41cce3ea4a09a9eafee28bfd9df" FOREIGN KEY ("procurementInstitutionId") REFERENCES "procurement_institutions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "adhoc_team_members" ADD CONSTRAINT "FK_23972dfb58bde9b8b9d7e3af856" FOREIGN KEY ("adhocTeamId") REFERENCES "adhoc_teams"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "adhoc_team_members" ADD CONSTRAINT "FK_1e3a1b76f0f99b5daf2e065ffcd" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "adhoc_teams" ADD CONSTRAINT "FK_4da373f78fe750057ddc1a6cd6d" FOREIGN KEY ("procurementInstitutionId") REFERENCES "procurement_institutions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "adhoc_teams" DROP CONSTRAINT "FK_4da373f78fe750057ddc1a6cd6d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "adhoc_team_members" DROP CONSTRAINT "FK_1e3a1b76f0f99b5daf2e065ffcd"`,
    );
    await queryRunner.query(
      `ALTER TABLE "adhoc_team_members" DROP CONSTRAINT "FK_23972dfb58bde9b8b9d7e3af856"`,
    );
    await queryRunner.query(
      `ALTER TABLE "ipdc" DROP CONSTRAINT "FK_41cce3ea4a09a9eafee28bfd9df"`,
    );
    await queryRunner.query(
      `ALTER TABLE "ipdc_members" DROP CONSTRAINT "FK_1e0113db3687c460c0ba9f10dc3"`,
    );
    await queryRunner.query(
      `ALTER TABLE "procurement_disposal_units" DROP CONSTRAINT "FK_de3cba598087eb37b6fa921399f"`,
    );
    await queryRunner.query(`DROP TABLE "procurement_institutions"`);
    await queryRunner.query(`DROP TABLE "adhoc_teams"`);
    await queryRunner.query(`DROP TABLE "adhoc_team_members"`);
    await queryRunner.query(
      `DROP TYPE "public"."adhoc_team_members_type_enum"`,
    );
    await queryRunner.query(`DROP TABLE "ipdc"`);
    await queryRunner.query(`DROP TABLE "ipdc_members"`);
    await queryRunner.query(`DROP TYPE "public"."ipdc_members_type_enum"`);
    await queryRunner.query(`DROP TABLE "procurement_disposal_units"`);
  }
}
