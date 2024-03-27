import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateForfeit1711529011057 implements MigrationInterface {
  name = 'UpdateForfeit1711529011057';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "guarantee_forfeits" ADD "tenantId" integer NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "guarantee_forfeits" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "guarantee_forfeits" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "guarantee_forfeits" ADD "deletedAt" TIMESTAMP`,
    );
    await queryRunner.query(
      `ALTER TABLE "guarantee_forfeits" DROP CONSTRAINT "FK_104e2b3019acdae54fda21b5701"`,
    );
    await queryRunner.query(
      `ALTER TABLE "guarantee_forfeits" ALTER COLUMN "reason" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "guarantee_forfeits" ALTER COLUMN "guaranteeId" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TYPE "public"."guarantee_forfeits_status_enum" RENAME TO "guarantee_forfeits_status_enum_old"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."guarantee_forfeits_status_enum" AS ENUM('REQUESTED', 'APPROVED', 'REJECTED')`,
    );
    await queryRunner.query(
      `ALTER TABLE "guarantee_forfeits" ALTER COLUMN "status" TYPE "public"."guarantee_forfeits_status_enum" USING "status"::"text"::"public"."guarantee_forfeits_status_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "guarantee_forfeits" ALTER COLUMN "status" SET DEFAULT 'REQUESTED'`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."guarantee_forfeits_status_enum_old"`,
    );
    await queryRunner.query(
      `ALTER TABLE "guarantee_forfeits" ALTER COLUMN "status" SET DEFAULT 'REQUESTED'`,
    );
    await queryRunner.query(
      `ALTER TABLE "guarantee_forfeits" ADD CONSTRAINT "FK_104e2b3019acdae54fda21b5701" FOREIGN KEY ("guaranteeId") REFERENCES "guarantees"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "guarantee_forfeits" DROP CONSTRAINT "FK_104e2b3019acdae54fda21b5701"`,
    );
    await queryRunner.query(
      `ALTER TABLE "guarantee_forfeits" ALTER COLUMN "status" DROP DEFAULT`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."guarantee_forfeits_status_enum_old" AS ENUM('reviewed', 'approved', 'rejected')`,
    );
    await queryRunner.query(
      `ALTER TABLE "guarantee_forfeits" ALTER COLUMN "status" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "guarantee_forfeits" ALTER COLUMN "status" TYPE "public"."guarantee_forfeits_status_enum_old" USING "status"::"text"::"public"."guarantee_forfeits_status_enum_old"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."guarantee_forfeits_status_enum"`,
    );
    await queryRunner.query(
      `ALTER TYPE "public"."guarantee_forfeits_status_enum_old" RENAME TO "guarantee_forfeits_status_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "guarantee_forfeits" ALTER COLUMN "guaranteeId" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "guarantee_forfeits" ALTER COLUMN "reason" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "guarantee_forfeits" ADD CONSTRAINT "FK_104e2b3019acdae54fda21b5701" FOREIGN KEY ("guaranteeId") REFERENCES "guarantees"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "guarantee_forfeits" DROP COLUMN "deletedAt"`,
    );
    await queryRunner.query(
      `ALTER TABLE "guarantee_forfeits" DROP COLUMN "updatedAt"`,
    );
    await queryRunner.query(
      `ALTER TABLE "guarantee_forfeits" DROP COLUMN "createdAt"`,
    );
    await queryRunner.query(
      `ALTER TABLE "guarantee_forfeits" DROP COLUMN "tenantId"`,
    );
  }
}
