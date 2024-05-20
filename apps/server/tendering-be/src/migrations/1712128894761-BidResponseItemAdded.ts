import { MigrationInterface, QueryRunner } from 'typeorm';

export class BidResponseItemAdded1712128894761 implements MigrationInterface {
  name = 'BidResponseItemAdded1712128894761';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "bid_response_lots" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "bidRegistrationDetailId" uuid NOT NULL, "documentType" character varying NOT NULL, "key" character varying NOT NULL, "value" text NOT NULL, CONSTRAINT "UQ_f0eb2239cb7eff8c3d59c9e290b" UNIQUE ("bidRegistrationDetailId", "key"), CONSTRAINT "PK_244f44e3ff1d46dd602a4414e54" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "bid_response_items" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "bidRegistrationDetailId" uuid NOT NULL, "itemId" uuid NOT NULL, "documentType" character varying NOT NULL, "key" character varying NOT NULL, "value" text NOT NULL, CONSTRAINT "UQ_179ecb883c96b08336a8c2bb0c6" UNIQUE ("bidRegistrationDetailId", "itemId", "key"), CONSTRAINT "PK_1532d6ee1441ee9f3547ef73923" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "bid_response_tenders" ADD "documentType" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "bid_response_lots" ADD CONSTRAINT "FK_cabd8ab94306ddbec6d07b1693f" FOREIGN KEY ("bidRegistrationDetailId") REFERENCES "bid_registration_details"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "bid_response_items" ADD CONSTRAINT "FK_5e4bba931fddb9266c4200faebb" FOREIGN KEY ("bidRegistrationDetailId") REFERENCES "bid_registration_details"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "bid_response_items" ADD CONSTRAINT "FK_89f1c5eb9f3ccdf1a3c3375254f" FOREIGN KEY ("itemId") REFERENCES "items"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "bid_response_items" DROP CONSTRAINT "FK_89f1c5eb9f3ccdf1a3c3375254f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "bid_response_items" DROP CONSTRAINT "FK_5e4bba931fddb9266c4200faebb"`,
    );
    await queryRunner.query(
      `ALTER TABLE "bid_response_lots" DROP CONSTRAINT "FK_cabd8ab94306ddbec6d07b1693f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "bid_response_tenders" DROP COLUMN "documentType"`,
    );
    await queryRunner.query(`DROP TABLE "bid_response_items"`);
    await queryRunner.query(`DROP TABLE "bid_response_lots"`);
  }
}
