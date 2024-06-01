import { MigrationInterface, QueryRunner } from 'typeorm';

export class FinancialBidPriceAssessment1717237660078
  implements MigrationInterface
{
  name = 'FinancialBidPriceAssessment1717237660078';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "financial_bid_price_assessments" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "organizationId" uuid NOT NULL, "organizationName" character varying NOT NULL, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "lotId" uuid NOT NULL, "itemId" uuid NOT NULL, "evaluatorId" uuid NOT NULL, "evaluatorName" uuid NOT NULL, "isTeamLead" boolean NOT NULL, "offeredPrice" integer NOT NULL, "bidPrice" integer NOT NULL, CONSTRAINT "PK_cb35c0aa4b3e34cbb917703c9ec" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "financial_bid_price_assessments" ADD CONSTRAINT "FK_3dcd90a9d5b731de78c773cd878" FOREIGN KEY ("lotId") REFERENCES "lots"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "financial_bid_price_assessments" ADD CONSTRAINT "FK_a880d1804c2946277f50003eda4" FOREIGN KEY ("itemId") REFERENCES "items"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "financial_bid_price_assessments" DROP CONSTRAINT "FK_a880d1804c2946277f50003eda4"`,
    );
    await queryRunner.query(
      `ALTER TABLE "financial_bid_price_assessments" DROP CONSTRAINT "FK_3dcd90a9d5b731de78c773cd878"`,
    );
    await queryRunner.query(`DROP TABLE "financial_bid_price_assessments"`);
  }
}
