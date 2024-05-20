import { MigrationInterface, QueryRunner } from 'typeorm';

export class OpenedBidResponseTenderAdded1713181333319
  implements MigrationInterface
{
  name = 'OpenedBidResponseTenderAdded1713181333319';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."opened_bid_response_tenders_documenttype_enum" AS ENUM('RESPONSE', 'TECHNICAL_RESPONSE', 'FINANCIAL_RESPONSE')`,
    );
    await queryRunner.query(
      `CREATE TABLE "opened_bid_response_tenders" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "bidRegistrationId" uuid NOT NULL, "documentType" "public"."opened_bid_response_tenders_documenttype_enum" NOT NULL, "key" character varying NOT NULL, "value" text NOT NULL, CONSTRAINT "UQ_1b075bd20b690d2f3c970a5a0b2" UNIQUE ("bidRegistrationId", "key"), CONSTRAINT "PK_7295e696b7d02b913d6977fa050" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."opened_bid_response_lots_documenttype_enum" AS ENUM('RESPONSE', 'TECHNICAL_RESPONSE', 'FINANCIAL_RESPONSE')`,
    );
    await queryRunner.query(
      `CREATE TABLE "opened_bid_response_lots" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "bidRegistrationDetailId" uuid NOT NULL, "documentType" "public"."opened_bid_response_lots_documenttype_enum" NOT NULL, "key" character varying NOT NULL, "value" jsonb NOT NULL, CONSTRAINT "UQ_d067cfd6da1a57dbd53c691ed73" UNIQUE ("bidRegistrationDetailId", "key"), CONSTRAINT "PK_c6a10364817aac508ca1bae501b" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "opened_bid_response_tenders" ADD CONSTRAINT "FK_c8b6918ab3f533b8c30f5599ede" FOREIGN KEY ("bidRegistrationId") REFERENCES "bid_registrations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "opened_bid_response_lots" ADD CONSTRAINT "FK_b98897a105f7515c11207ca8804" FOREIGN KEY ("bidRegistrationDetailId") REFERENCES "bid_registration_details"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "opened_bid_response_lots" DROP CONSTRAINT "FK_b98897a105f7515c11207ca8804"`,
    );
    await queryRunner.query(
      `ALTER TABLE "opened_bid_response_tenders" DROP CONSTRAINT "FK_c8b6918ab3f533b8c30f5599ede"`,
    );
    await queryRunner.query(`DROP TABLE "opened_bid_response_lots"`);
    await queryRunner.query(
      `DROP TYPE "public"."opened_bid_response_lots_documenttype_enum"`,
    );
    await queryRunner.query(`DROP TABLE "opened_bid_response_tenders"`);
    await queryRunner.query(
      `DROP TYPE "public"."opened_bid_response_tenders_documenttype_enum"`,
    );
  }
}
