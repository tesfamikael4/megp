import { MigrationInterface, QueryRunner } from 'typeorm';

export class PriceAnalyses1717402101330 implements MigrationInterface {
  name = 'PriceAnalyses1717402101330';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "financial_price_analyses" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "organizationId" uuid NOT NULL, "organizationName" character varying NOT NULL, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "lotId" uuid NOT NULL, "itemId" uuid NOT NULL, "evaluatorId" uuid NOT NULL, "evaluatorName" character varying NOT NULL, "currency" character varying NOT NULL, "calculatedBidUnitPrice" integer NOT NULL, "marketUnitPrice" integer NOT NULL, "difference" integer NOT NULL, CONSTRAINT "PK_ffaa4dc6b7b8789ba3ab961d8a6" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "financial_price_analyses" ADD CONSTRAINT "FK_c232d3c333913aafb683cfa9ace" FOREIGN KEY ("lotId") REFERENCES "lots"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "financial_price_analyses" ADD CONSTRAINT "FK_4fb04684d459185ea2ecf0c33a0" FOREIGN KEY ("itemId") REFERENCES "items"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "financial_price_analyses" DROP CONSTRAINT "FK_4fb04684d459185ea2ecf0c33a0"`,
    );
    await queryRunner.query(
      `ALTER TABLE "financial_price_analyses" DROP CONSTRAINT "FK_c232d3c333913aafb683cfa9ace"`,
    );
    await queryRunner.query(`DROP TABLE "financial_price_analyses"`);
  }
}
