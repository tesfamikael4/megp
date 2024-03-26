import { MigrationInterface, QueryRunner } from 'typeorm';

export class GuaranteeColumnFix1711453771430 implements MigrationInterface {
  name = 'GuaranteeColumnFix1711453771430';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "guarantees" ADD "vendorName" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "guarantees" ADD "guarantorBranchName" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "guarantees" ADD "guarantorName" character varying NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "guarantees" DROP COLUMN "vendorId"`);
    await queryRunner.query(
      `ALTER TABLE "guarantees" ADD "vendorId" uuid NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "guarantees" DROP COLUMN "startDate"`);
    await queryRunner.query(
      `ALTER TABLE "guarantees" ADD "startDate" TIMESTAMP`,
    );
    await queryRunner.query(`ALTER TABLE "guarantees" DROP COLUMN "endDate"`);
    await queryRunner.query(`ALTER TABLE "guarantees" ADD "endDate" TIMESTAMP`);
    await queryRunner.query(
      `ALTER TYPE "public"."guarantees_type_enum" RENAME TO "guarantees_type_enum_old"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."guarantees_type_enum" AS ENUM('BID_SECURITY', 'ADVANCED', 'PERFORMANCE', 'RETENTION')`,
    );
    await queryRunner.query(
      `ALTER TABLE "guarantees" ALTER COLUMN "type" TYPE "public"."guarantees_type_enum" USING "type"::"text"::"public"."guarantees_type_enum"`,
    );
    await queryRunner.query(`DROP TYPE "public"."guarantees_type_enum_old"`);
    await queryRunner.query(
      `ALTER TABLE "guarantees" ALTER COLUMN "type" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "guarantees" ALTER COLUMN "objectType" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "guarantees" DROP COLUMN "minValidityDate"`,
    );
    await queryRunner.query(
      `ALTER TABLE "guarantees" ADD "minValidityDate" TIMESTAMP`,
    );
    await queryRunner.query(
      `ALTER TABLE "guarantees" DROP COLUMN "guarantorValidityDate"`,
    );
    await queryRunner.query(
      `ALTER TABLE "guarantees" ADD "guarantorValidityDate" TIMESTAMP`,
    );
    await queryRunner.query(
      `ALTER TABLE "guarantees" ALTER COLUMN "name" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "guarantees" ALTER COLUMN "title" SET NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "guarantees" DROP COLUMN "objectId"`);
    await queryRunner.query(
      `ALTER TABLE "guarantees" ADD "objectId" uuid NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "guarantees" ALTER COLUMN "currencyType" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "guarantees" DROP COLUMN "guarantorId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "guarantees" ADD "guarantorId" uuid NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "guarantees" DROP COLUMN "guarantorBranchId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "guarantees" ADD "guarantorBranchId" uuid NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "guarantees" DROP COLUMN "attachment"`,
    );
    await queryRunner.query(`ALTER TABLE "guarantees" ADD "attachment" jsonb`);
    await queryRunner.query(
      `ALTER TYPE "public"."guarantees_status_enum" RENAME TO "guarantees_status_enum_old"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."guarantees_status_enum" AS ENUM('REQUESTED', 'APPROVED', 'REJECTED')`,
    );
    await queryRunner.query(
      `ALTER TABLE "guarantees" ALTER COLUMN "status" TYPE "public"."guarantees_status_enum" USING "status"::"text"::"public"."guarantees_status_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "guarantees" ALTER COLUMN "status" SET DEFAULT 'REQUESTED'`,
    );
    await queryRunner.query(`DROP TYPE "public"."guarantees_status_enum_old"`);
    await queryRunner.query(
      `ALTER TABLE "guarantees" ALTER COLUMN "status" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "guarantees" ALTER COLUMN "status" SET DEFAULT 'REQUESTED'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "guarantees" ALTER COLUMN "status" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "guarantees" ALTER COLUMN "status" DROP NOT NULL`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."guarantees_status_enum_old" AS ENUM('reviewed', 'approved', 'rejected')`,
    );
    await queryRunner.query(
      `ALTER TABLE "guarantees" ALTER COLUMN "status" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "guarantees" ALTER COLUMN "status" TYPE "public"."guarantees_status_enum_old" USING "status"::"text"::"public"."guarantees_status_enum_old"`,
    );
    await queryRunner.query(`DROP TYPE "public"."guarantees_status_enum"`);
    await queryRunner.query(
      `ALTER TYPE "public"."guarantees_status_enum_old" RENAME TO "guarantees_status_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "guarantees" DROP COLUMN "attachment"`,
    );
    await queryRunner.query(
      `ALTER TABLE "guarantees" ADD "attachment" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "guarantees" DROP COLUMN "guarantorBranchId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "guarantees" ADD "guarantorBranchId" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "guarantees" DROP COLUMN "guarantorId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "guarantees" ADD "guarantorId" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "guarantees" ALTER COLUMN "currencyType" DROP NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "guarantees" DROP COLUMN "objectId"`);
    await queryRunner.query(
      `ALTER TABLE "guarantees" ADD "objectId" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "guarantees" ALTER COLUMN "title" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "guarantees" ALTER COLUMN "name" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "guarantees" DROP COLUMN "guarantorValidityDate"`,
    );
    await queryRunner.query(
      `ALTER TABLE "guarantees" ADD "guarantorValidityDate" integer`,
    );
    await queryRunner.query(
      `ALTER TABLE "guarantees" DROP COLUMN "minValidityDate"`,
    );
    await queryRunner.query(
      `ALTER TABLE "guarantees" ADD "minValidityDate" integer`,
    );
    await queryRunner.query(
      `ALTER TABLE "guarantees" ALTER COLUMN "objectType" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "guarantees" ALTER COLUMN "type" DROP NOT NULL`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."guarantees_type_enum_old" AS ENUM('bid guarantee', 'advanced', 'performance', 'retention')`,
    );
    await queryRunner.query(
      `ALTER TABLE "guarantees" ALTER COLUMN "type" TYPE "public"."guarantees_type_enum_old" USING "type"::"text"::"public"."guarantees_type_enum_old"`,
    );
    await queryRunner.query(`DROP TYPE "public"."guarantees_type_enum"`);
    await queryRunner.query(
      `ALTER TYPE "public"."guarantees_type_enum_old" RENAME TO "guarantees_type_enum"`,
    );
    await queryRunner.query(`ALTER TABLE "guarantees" DROP COLUMN "endDate"`);
    await queryRunner.query(`ALTER TABLE "guarantees" ADD "endDate" date`);
    await queryRunner.query(`ALTER TABLE "guarantees" DROP COLUMN "startDate"`);
    await queryRunner.query(`ALTER TABLE "guarantees" ADD "startDate" date`);
    await queryRunner.query(`ALTER TABLE "guarantees" DROP COLUMN "vendorId"`);
    await queryRunner.query(
      `ALTER TABLE "guarantees" ADD "vendorId" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "guarantees" DROP COLUMN "guarantorName"`,
    );
    await queryRunner.query(
      `ALTER TABLE "guarantees" DROP COLUMN "guarantorBranchName"`,
    );
    await queryRunner.query(
      `ALTER TABLE "guarantees" DROP COLUMN "vendorName"`,
    );
  }
}
