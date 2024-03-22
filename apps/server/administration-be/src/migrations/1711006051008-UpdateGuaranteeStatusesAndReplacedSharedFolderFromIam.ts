import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateGuaranteeStatusesAndReplacedSharedFolderFromIam1711006051008
  implements MigrationInterface
{
  name = 'UpdateGuaranteeStatusesAndReplacedSharedFolderFromIam1711006051008';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TYPE "public"."guarantees_type_enum" RENAME TO "guarantees_type_enum_old"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."guarantees_type_enum" AS ENUM('BID_SECURITY', 'ADVANCED', 'PERFORMANCE', 'RETENTION')`,
    );
    await queryRunner.query(
      `ALTER TABLE "guarantees" ALTER COLUMN "type" TYPE "public"."guarantees_type_enum" USING "type"::"text"::"public"."guarantees_type_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "guarantees" ALTER COLUMN "type" SET DEFAULT 'BID_SECURITY'`,
    );
    await queryRunner.query(`DROP TYPE "public"."guarantees_type_enum_old"`);
    await queryRunner.query(
      `ALTER TABLE "guarantees" ALTER COLUMN "type" SET DEFAULT 'BID_SECURITY'`,
    );
    await queryRunner.query(
      `ALTER TABLE "guarantees" DROP COLUMN "minValidityDate"`,
    );
    await queryRunner.query(
      `ALTER TABLE "guarantees" ADD "minValidityDate" date`,
    );
    await queryRunner.query(
      `ALTER TABLE "guarantees" DROP COLUMN "guarantorValidityDate"`,
    );
    await queryRunner.query(
      `ALTER TABLE "guarantees" ADD "guarantorValidityDate" date`,
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
      `ALTER TABLE "guarantees" ALTER COLUMN "status" SET DEFAULT 'REQUESTED'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "guarantees" ALTER COLUMN "status" DROP DEFAULT`,
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
      `ALTER TABLE "guarantees" ALTER COLUMN "type" DROP DEFAULT`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."guarantees_type_enum_old" AS ENUM('bid guarantee', 'advanced', 'performance', 'retention')`,
    );
    await queryRunner.query(
      `ALTER TABLE "guarantees" ALTER COLUMN "type" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "guarantees" ALTER COLUMN "type" TYPE "public"."guarantees_type_enum_old" USING "type"::"text"::"public"."guarantees_type_enum_old"`,
    );
    await queryRunner.query(`DROP TYPE "public"."guarantees_type_enum"`);
    await queryRunner.query(
      `ALTER TYPE "public"."guarantees_type_enum_old" RENAME TO "guarantees_type_enum"`,
    );
  }
}
