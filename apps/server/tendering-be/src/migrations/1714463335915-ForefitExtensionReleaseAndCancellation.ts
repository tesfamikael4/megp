import { MigrationInterface, QueryRunner } from 'typeorm';

export class ForefitExtensionReleaseAndCancellation1714463335915
  implements MigrationInterface
{
  name = 'ForefitExtensionReleaseAndCancellation1714463335915';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."bid_guarantee_extensions_status_enum" AS ENUM('INITIATED', 'REQUESTED', 'REVIEWED', 'VERIFIED', 'APPROVED')`,
    );
    await queryRunner.query(
      `CREATE TABLE "bid_guarantee_extensions" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "guaranteeId" uuid NOT NULL, "reason" character varying NOT NULL, "remark" character varying, "noOfDays" integer NOT NULL, "status" "public"."bid_guarantee_extensions_status_enum" NOT NULL, CONSTRAINT "PK_1e60d22f03fb4e4930eda4d0871" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."bid_guarantee_forfeits_status_enum" AS ENUM('REQUESTED', 'REVIEWED', 'VERIFIED', 'APPROVED')`,
    );
    await queryRunner.query(
      `CREATE TABLE "bid_guarantee_forfeits" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "guaranteeId" uuid NOT NULL, "reason" character varying NOT NULL, "remark" character varying, "status" "public"."bid_guarantee_forfeits_status_enum" NOT NULL, CONSTRAINT "PK_7108ba76922644ecc7f521f974c" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."bid_guarantee_releases_status_enum" AS ENUM('REQUESTED', 'RELEASED', 'AUTO_RELEASED')`,
    );
    await queryRunner.query(
      `CREATE TABLE "bid_guarantee_releases" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "guaranteeId" uuid NOT NULL, "reason" character varying NOT NULL, "remark" character varying, "status" "public"."bid_guarantee_releases_status_enum" NOT NULL, CONSTRAINT "PK_673ce221bda99c9076442d1492f" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."bid_guarantee_cancellations_status_enum" AS ENUM('REQUESTED', 'CANCELLED')`,
    );
    await queryRunner.query(
      `CREATE TABLE "bid_guarantee_cancellations" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "guaranteeId" uuid NOT NULL, "reason" character varying NOT NULL, "remark" character varying, "status" "public"."bid_guarantee_cancellations_status_enum" NOT NULL, CONSTRAINT "PK_5075161d83c75f39eb15a1d9be4" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "bid_guarantee_extensions" ADD CONSTRAINT "FK_d8868df42608791a19c17850e4e" FOREIGN KEY ("guaranteeId") REFERENCES "bid_guarantees"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "bid_guarantee_forfeits" ADD CONSTRAINT "FK_23c5dff36f1c6a2434f5865daac" FOREIGN KEY ("guaranteeId") REFERENCES "bid_guarantees"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "bid_guarantee_releases" ADD CONSTRAINT "FK_1f1321f1526d45828ce5d1e2280" FOREIGN KEY ("guaranteeId") REFERENCES "bid_guarantees"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "bid_guarantee_cancellations" ADD CONSTRAINT "FK_555d1417f5fb030d614e1fde676" FOREIGN KEY ("guaranteeId") REFERENCES "bid_guarantees"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "bid_guarantee_cancellations" DROP CONSTRAINT "FK_555d1417f5fb030d614e1fde676"`,
    );
    await queryRunner.query(
      `ALTER TABLE "bid_guarantee_releases" DROP CONSTRAINT "FK_1f1321f1526d45828ce5d1e2280"`,
    );
    await queryRunner.query(
      `ALTER TABLE "bid_guarantee_forfeits" DROP CONSTRAINT "FK_23c5dff36f1c6a2434f5865daac"`,
    );
    await queryRunner.query(
      `ALTER TABLE "bid_guarantee_extensions" DROP CONSTRAINT "FK_d8868df42608791a19c17850e4e"`,
    );
    await queryRunner.query(`DROP TABLE "bid_guarantee_cancellations"`);
    await queryRunner.query(
      `DROP TYPE "public"."bid_guarantee_cancellations_status_enum"`,
    );
    await queryRunner.query(`DROP TABLE "bid_guarantee_releases"`);
    await queryRunner.query(
      `DROP TYPE "public"."bid_guarantee_releases_status_enum"`,
    );
    await queryRunner.query(`DROP TABLE "bid_guarantee_forfeits"`);
    await queryRunner.query(
      `DROP TYPE "public"."bid_guarantee_forfeits_status_enum"`,
    );
    await queryRunner.query(`DROP TABLE "bid_guarantee_extensions"`);
    await queryRunner.query(
      `DROP TYPE "public"."bid_guarantee_extensions_status_enum"`,
    );
  }
}
