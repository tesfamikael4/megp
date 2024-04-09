import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateOnDocumentType1712647439460 implements MigrationInterface {
  name = 'UpdateOnDocumentType1712647439460';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "shared_bidder_keys" ADD "tenantId" integer NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "shared_bidder_keys" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "shared_bidder_keys" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "shared_bidder_keys" ADD "deletedAt" TIMESTAMP`,
    );
    await queryRunner.query(
      `ALTER TABLE "bid_response_tenders" DROP COLUMN "documentType"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."bid_response_tenders_documenttype_enum" AS ENUM('RESPONSE', 'TECHNICAL_RESPONSE', 'FINANCIAL_RESPONSE')`,
    );
    await queryRunner.query(
      `ALTER TABLE "bid_response_tenders" ADD "documentType" "public"."bid_response_tenders_documenttype_enum" NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "shared_bidder_keys" DROP CONSTRAINT "UQ_436cc2315ddd13e6ac2c2f46347"`,
    );
    await queryRunner.query(
      `ALTER TABLE "shared_bidder_keys" DROP COLUMN "envelopeType"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."shared_bidder_keys_envelopetype_enum" AS ENUM('RESPONSE', 'TECHNICAL_RESPONSE', 'FINANCIAL_RESPONSE')`,
    );
    await queryRunner.query(
      `ALTER TABLE "shared_bidder_keys" ADD "envelopeType" "public"."shared_bidder_keys_envelopetype_enum" NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "bid_response_lots" DROP COLUMN "documentType"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."bid_response_lots_documenttype_enum" AS ENUM('RESPONSE', 'TECHNICAL_RESPONSE', 'FINANCIAL_RESPONSE')`,
    );
    await queryRunner.query(
      `ALTER TABLE "bid_response_lots" ADD "documentType" "public"."bid_response_lots_documenttype_enum" NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "bid_response_items" DROP COLUMN "documentType"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."bid_response_items_documenttype_enum" AS ENUM('RESPONSE', 'TECHNICAL_RESPONSE', 'FINANCIAL_RESPONSE')`,
    );
    await queryRunner.query(
      `ALTER TABLE "bid_response_items" ADD "documentType" "public"."bid_response_items_documenttype_enum" NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "shared_bidder_keys" ADD CONSTRAINT "UQ_436cc2315ddd13e6ac2c2f46347" UNIQUE ("bidRegistrationId", "envelopeType")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "shared_bidder_keys" DROP CONSTRAINT "UQ_436cc2315ddd13e6ac2c2f46347"`,
    );
    await queryRunner.query(
      `ALTER TABLE "bid_response_items" DROP COLUMN "documentType"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."bid_response_items_documenttype_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "bid_response_items" ADD "documentType" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "bid_response_lots" DROP COLUMN "documentType"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."bid_response_lots_documenttype_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "bid_response_lots" ADD "documentType" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "shared_bidder_keys" DROP COLUMN "envelopeType"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."shared_bidder_keys_envelopetype_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "shared_bidder_keys" ADD "envelopeType" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "shared_bidder_keys" ADD CONSTRAINT "UQ_436cc2315ddd13e6ac2c2f46347" UNIQUE ("envelopeType", "bidRegistrationId")`,
    );
    await queryRunner.query(
      `ALTER TABLE "bid_response_tenders" DROP COLUMN "documentType"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."bid_response_tenders_documenttype_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "bid_response_tenders" ADD "documentType" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "shared_bidder_keys" DROP COLUMN "deletedAt"`,
    );
    await queryRunner.query(
      `ALTER TABLE "shared_bidder_keys" DROP COLUMN "updatedAt"`,
    );
    await queryRunner.query(
      `ALTER TABLE "shared_bidder_keys" DROP COLUMN "createdAt"`,
    );
    await queryRunner.query(
      `ALTER TABLE "shared_bidder_keys" DROP COLUMN "tenantId"`,
    );
  }
}
