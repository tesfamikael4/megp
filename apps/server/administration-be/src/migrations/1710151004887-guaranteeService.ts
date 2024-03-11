import { MigrationInterface, QueryRunner } from 'typeorm';

export class GuaranteeService1710151004887 implements MigrationInterface {
  name = 'GuaranteeService1710151004887';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."guarantee_extensions_status_enum" AS ENUM('reviewed', 'approved', 'rejected')`,
    );
    await queryRunner.query(
      `CREATE TABLE "guarantee_extensions" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "guaranteeId" uuid, "remark" character varying, "extensionDate" date, "status" "public"."guarantee_extensions_status_enum" NOT NULL, CONSTRAINT "PK_0c273dd69009cadb4158381cbb0" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."guarantee_forfeits_status_enum" AS ENUM('reviewed', 'approved', 'rejected')`,
    );
    await queryRunner.query(
      `CREATE TABLE "guarantee_forfeits" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "reason" character varying, "guaranteeId" uuid, "attachment" json, "status" "public"."guarantee_forfeits_status_enum" NOT NULL, CONSTRAINT "PK_c2cde09212ebf6d6ee211e531ef" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."guarantee_releases_status_enum" AS ENUM('reviewed', 'approved', 'rejected')`,
    );
    await queryRunner.query(
      `CREATE TABLE "guarantee_releases" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "reason" character varying, "guaranteeId" uuid, "status" "public"."guarantee_releases_status_enum", CONSTRAINT "PK_619d5373a57e5cb3b463511f00e" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."guarantees_type_enum" AS ENUM('bid guarantee', 'advanced', 'performance', 'retention')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."guarantees_status_enum" AS ENUM('reviewed', 'approved', 'rejected')`,
    );
    await queryRunner.query(
      `CREATE TABLE "guarantees" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "vendorId" character varying, "startDate" date, "endDate" date, "type" "public"."guarantees_type_enum", "objectType" character varying, "minValidityDate" integer, "guarantorValidityDate" integer, "name" character varying, "title" character varying, "objectId" character varying, "amount" double precision NOT NULL, "currencyType" character varying, "GuarantorId" character varying, "GuarantorBranchId" character varying, "remark" character varying, "attachment" character varying, "status" "public"."guarantees_status_enum", CONSTRAINT "PK_0952d3cdbdaa3d2a5d2089ceed3" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "guarantee_extensions" ADD CONSTRAINT "FK_82acf64c3baad1145f4f873a658" FOREIGN KEY ("guaranteeId") REFERENCES "guarantees"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "guarantee_forfeits" ADD CONSTRAINT "FK_104e2b3019acdae54fda21b5701" FOREIGN KEY ("guaranteeId") REFERENCES "guarantees"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "guarantee_releases" ADD CONSTRAINT "FK_800aa40054086abc843e1f5b875" FOREIGN KEY ("guaranteeId") REFERENCES "guarantees"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "guarantee_releases" DROP CONSTRAINT "FK_800aa40054086abc843e1f5b875"`,
    );
    await queryRunner.query(
      `ALTER TABLE "guarantee_forfeits" DROP CONSTRAINT "FK_104e2b3019acdae54fda21b5701"`,
    );
    await queryRunner.query(
      `ALTER TABLE "guarantee_extensions" DROP CONSTRAINT "FK_82acf64c3baad1145f4f873a658"`,
    );
    await queryRunner.query(`DROP TABLE "guarantees"`);
    await queryRunner.query(`DROP TYPE "public"."guarantees_status_enum"`);
    await queryRunner.query(`DROP TYPE "public"."guarantees_type_enum"`);
    await queryRunner.query(`DROP TABLE "guarantee_releases"`);
    await queryRunner.query(
      `DROP TYPE "public"."guarantee_releases_status_enum"`,
    );
    await queryRunner.query(`DROP TABLE "guarantee_forfeits"`);
    await queryRunner.query(
      `DROP TYPE "public"."guarantee_forfeits_status_enum"`,
    );
    await queryRunner.query(`DROP TABLE "guarantee_extensions"`);
    await queryRunner.query(
      `DROP TYPE "public"."guarantee_extensions_status_enum"`,
    );
  }
}
