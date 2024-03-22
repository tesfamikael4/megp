import { MigrationInterface, QueryRunner } from 'typeorm';

export class BidResponseAdded1710853884119 implements MigrationInterface {
  name = 'BidResponseAdded1710853884119';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "bid_responses" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "bidRegistrationDetailId" uuid NOT NULL, "documentType" character varying NOT NULL, "key" character varying NOT NULL, "value" text NOT NULL, CONSTRAINT "PK_69d01766654dc9d9e656061d861" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "bid_responses" ADD CONSTRAINT "FK_76fb78ba11d4efd3ad7ce1508b9" FOREIGN KEY ("bidRegistrationDetailId") REFERENCES "bid_registration_details"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "bid_responses" DROP CONSTRAINT "FK_76fb78ba11d4efd3ad7ce1508b9"`,
    );
    await queryRunner.query(`DROP TABLE "bid_responses"`);
  }
}
