import { MigrationInterface, QueryRunner } from 'typeorm';

export class BidResponseDocumentaryEvidence1715419281926
  implements MigrationInterface
{
  name = 'BidResponseDocumentaryEvidence1715419281926';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."bid_response_documentary_evidences_documenttype_enum" AS ENUM('RESPONSE', 'TECHNICAL_RESPONSE', 'FINANCIAL_RESPONSE')`,
    );
    await queryRunner.query(
      `CREATE TABLE "bid_response_documentary_evidences" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "organizationId" uuid NOT NULL, "organizationName" character varying NOT NULL, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "bidRegistrationDetailId" uuid NOT NULL, "eqcDocumentaryEvidenceId" uuid NOT NULL, "documentType" "public"."bid_response_documentary_evidences_documenttype_enum" NOT NULL, "value" text NOT NULL, CONSTRAINT "UQ_cd34c2caacca5a167299df21bd7" UNIQUE ("bidRegistrationDetailId", "eqcDocumentaryEvidenceId"), CONSTRAINT "PK_de6438ada062ef318599bec324d" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "bid_response_documentary_evidences" ADD CONSTRAINT "FK_fb32b5807888d323983d74d196d" FOREIGN KEY ("bidRegistrationDetailId") REFERENCES "bid_registration_details"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "bid_response_documentary_evidences" ADD CONSTRAINT "FK_2aea937a675e2a19962163beaf1" FOREIGN KEY ("eqcDocumentaryEvidenceId") REFERENCES "eqc_documentary_evidences"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "bid_response_documentary_evidences" DROP CONSTRAINT "FK_2aea937a675e2a19962163beaf1"`,
    );
    await queryRunner.query(
      `ALTER TABLE "bid_response_documentary_evidences" DROP CONSTRAINT "FK_fb32b5807888d323983d74d196d"`,
    );
    await queryRunner.query(`DROP TABLE "bid_response_documentary_evidences"`);
    await queryRunner.query(
      `DROP TYPE "public"."bid_response_documentary_evidences_documenttype_enum"`,
    );
  }
}
