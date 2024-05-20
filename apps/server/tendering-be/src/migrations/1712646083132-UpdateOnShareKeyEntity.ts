import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateOnShareKeyEntity1712646083132 implements MigrationInterface {
  name = 'UpdateOnShareKeyEntity1712646083132';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "shared_bidder_keys" DROP CONSTRAINT "FK_495ac12ffba96f201c91654c7d7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "shared_bidder_keys" RENAME COLUMN "bidRegistrationDetailId" TO "bidRegistrationId"`,
    );
    await queryRunner.query(`ALTER TABLE "items" DROP COLUMN "estimatedPrice"`);
    await queryRunner.query(
      `ALTER TABLE "items" ADD "estimatedPrice" numeric(10,2) NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(`ALTER TABLE "items" DROP COLUMN "marketPrice"`);
    await queryRunner.query(
      `ALTER TABLE "items" ADD "marketPrice" numeric(10,2)`,
    );
    await queryRunner.query(
      `ALTER TABLE "bds_generals" DROP COLUMN "clarificationDeadline"`,
    );
    await queryRunner.query(
      `ALTER TABLE "bds_generals" ADD "clarificationDeadline" TIMESTAMP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "bds_generals" DROP COLUMN "preBidConferenceDate"`,
    );
    await queryRunner.query(
      `ALTER TABLE "bds_generals" ADD "preBidConferenceDate" TIMESTAMP NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "tenders" DROP COLUMN "budgetAmount"`);
    await queryRunner.query(
      `ALTER TABLE "tenders" ADD "budgetAmount" numeric(10,2) NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "shared_bidder_keys" ADD CONSTRAINT "UQ_436cc2315ddd13e6ac2c2f46347" UNIQUE ("bidRegistrationId", "envelopeType")`,
    );
    await queryRunner.query(
      `ALTER TABLE "shared_bidder_keys" ADD CONSTRAINT "FK_ea92a2dce51fc3f48735887b820" FOREIGN KEY ("bidRegistrationId") REFERENCES "bid_registrations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "shared_bidder_keys" DROP CONSTRAINT "FK_ea92a2dce51fc3f48735887b820"`,
    );
    await queryRunner.query(
      `ALTER TABLE "shared_bidder_keys" DROP CONSTRAINT "UQ_436cc2315ddd13e6ac2c2f46347"`,
    );
    await queryRunner.query(`ALTER TABLE "tenders" DROP COLUMN "budgetAmount"`);
    await queryRunner.query(
      `ALTER TABLE "tenders" ADD "budgetAmount" integer NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "bds_generals" DROP COLUMN "preBidConferenceDate"`,
    );
    await queryRunner.query(
      `ALTER TABLE "bds_generals" ADD "preBidConferenceDate" date NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "bds_generals" DROP COLUMN "clarificationDeadline"`,
    );
    await queryRunner.query(
      `ALTER TABLE "bds_generals" ADD "clarificationDeadline" date NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "items" DROP COLUMN "marketPrice"`);
    await queryRunner.query(`ALTER TABLE "items" ADD "marketPrice" integer`);
    await queryRunner.query(`ALTER TABLE "items" DROP COLUMN "estimatedPrice"`);
    await queryRunner.query(
      `ALTER TABLE "items" ADD "estimatedPrice" integer NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "shared_bidder_keys" RENAME COLUMN "bidRegistrationId" TO "bidRegistrationDetailId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "shared_bidder_keys" ADD CONSTRAINT "FK_495ac12ffba96f201c91654c7d7" FOREIGN KEY ("bidRegistrationDetailId") REFERENCES "bid_registration_details"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
