import { MigrationInterface, QueryRunner } from 'typeorm';

export class PostingDate1719320547866 implements MigrationInterface {
  name = 'PostingDate1719320547866';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "rfx_bid_procedures" ADD "postingDate" TIMESTAMP WITH TIME ZONE NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "rfx_contract_terms" DROP CONSTRAINT "FK_8c2f21be567112d9096c029c4f0"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rfx_contract_terms" DROP CONSTRAINT "UQ_d29402e1229f3e8c025d43febef"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rfx_contract_terms" DROP CONSTRAINT "UQ_6e8964a9dc0877ca55799c587bb"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rfx_contract_terms" DROP CONSTRAINT "REL_8c2f21be567112d9096c029c4f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rfx_contract_terms" ADD CONSTRAINT "UQ_d29402e1229f3e8c025d43febef" UNIQUE ("rfxId", "order")`,
    );
    await queryRunner.query(
      `ALTER TABLE "rfx_contract_terms" ADD CONSTRAINT "UQ_6e8964a9dc0877ca55799c587bb" UNIQUE ("rfxId", "term")`,
    );
    await queryRunner.query(
      `ALTER TABLE "rfx_contract_terms" ADD CONSTRAINT "FK_8c2f21be567112d9096c029c4f0" FOREIGN KEY ("rfxId") REFERENCES "rfxes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "rfx_contract_terms" DROP CONSTRAINT "FK_8c2f21be567112d9096c029c4f0"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rfx_contract_terms" DROP CONSTRAINT "UQ_6e8964a9dc0877ca55799c587bb"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rfx_contract_terms" DROP CONSTRAINT "UQ_d29402e1229f3e8c025d43febef"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rfx_contract_terms" ADD CONSTRAINT "REL_8c2f21be567112d9096c029c4f" UNIQUE ("rfxId")`,
    );
    await queryRunner.query(
      `ALTER TABLE "rfx_contract_terms" ADD CONSTRAINT "UQ_6e8964a9dc0877ca55799c587bb" UNIQUE ("term", "rfxId")`,
    );
    await queryRunner.query(
      `ALTER TABLE "rfx_contract_terms" ADD CONSTRAINT "UQ_d29402e1229f3e8c025d43febef" UNIQUE ("order", "rfxId")`,
    );
    await queryRunner.query(
      `ALTER TABLE "rfx_contract_terms" ADD CONSTRAINT "FK_8c2f21be567112d9096c029c4f0" FOREIGN KEY ("rfxId") REFERENCES "rfxes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "rfx_bid_procedures" DROP COLUMN "postingDate"`,
    );
  }
}
