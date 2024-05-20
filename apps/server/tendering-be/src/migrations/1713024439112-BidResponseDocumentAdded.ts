import { MigrationInterface, QueryRunner } from 'typeorm';

export class BidResponseDocumentAdded1713024439112
  implements MigrationInterface
{
  name = 'BidResponseDocumentAdded1713024439112';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."bid_response_documents_documenttype_enum" AS ENUM('RESPONSE', 'TECHNICAL_RESPONSE', 'FINANCIAL_RESPONSE')`,
    );
    await queryRunner.query(
      `CREATE TABLE "bid_response_documents" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "bidRegistrationDetailId" uuid NOT NULL, "bidFormId" uuid NOT NULL, "documentType" "public"."bid_response_documents_documenttype_enum" NOT NULL, "key" character varying NOT NULL, "value" text NOT NULL, CONSTRAINT "UQ_33f2cf126bd641280e435d95ed3" UNIQUE ("bidRegistrationDetailId", "bidFormId", "key"), CONSTRAINT "PK_ed41818561fd49fcb75fd2b1745" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "bid_response_documents" ADD CONSTRAINT "FK_d2552d6e0145a36ec7a3b019342" FOREIGN KEY ("bidRegistrationDetailId") REFERENCES "bid_registration_details"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "bid_response_documents" ADD CONSTRAINT "FK_ddd674868cebf0795eee1fd7aac" FOREIGN KEY ("bidFormId") REFERENCES "spd_bid_forms"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "bid_response_documents" DROP CONSTRAINT "FK_ddd674868cebf0795eee1fd7aac"`,
    );
    await queryRunner.query(
      `ALTER TABLE "bid_response_documents" DROP CONSTRAINT "FK_d2552d6e0145a36ec7a3b019342"`,
    );
    await queryRunner.query(`DROP TABLE "bid_response_documents"`);
    await queryRunner.query(
      `DROP TYPE "public"."bid_response_documents_documenttype_enum"`,
    );
  }
}
