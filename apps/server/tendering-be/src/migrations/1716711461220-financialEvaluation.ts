import { MigrationInterface, QueryRunner } from 'typeorm';

export class FinancialEvaluation1716711461220 implements MigrationInterface {
  name = 'FinancialEvaluation1716711461220';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."price_adjusting_factors_type_enum" AS ENUM('ADDITION', 'DEDUCTION', 'TAXES')`,
    );
    await queryRunner.query(
      `CREATE TABLE "price_adjusting_factors" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "organizationId" uuid NOT NULL, "organizationName" character varying NOT NULL, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "lotId" uuid NOT NULL, "itemId" uuid NOT NULL, "name" character varying NOT NULL, "description" character varying NOT NULL, "amount" integer NOT NULL, "type" "public"."price_adjusting_factors_type_enum" NOT NULL, CONSTRAINT "PK_353506f04dff8a542177b9411bb" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "bid_price_evaluations" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "organizationId" uuid NOT NULL, "organizationName" character varying NOT NULL, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "lotId" uuid NOT NULL, "itemId" uuid NOT NULL, "evaluatorId" uuid NOT NULL, "evaluatorName" uuid NOT NULL, "isTeamLead" boolean NOT NULL, "offeredPrice" integer NOT NULL, "bidPrice" integer NOT NULL, CONSTRAINT "PK_f072115bfff4a4b50cc1344c13e" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "exchange_rate_details" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "organizationId" uuid NOT NULL, "organizationName" character varying NOT NULL, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "lotId" uuid, "exchangeRateId" uuid NOT NULL, "localCurrency" character varying NOT NULL, "foreignCurrency" character varying NOT NULL, "rate" integer NOT NULL, CONSTRAINT "PK_da1b428b72980c3470fc55b6bf4" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "exchange_rates" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "organizationId" uuid NOT NULL, "organizationName" character varying NOT NULL, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "lotId" uuid, "localCurrency" character varying NOT NULL, "foreignCurrency" character varying NOT NULL, "rate" integer NOT NULL, CONSTRAINT "PK_33a614bad9e61956079d817ebe2" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "technical_scoring_assessments" DROP COLUMN "isTeamAssessment"`,
    );
    await queryRunner.query(
      `ALTER TABLE "bidders_comparisons" DROP COLUMN "technicalPoints"`,
    );
    await queryRunner.query(
      `ALTER TABLE "bidders_comparisons" DROP COLUMN "financialPoints"`,
    );
    await queryRunner.query(
      `ALTER TABLE "bidders_comparisons" ADD "technicalScore" integer`,
    );
    await queryRunner.query(
      `ALTER TABLE "bidders_comparisons" ADD "adjustedTechnicalScore" integer`,
    );
    await queryRunner.query(
      `ALTER TABLE "bidders_comparisons" ADD "technicalRank" integer`,
    );
    await queryRunner.query(
      `ALTER TABLE "bidders_comparisons" ADD "financialScore" integer`,
    );
    await queryRunner.query(
      `ALTER TABLE "bidders_comparisons" ADD "adjustedFinancialScore" integer`,
    );
    await queryRunner.query(
      `ALTER TABLE "bidders_comparisons" ADD "financialRank" integer`,
    );
    await queryRunner.query(
      `ALTER TABLE "bidders_comparisons" ADD "totalScore" integer`,
    );
    await queryRunner.query(
      `ALTER TABLE "bidders_comparisons" ADD "Rank" integer`,
    );
    await queryRunner.query(
      `ALTER TABLE "technical_responsiveness_assessment_details" ADD CONSTRAINT "UQ_2a5dc04a81e364246e1dfbe2259" UNIQUE ("sorTechnicalRequirementId", "technicalResponsivenessAssessmentId")`,
    );
    await queryRunner.query(
      `ALTER TABLE "price_adjusting_factors" ADD CONSTRAINT "FK_755eb6ab74dcc1e90f99cd9cdf4" FOREIGN KEY ("lotId") REFERENCES "lots"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "price_adjusting_factors" ADD CONSTRAINT "FK_98d154433824cdf5f18be36188b" FOREIGN KEY ("itemId") REFERENCES "items"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "bid_price_evaluations" ADD CONSTRAINT "FK_6e00efc979b7c1a85289190523f" FOREIGN KEY ("lotId") REFERENCES "lots"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "bid_price_evaluations" ADD CONSTRAINT "FK_bc2c9a3bb7fc5c1391cbd2c4ef7" FOREIGN KEY ("itemId") REFERENCES "items"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "exchange_rate_details" ADD CONSTRAINT "FK_80cdac97730156066ab700349b8" FOREIGN KEY ("lotId") REFERENCES "lots"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "exchange_rate_details" ADD CONSTRAINT "FK_f07d9c3cf5d7d3da2eb15ad1e7a" FOREIGN KEY ("exchangeRateId") REFERENCES "exchange_rates"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "exchange_rates" ADD CONSTRAINT "FK_48f39c320513416daa5f95680e8" FOREIGN KEY ("lotId") REFERENCES "lots"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "exchange_rates" DROP CONSTRAINT "FK_48f39c320513416daa5f95680e8"`,
    );
    await queryRunner.query(
      `ALTER TABLE "exchange_rate_details" DROP CONSTRAINT "FK_f07d9c3cf5d7d3da2eb15ad1e7a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "exchange_rate_details" DROP CONSTRAINT "FK_80cdac97730156066ab700349b8"`,
    );
    await queryRunner.query(
      `ALTER TABLE "bid_price_evaluations" DROP CONSTRAINT "FK_bc2c9a3bb7fc5c1391cbd2c4ef7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "bid_price_evaluations" DROP CONSTRAINT "FK_6e00efc979b7c1a85289190523f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "price_adjusting_factors" DROP CONSTRAINT "FK_98d154433824cdf5f18be36188b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "price_adjusting_factors" DROP CONSTRAINT "FK_755eb6ab74dcc1e90f99cd9cdf4"`,
    );
    await queryRunner.query(
      `ALTER TABLE "technical_responsiveness_assessment_details" DROP CONSTRAINT "UQ_2a5dc04a81e364246e1dfbe2259"`,
    );
    await queryRunner.query(
      `ALTER TABLE "bidders_comparisons" DROP COLUMN "Rank"`,
    );
    await queryRunner.query(
      `ALTER TABLE "bidders_comparisons" DROP COLUMN "totalScore"`,
    );
    await queryRunner.query(
      `ALTER TABLE "bidders_comparisons" DROP COLUMN "financialRank"`,
    );
    await queryRunner.query(
      `ALTER TABLE "bidders_comparisons" DROP COLUMN "adjustedFinancialScore"`,
    );
    await queryRunner.query(
      `ALTER TABLE "bidders_comparisons" DROP COLUMN "financialScore"`,
    );
    await queryRunner.query(
      `ALTER TABLE "bidders_comparisons" DROP COLUMN "technicalRank"`,
    );
    await queryRunner.query(
      `ALTER TABLE "bidders_comparisons" DROP COLUMN "adjustedTechnicalScore"`,
    );
    await queryRunner.query(
      `ALTER TABLE "bidders_comparisons" DROP COLUMN "technicalScore"`,
    );
    await queryRunner.query(
      `ALTER TABLE "bidders_comparisons" ADD "financialPoints" integer NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "bidders_comparisons" ADD "technicalPoints" integer NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "technical_scoring_assessments" ADD "isTeamAssessment" boolean NOT NULL DEFAULT false`,
    );
    await queryRunner.query(`DROP TABLE "exchange_rates"`);
    await queryRunner.query(`DROP TABLE "exchange_rate_details"`);
    await queryRunner.query(`DROP TABLE "bid_price_evaluations"`);
    await queryRunner.query(`DROP TABLE "price_adjusting_factors"`);
    await queryRunner.query(
      `DROP TYPE "public"."price_adjusting_factors_type_enum"`,
    );
  }
}
