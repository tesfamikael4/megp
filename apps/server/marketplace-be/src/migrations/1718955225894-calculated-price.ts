import { MigrationInterface, QueryRunner } from 'typeorm';

export class CalculatedPrice1718955225894 implements MigrationInterface {
  name = 'CalculatedPrice1718955225894';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "opened_offers" DROP COLUMN "calculatedPrice"`,
    );
    await queryRunner.query(
      `ALTER TABLE "opened_offers" ADD "calculatedPrice" numeric(14,2) NOT NULL DEFAULT '0'`,
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
      `ALTER TABLE "opened_offers" DROP COLUMN "calculatedPrice"`,
    );
    await queryRunner.query(
      `ALTER TABLE "opened_offers" ADD "calculatedPrice" integer NOT NULL`,
    );
  }
}
