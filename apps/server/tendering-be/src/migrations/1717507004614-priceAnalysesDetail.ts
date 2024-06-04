import { MigrationInterface, QueryRunner } from 'typeorm';

export class PriceAnalysesDetail1717507004614 implements MigrationInterface {
  name = 'PriceAnalysesDetail1717507004614';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "financial_price_analyses" DROP CONSTRAINT "FK_4fb04684d459185ea2ecf0c33a0"`,
    );
    await queryRunner.query(
      `CREATE TABLE "financial_price_analyses_details" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "organizationId" uuid NOT NULL, "organizationName" character varying NOT NULL, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "itemId" uuid NOT NULL, "financialPriceAnalysisId" uuid NOT NULL, "evaluatorId" uuid NOT NULL, "evaluatorName" character varying NOT NULL, "currency" character varying NOT NULL, "calculatedBidUnitPrice" integer NOT NULL, "marketUnitPrice" integer NOT NULL, "difference" integer NOT NULL, CONSTRAINT "PK_1ea21bbd8c9dec1be5c00631021" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "financial_price_analyses" DROP COLUMN "itemId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "financial_price_analyses" DROP COLUMN "marketUnitPrice"`,
    );
    await queryRunner.query(
      `ALTER TABLE "financial_price_analyses" DROP COLUMN "currency"`,
    );
    await queryRunner.query(
      `ALTER TABLE "financial_price_analyses" DROP COLUMN "evaluatorName"`,
    );
    await queryRunner.query(
      `ALTER TABLE "financial_price_analyses" DROP COLUMN "calculatedBidUnitPrice"`,
    );
    await queryRunner.query(
      `ALTER TABLE "financial_price_analyses" DROP COLUMN "evaluatorId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "financial_price_analyses" DROP COLUMN "difference"`,
    );
    await queryRunner.query(
      `ALTER TABLE "financial_price_analyses" ADD "isComplete" boolean NOT NULL DEFAULT false`,
    );
    await queryRunner.query(
      `ALTER TABLE "financial_price_analyses_details" ADD CONSTRAINT "FK_04bb27b68043dfa60032ffc825a" FOREIGN KEY ("itemId") REFERENCES "items"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "financial_price_analyses_details" ADD CONSTRAINT "FK_507cc47170fca83d5de8d25aa76" FOREIGN KEY ("financialPriceAnalysisId") REFERENCES "financial_price_analyses"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "financial_price_analyses_details" DROP CONSTRAINT "FK_507cc47170fca83d5de8d25aa76"`,
    );
    await queryRunner.query(
      `ALTER TABLE "financial_price_analyses_details" DROP CONSTRAINT "FK_04bb27b68043dfa60032ffc825a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "financial_price_analyses" DROP COLUMN "isComplete"`,
    );
    await queryRunner.query(
      `ALTER TABLE "financial_price_analyses" ADD "difference" integer NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "financial_price_analyses" ADD "evaluatorId" uuid NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "financial_price_analyses" ADD "calculatedBidUnitPrice" integer NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "financial_price_analyses" ADD "evaluatorName" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "financial_price_analyses" ADD "currency" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "financial_price_analyses" ADD "marketUnitPrice" integer NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "financial_price_analyses" ADD "itemId" uuid NOT NULL`,
    );
    await queryRunner.query(`DROP TABLE "financial_price_analyses_details"`);
    await queryRunner.query(
      `ALTER TABLE "financial_price_analyses" ADD CONSTRAINT "FK_4fb04684d459185ea2ecf0c33a0" FOREIGN KEY ("itemId") REFERENCES "items"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
