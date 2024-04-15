import { MigrationInterface, QueryRunner } from 'typeorm';

export class OpenedBidResponseItemAdded1713178859787
  implements MigrationInterface
{
  name = 'OpenedBidResponseItemAdded1713178859787';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."opened_bid_response_items_documenttype_enum" AS ENUM('RESPONSE', 'TECHNICAL_RESPONSE', 'FINANCIAL_RESPONSE')`,
    );
    await queryRunner.query(
      `CREATE TABLE "opened_bid_response_items" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "bidRegistrationDetailId" uuid NOT NULL, "itemId" uuid NOT NULL, "documentType" "public"."opened_bid_response_items_documenttype_enum" NOT NULL, "key" character varying NOT NULL, "value" jsonb NOT NULL, CONSTRAINT "UQ_4c077a7af2bcae73aceff73b495" UNIQUE ("bidRegistrationDetailId", "itemId", "key"), CONSTRAINT "PK_53c325b09c33bd06cf9b0300b89" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "opened_bid_response_items" ADD CONSTRAINT "FK_4947733f2123c262df8c24944ae" FOREIGN KEY ("bidRegistrationDetailId") REFERENCES "bid_registration_details"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "opened_bid_response_items" ADD CONSTRAINT "FK_8360c30bbca5ccd83eaf16fadac" FOREIGN KEY ("itemId") REFERENCES "items"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "opened_bid_response_items" DROP CONSTRAINT "FK_8360c30bbca5ccd83eaf16fadac"`,
    );
    await queryRunner.query(
      `ALTER TABLE "opened_bid_response_items" DROP CONSTRAINT "FK_4947733f2123c262df8c24944ae"`,
    );
    await queryRunner.query(`DROP TABLE "opened_bid_response_items"`);
    await queryRunner.query(
      `DROP TYPE "public"."opened_bid_response_items_documenttype_enum"`,
    );
  }
}
