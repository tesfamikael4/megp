import { MigrationInterface, QueryRunner } from 'typeorm';

export class RfxCheck1716058772082 implements MigrationInterface {
  name = 'RfxCheck1716058772082';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "rfx_bid_contract_conditions" RENAME COLUMN "paymentTerm" TO "isPartialAllowed"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rfx_bid_procedures" ADD "idleTime" integer`,
    );
    await queryRunner.query(
      `ALTER TABLE "rfx_documentary_evidence" ADD "description" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "rfx_bid_procedures" ALTER COLUMN "isReverseAuction" SET DEFAULT 'false'`,
    );
    await queryRunner.query(
      `ALTER TABLE "rfx_bid_procedures" ALTER COLUMN "roundDuration" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "rfx_bid_contract_conditions" DROP COLUMN "isPartialAllowed"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rfx_bid_contract_conditions" ADD "isPartialAllowed" boolean NOT NULL DEFAULT false`,
    );
    await queryRunner.query(
      `ALTER TABLE "rfx_bid_qualifications" ADD "description" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "rfx_bid_procedures" ADD CONSTRAINT "CHK_67e53717b3ef9d87cc22ecfdda" CHECK ("submissionDeadline" > CURRENT_TIMESTAMP)`,
    );
    await queryRunner.query(
      `ALTER TABLE "rfx_bid_procedures" ADD CONSTRAINT "CHK_fb18703f71b89c806e6872c91a" CHECK ("openingDate" > "submissionDeadline")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "rfx_bid_procedures" DROP CONSTRAINT "CHK_fb18703f71b89c806e6872c91a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rfx_bid_procedures" DROP CONSTRAINT "CHK_67e53717b3ef9d87cc22ecfdda"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rfx_bid_qualifications" DROP COLUMN "description"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rfx_bid_contract_conditions" DROP COLUMN "isPartialAllowed"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rfx_bid_contract_conditions" ADD "isPartialAllowed" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "rfx_bid_procedures" ALTER COLUMN "roundDuration" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "rfx_bid_procedures" ALTER COLUMN "isReverseAuction" SET DEFAULT false`,
    );
    await queryRunner.query(
      `ALTER TABLE "rfx_documentary_evidence" DROP COLUMN "description"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rfx_bid_procedures" DROP COLUMN "idleTime"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rfx_bid_contract_conditions" RENAME COLUMN "isPartialAllowed" TO "paymentTerm"`,
    );
  }
}
