import { MigrationInterface, QueryRunner } from 'typeorm';

export class Numeric1719991222304 implements MigrationInterface {
  name = 'Numeric1719991222304';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "rfx_items" ALTER COLUMN "estimatedPrice" TYPE numeric`,
    );
    await queryRunner.query(
      `ALTER TABLE "rfx_items" ALTER COLUMN "marketPrice" TYPE numeric`,
    );
    await queryRunner.query(
      `ALTER TABLE "rfx_bid_procedures" ALTER COLUMN "deltaPercentage" TYPE numeric`,
    );
    await queryRunner.query(
      `ALTER TABLE "rfx_bid_procedures" ALTER COLUMN "deltaPercentage" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "rfx_bid_procedures" DROP CONSTRAINT "CHK_3aa620f4161754d0a267ee9c5d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rfx_bid_procedures" DROP COLUMN "minimumBidDecrementPercentage"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rfx_bid_procedures" ADD "minimumBidDecrementPercentage" numeric`,
    );
    await queryRunner.query(
      `ALTER TABLE "rfx_bid_contract_conditions" DROP COLUMN "liquidityDamage"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rfx_bid_contract_conditions" ADD "liquidityDamage" numeric NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "rfx_bid_contract_conditions" DROP CONSTRAINT "CHK_7353cc50107f0b8c14ba3f7f42"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rfx_bid_contract_conditions" DROP COLUMN "liquidityDamageLimit"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rfx_bid_contract_conditions" ADD "liquidityDamageLimit" numeric NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "opened_offers" ALTER COLUMN "price" TYPE numeric`,
    );
    await queryRunner.query(
      `ALTER TABLE "opened_offers" ALTER COLUMN "price" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "opened_offers" ALTER COLUMN "tax" TYPE numeric`,
    );
    await queryRunner.query(
      `ALTER TABLE "opened_offers" ALTER COLUMN "tax" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "opened_offers" ALTER COLUMN "calculatedPrice" TYPE numeric`,
    );
    await queryRunner.query(
      `ALTER TABLE "opened_offers" ALTER COLUMN "calculatedPrice" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "sol_round_awards" ALTER COLUMN "winnerPrice" TYPE numeric`,
    );
    await queryRunner.query(
      `ALTER TABLE "sol_round_awards" ALTER COLUMN "nextRoundStartingPrice" TYPE numeric`,
    );
    await queryRunner.query(
      `ALTER TABLE "award_items" ALTER COLUMN "calculatedPrice" TYPE numeric`,
    );
    await queryRunner.query(
      `ALTER TABLE "award_items" ALTER COLUMN "calculatedPrice" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "rfxes" ALTER COLUMN "budgetAmount" TYPE numeric`,
    );
    await queryRunner.query(
      `ALTER TABLE "rfxes" ALTER COLUMN "budgetAmount" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "rfxes" ALTER COLUMN "calculatedAmount" TYPE numeric`,
    );
    await queryRunner.query(
      `ALTER TABLE "rfxes" ALTER COLUMN "calculatedAmount" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "rfx_items" DROP COLUMN "marketPrice"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rfx_items" DROP COLUMN "marketPriceCurrency"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rfx_bid_procedures" ADD CONSTRAINT "CHK_3aa620f4161754d0a267ee9c5d" CHECK ("minimumBidDecrementPercentage" >= 0 AND "minimumBidDecrementPercentage" < 100)`,
    );
    await queryRunner.query(
      `ALTER TABLE "rfx_bid_contract_conditions" ADD CONSTRAINT "CHK_7353cc50107f0b8c14ba3f7f42" CHECK ("liquidityDamageLimit" >= 0 AND "liquidityDamageLimit" <= 100)`,
    );
    await queryRunner.query(
      `ALTER TABLE "rfx_bid_contract_conditions" ADD CONSTRAINT "CHK_5fb0d69fead4acc56e5b872025" CHECK ("liquidityDamageLimit" >=  "liquidityDamage")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "rfx_bid_contract_conditions" DROP CONSTRAINT "CHK_5fb0d69fead4acc56e5b872025"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rfx_bid_contract_conditions" DROP CONSTRAINT "CHK_7353cc50107f0b8c14ba3f7f42"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rfx_bid_procedures" DROP CONSTRAINT "CHK_3aa620f4161754d0a267ee9c5d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rfx_items" ADD "marketPriceCurrency" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "rfx_items" ADD "marketPrice" numeric`,
    );
    await queryRunner.query(
      `ALTER TABLE "rfxes" ALTER COLUMN "calculatedAmount" SET DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "rfxes" ALTER COLUMN "calculatedAmount" TYPE numeric(14,2)`,
    );
    await queryRunner.query(
      `ALTER TABLE "rfxes" ALTER COLUMN "budgetAmount" SET DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "rfxes" ALTER COLUMN "budgetAmount" TYPE numeric(14,2)`,
    );
    await queryRunner.query(
      `ALTER TABLE "award_items" ALTER COLUMN "calculatedPrice" SET DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "award_items" ALTER COLUMN "calculatedPrice" TYPE numeric(14,2)`,
    );
    await queryRunner.query(
      `ALTER TABLE "sol_round_awards" ALTER COLUMN "nextRoundStartingPrice" TYPE numeric(10,2)`,
    );
    await queryRunner.query(
      `ALTER TABLE "sol_round_awards" ALTER COLUMN "winnerPrice" TYPE numeric(10,2)`,
    );
    await queryRunner.query(
      `ALTER TABLE "opened_offers" ALTER COLUMN "calculatedPrice" SET DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "opened_offers" ALTER COLUMN "calculatedPrice" TYPE numeric(14,2)`,
    );
    await queryRunner.query(
      `ALTER TABLE "opened_offers" ALTER COLUMN "tax" SET DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "opened_offers" ALTER COLUMN "tax" TYPE numeric(14,2)`,
    );
    await queryRunner.query(
      `ALTER TABLE "opened_offers" ALTER COLUMN "price" SET DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "opened_offers" ALTER COLUMN "price" TYPE numeric(14,2)`,
    );
    await queryRunner.query(
      `ALTER TABLE "rfx_bid_contract_conditions" DROP COLUMN "liquidityDamageLimit"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rfx_bid_contract_conditions" ADD "liquidityDamageLimit" integer NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "rfx_bid_contract_conditions" ADD CONSTRAINT "CHK_7353cc50107f0b8c14ba3f7f42" CHECK ((("liquidityDamageLimit" >= 0) AND ("liquidityDamageLimit" <= 100)))`,
    );
    await queryRunner.query(
      `ALTER TABLE "rfx_bid_contract_conditions" DROP COLUMN "liquidityDamage"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rfx_bid_contract_conditions" ADD "liquidityDamage" integer NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "rfx_bid_procedures" DROP COLUMN "minimumBidDecrementPercentage"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rfx_bid_procedures" ADD "minimumBidDecrementPercentage" integer`,
    );
    await queryRunner.query(
      `ALTER TABLE "rfx_bid_procedures" ADD CONSTRAINT "CHK_3aa620f4161754d0a267ee9c5d" CHECK ((("minimumBidDecrementPercentage" >= 0) AND ("minimumBidDecrementPercentage" < 100)))`,
    );
    await queryRunner.query(
      `ALTER TABLE "rfx_bid_procedures" ALTER COLUMN "deltaPercentage" SET DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "rfx_bid_procedures" ALTER COLUMN "deltaPercentage" TYPE numeric(14,2)`,
    );
    await queryRunner.query(
      `ALTER TABLE "rfx_items" ALTER COLUMN "marketPrice" TYPE numeric(10,2)`,
    );
    await queryRunner.query(
      `ALTER TABLE "rfx_items" ALTER COLUMN "estimatedPrice" TYPE numeric(10,2)`,
    );
  }
}
