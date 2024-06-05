import { MigrationInterface, QueryRunner } from 'typeorm';

export class RfxContractContditions1717430285308 implements MigrationInterface {
  name = 'RfxContractContditions1717430285308';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "rfx_contract_terms" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "term" character varying NOT NULL, "order" integer NOT NULL, "rfxId" uuid NOT NULL, CONSTRAINT "UQ_d29402e1229f3e8c025d43febef" UNIQUE ("rfxId", "order"), CONSTRAINT "UQ_6e8964a9dc0877ca55799c587bb" UNIQUE ("rfxId", "term"), CONSTRAINT "REL_8c2f21be567112d9096c029c4f" UNIQUE ("rfxId"), CONSTRAINT "PK_7bba7d91e031fe8c64f068dd94c" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "rfx_contract_terms" ADD CONSTRAINT "FK_8c2f21be567112d9096c029c4f0" FOREIGN KEY ("rfxId") REFERENCES "rfxes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "rfx_contract_terms" DROP CONSTRAINT "FK_8c2f21be567112d9096c029c4f0"`,
    );
    await queryRunner.query(`DROP TABLE "rfx_contract_terms"`);
  }
}
