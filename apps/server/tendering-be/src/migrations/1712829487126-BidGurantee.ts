import { MigrationInterface, QueryRunner } from 'typeorm';

export class BidGurantee1712829487126 implements MigrationInterface {
  name = 'BidGurantee1712829487126';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."bid_guarantees_type_enum" AS ENUM('BID_GUARANTEE', 'ADVANCED', 'PERFORMANCE', 'RETENTION')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."bid_guarantees_status_enum" AS ENUM('DRAFT', 'REQUESTED', 'REVIEWED', 'REJECTED', 'VERIFIED', 'APPROVED', 'CANCELLED', 'EXPRIED')`,
    );
    await queryRunner.query(
      `CREATE TABLE "bid_guarantees" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "bidderId" uuid NOT NULL, "bidderName" character varying NOT NULL, "organizationId" uuid NOT NULL, "organizationName" character varying NOT NULL, "lotId" uuid NOT NULL, "type" "public"."bid_guarantees_type_enum" NOT NULL, "minValidityDate" integer, "revisedValidityDate" integer, "description" character varying NOT NULL, "contactPerson" jsonb NOT NULL, "hashVaue" character varying, "amount" numeric(14,2) NOT NULL DEFAULT '0', "currency" character varying NOT NULL, "guarantorId" uuid NOT NULL, "guarantorBranchName" character varying NOT NULL, "guarantorName" character varying NOT NULL, "guarantorBranchId" uuid NOT NULL, "document" jsonb, "guatranteeReference" character varying, "referenceNumber" character varying, "status" "public"."bid_guarantees_status_enum" NOT NULL, CONSTRAINT "PK_c401506f883f8405a25e85a4b29" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "bid_guarantees" ADD CONSTRAINT "FK_baa963ff6780116204df2c298fe" FOREIGN KEY ("lotId") REFERENCES "lots"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "bid_guarantees" DROP CONSTRAINT "FK_baa963ff6780116204df2c298fe"`,
    );
    await queryRunner.query(`DROP TABLE "bid_guarantees"`);
    await queryRunner.query(`DROP TYPE "public"."bid_guarantees_status_enum"`);
    await queryRunner.query(`DROP TYPE "public"."bid_guarantees_type_enum"`);
  }
}
