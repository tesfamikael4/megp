import { MigrationInterface, QueryRunner } from 'typeorm';

export class TenderSpdFormAndContract1709817756938
  implements MigrationInterface
{
  name = 'TenderSpdFormAndContract1709817756938';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "tender_spd_bid_forms" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying NOT NULL, "code" character varying NOT NULL, "type" character varying NOT NULL, "documentDocx" jsonb, "documentPdf" jsonb, "tenderId" uuid NOT NULL, CONSTRAINT "PK_d4e19f4478f4246fe7f9f48b10e" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "tender_spd_contract_forms" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying NOT NULL, "code" character varying NOT NULL, "type" character varying NOT NULL, "documentDocx" jsonb, "documentPdf" jsonb, "tenderId" uuid NOT NULL, CONSTRAINT "PK_bfb12c6d8b672000bf5b09e0b27" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "tender_spd_bid_forms" ADD CONSTRAINT "FK_a5ab0706b8fee4a3f4e9d814057" FOREIGN KEY ("tenderId") REFERENCES "tenders"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "tender_spd_contract_forms" ADD CONSTRAINT "FK_fca32e84ac15441189f9ffe732d" FOREIGN KEY ("tenderId") REFERENCES "tenders"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "tender_spd_contract_forms" DROP CONSTRAINT "FK_fca32e84ac15441189f9ffe732d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "tender_spd_bid_forms" DROP CONSTRAINT "FK_a5ab0706b8fee4a3f4e9d814057"`,
    );
    await queryRunner.query(`DROP TABLE "tender_spd_contract_forms"`);
    await queryRunner.query(`DROP TABLE "tender_spd_bid_forms"`);
  }
}
