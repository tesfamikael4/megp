import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateGuaranteeRelatedTables1711628385377
  implements MigrationInterface
{
  name = 'UpdateGuaranteeRelatedTables1711628385377';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "guarantee_extensions" ADD "tenantId" integer NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "guarantee_extensions" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "guarantee_extensions" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "guarantee_extensions" ADD "deletedAt" TIMESTAMP`,
    );
    await queryRunner.query(
      `ALTER TABLE "guarantee_releases" ADD "tenantId" integer NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "guarantee_releases" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "guarantee_releases" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "guarantee_releases" ADD "deletedAt" TIMESTAMP`,
    );
    await queryRunner.query(
      `ALTER TABLE "guarantee_extensions" DROP CONSTRAINT "FK_82acf64c3baad1145f4f873a658"`,
    );
    await queryRunner.query(
      `ALTER TABLE "guarantee_extensions" ALTER COLUMN "guaranteeId" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "guarantee_extensions" DROP COLUMN "extensionDate"`,
    );
    await queryRunner.query(
      `ALTER TABLE "guarantee_extensions" ADD "extensionDate" TIMESTAMP WITH TIME ZONE NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TYPE "public"."guarantee_extensions_status_enum" RENAME TO "guarantee_extensions_status_enum_old"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."guarantee_extensions_status_enum" AS ENUM('REVIEWED', 'APPROVED', 'REJECTED')`,
    );
    await queryRunner.query(
      `ALTER TABLE "guarantee_extensions" ALTER COLUMN "status" TYPE "public"."guarantee_extensions_status_enum" USING "status"::"text"::"public"."guarantee_extensions_status_enum"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."guarantee_extensions_status_enum_old"`,
    );
    await queryRunner.query(
      `ALTER TABLE "guarantee_extensions" ALTER COLUMN "status" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "guarantee_forfeits" ALTER COLUMN "status" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "guarantee_releases" DROP CONSTRAINT "FK_800aa40054086abc843e1f5b875"`,
    );
    await queryRunner.query(
      `ALTER TABLE "guarantee_releases" ALTER COLUMN "reason" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "guarantee_releases" ALTER COLUMN "guaranteeId" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TYPE "public"."guarantee_releases_status_enum" RENAME TO "guarantee_releases_status_enum_old"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."guarantee_releases_status_enum" AS ENUM('REVIEWED', 'RELEASED')`,
    );
    await queryRunner.query(
      `ALTER TABLE "guarantee_releases" ALTER COLUMN "status" TYPE "public"."guarantee_releases_status_enum" USING "status"::"text"::"public"."guarantee_releases_status_enum"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."guarantee_releases_status_enum_old"`,
    );
    await queryRunner.query(
      `ALTER TABLE "guarantee_releases" ALTER COLUMN "status" SET NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "guarantees" DROP COLUMN "startDate"`);
    await queryRunner.query(
      `ALTER TABLE "guarantees" ADD "startDate" TIMESTAMP WITH TIME ZONE`,
    );
    await queryRunner.query(`ALTER TABLE "guarantees" DROP COLUMN "endDate"`);
    await queryRunner.query(
      `ALTER TABLE "guarantees" ADD "endDate" TIMESTAMP WITH TIME ZONE`,
    );
    await queryRunner.query(
      `ALTER TABLE "guarantees" DROP COLUMN "minValidityDate"`,
    );
    await queryRunner.query(
      `ALTER TABLE "guarantees" ADD "minValidityDate" TIMESTAMP WITH TIME ZONE`,
    );
    await queryRunner.query(
      `ALTER TABLE "guarantees" DROP COLUMN "guarantorValidityDate"`,
    );
    await queryRunner.query(
      `ALTER TABLE "guarantees" ADD "guarantorValidityDate" TIMESTAMP WITH TIME ZONE`,
    );
    await queryRunner.query(
      `ALTER TABLE "guarantee_extensions" ADD CONSTRAINT "FK_82acf64c3baad1145f4f873a658" FOREIGN KEY ("guaranteeId") REFERENCES "guarantees"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
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
      `ALTER TABLE "guarantee_extensions" DROP CONSTRAINT "FK_82acf64c3baad1145f4f873a658"`,
    );
    await queryRunner.query(
      `ALTER TABLE "guarantees" DROP COLUMN "guarantorValidityDate"`,
    );
    await queryRunner.query(
      `ALTER TABLE "guarantees" ADD "guarantorValidityDate" TIMESTAMP`,
    );
    await queryRunner.query(
      `ALTER TABLE "guarantees" DROP COLUMN "minValidityDate"`,
    );
    await queryRunner.query(
      `ALTER TABLE "guarantees" ADD "minValidityDate" TIMESTAMP`,
    );
    await queryRunner.query(`ALTER TABLE "guarantees" DROP COLUMN "endDate"`);
    await queryRunner.query(`ALTER TABLE "guarantees" ADD "endDate" TIMESTAMP`);
    await queryRunner.query(`ALTER TABLE "guarantees" DROP COLUMN "startDate"`);
    await queryRunner.query(
      `ALTER TABLE "guarantees" ADD "startDate" TIMESTAMP`,
    );
    await queryRunner.query(
      `ALTER TABLE "guarantee_releases" ALTER COLUMN "status" DROP NOT NULL`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."guarantee_releases_status_enum_old" AS ENUM('reviewed', 'approved', 'rejected')`,
    );
    await queryRunner.query(
      `ALTER TABLE "guarantee_releases" ALTER COLUMN "status" TYPE "public"."guarantee_releases_status_enum_old" USING "status"::"text"::"public"."guarantee_releases_status_enum_old"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."guarantee_releases_status_enum"`,
    );
    await queryRunner.query(
      `ALTER TYPE "public"."guarantee_releases_status_enum_old" RENAME TO "guarantee_releases_status_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "guarantee_releases" ALTER COLUMN "guaranteeId" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "guarantee_releases" ALTER COLUMN "reason" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "guarantee_releases" ADD CONSTRAINT "FK_800aa40054086abc843e1f5b875" FOREIGN KEY ("guaranteeId") REFERENCES "guarantees"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "guarantee_forfeits" ALTER COLUMN "status" SET DEFAULT 'REQUESTED'`,
    );
    await queryRunner.query(
      `ALTER TABLE "guarantee_extensions" ALTER COLUMN "status" DROP NOT NULL`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."guarantee_extensions_status_enum_old" AS ENUM('reviewed', 'approved', 'rejected')`,
    );
    await queryRunner.query(
      `ALTER TABLE "guarantee_extensions" ALTER COLUMN "status" TYPE "public"."guarantee_extensions_status_enum_old" USING "status"::"text"::"public"."guarantee_extensions_status_enum_old"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."guarantee_extensions_status_enum"`,
    );
    await queryRunner.query(
      `ALTER TYPE "public"."guarantee_extensions_status_enum_old" RENAME TO "guarantee_extensions_status_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "guarantee_extensions" DROP COLUMN "extensionDate"`,
    );
    await queryRunner.query(
      `ALTER TABLE "guarantee_extensions" ADD "extensionDate" date`,
    );
    await queryRunner.query(
      `ALTER TABLE "guarantee_extensions" ALTER COLUMN "guaranteeId" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "guarantee_extensions" ADD CONSTRAINT "FK_82acf64c3baad1145f4f873a658" FOREIGN KEY ("guaranteeId") REFERENCES "guarantees"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "guarantee_releases" DROP COLUMN "deletedAt"`,
    );
    await queryRunner.query(
      `ALTER TABLE "guarantee_releases" DROP COLUMN "updatedAt"`,
    );
    await queryRunner.query(
      `ALTER TABLE "guarantee_releases" DROP COLUMN "createdAt"`,
    );
    await queryRunner.query(
      `ALTER TABLE "guarantee_releases" DROP COLUMN "tenantId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "guarantee_extensions" DROP COLUMN "deletedAt"`,
    );
    await queryRunner.query(
      `ALTER TABLE "guarantee_extensions" DROP COLUMN "updatedAt"`,
    );
    await queryRunner.query(
      `ALTER TABLE "guarantee_extensions" DROP COLUMN "createdAt"`,
    );
    await queryRunner.query(
      `ALTER TABLE "guarantee_extensions" DROP COLUMN "tenantId"`,
    );
  }
}
