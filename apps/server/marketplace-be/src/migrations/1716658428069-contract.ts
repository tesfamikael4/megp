import { MigrationInterface, QueryRunner } from 'typeorm';

export class Contract1716658428069 implements MigrationInterface {
  name = 'Contract1716658428069';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "rfx_bid_contract_conditions" DROP CONSTRAINT "CHK_e0e9554979f696710923fe3890"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rfx_bid_contract_conditions" DROP COLUMN "deliveryPeriod"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rfx_bid_contract_conditions" DROP COLUMN "warrantyPeriod"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rfx_bid_contract_conditions" DROP COLUMN "deliverySite"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rfx_bid_contract_conditions" DROP COLUMN "paymentMode"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rfx_items" ADD "warrantyPeriod" integer`,
    );
    await queryRunner.query(
      `ALTER TABLE "rfxs" ADD "isOpen" boolean NOT NULL DEFAULT false`,
    );
    await queryRunner.query(
      `ALTER TABLE "rfx_bid_contract_conditions" ADD CONSTRAINT "CHK_5fb0d69fead4acc56e5b872025" CHECK ("liquidityDamageLimit" >=  "liquidityDamage")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "rfx_bid_contract_conditions" DROP CONSTRAINT "CHK_5fb0d69fead4acc56e5b872025"`,
    );
    await queryRunner.query(`ALTER TABLE "rfxs" DROP COLUMN "isOpen"`);
    await queryRunner.query(
      `ALTER TABLE "rfx_items" DROP COLUMN "warrantyPeriod"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rfx_bid_contract_conditions" ADD "paymentMode" text NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "rfx_bid_contract_conditions" ADD "deliverySite" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "rfx_bid_contract_conditions" ADD "warrantyPeriod" integer NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "rfx_bid_contract_conditions" ADD "deliveryPeriod" integer NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "rfx_bid_contract_conditions" ADD CONSTRAINT "CHK_e0e9554979f696710923fe3890" CHECK ((("liquidityDamage" >= 0) AND ("liquidityDamage" <= 100)))`,
    );
  }
}
