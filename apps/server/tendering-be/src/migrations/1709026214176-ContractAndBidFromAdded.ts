import { MigrationInterface, QueryRunner } from 'typeorm';

export class ContractAndBidFromAdded1709026214176
  implements MigrationInterface
{
  name = 'ContractAndBidFromAdded1709026214176';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "spd_bid_forms" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying NOT NULL, "code" character varying NOT NULL, "type" character varying NOT NULL, "documentDocx" jsonb, "documentPdf" jsonb, "spdId" uuid NOT NULL, CONSTRAINT "PK_fcb204245fba67ea286ed89be61" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "spd_contract_forms" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying NOT NULL, "code" character varying NOT NULL, "type" character varying NOT NULL, "documentDocx" jsonb, "documentPdf" jsonb, "spdId" uuid NOT NULL, CONSTRAINT "PK_92b8362bdbed79660313dd9c642" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "spd_bid_forms" ADD CONSTRAINT "FK_ee16a393f1cf753562e851c56f0" FOREIGN KEY ("spdId") REFERENCES "spd"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "spd_contract_forms" ADD CONSTRAINT "FK_ab496b8f6616866278b321794f0" FOREIGN KEY ("spdId") REFERENCES "spd"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "spd_contract_forms" DROP CONSTRAINT "FK_ab496b8f6616866278b321794f0"`,
    );
    await queryRunner.query(
      `ALTER TABLE "spd_bid_forms" DROP CONSTRAINT "FK_ee16a393f1cf753562e851c56f0"`,
    );
    await queryRunner.query(`DROP TABLE "spd_contract_forms"`);
    await queryRunner.query(`DROP TABLE "spd_bid_forms"`);
  }
}
