import { MigrationInterface, QueryRunner } from 'typeorm';

export class OpeningChecklist1712576650901 implements MigrationInterface {
  name = 'OpeningChecklist1712576650901';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "shared_bidder_keys" DROP COLUMN "bidderId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "shared_bidder_keys" DROP COLUMN "lotId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "shared_bidder_keys" ADD "bidRegistrationDetailId" uuid NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "bid_opening_checklists" ADD "tenderId" uuid NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "bid_opening_checklists" ADD "lotId" uuid NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "bid_opening_checklists" ADD "spdOpeningChecklistId" uuid NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "bid_opening_checklists" ADD "bidderId" uuid NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "bid_opening_checklists" ADD "openerId" uuid NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "bid_opening_checklists" ADD "openerName" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "bid_opening_checklists" ADD "checked" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "shared_bidder_keys" ADD CONSTRAINT "FK_495ac12ffba96f201c91654c7d7" FOREIGN KEY ("bidRegistrationDetailId") REFERENCES "bid_registration_details"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "bid_opening_checklists" ADD CONSTRAINT "FK_ba4370a68752d5f4eabb6bb3711" FOREIGN KEY ("tenderId") REFERENCES "tenders"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "bid_opening_checklists" ADD CONSTRAINT "FK_8b870c240485eb79fb8d83737b0" FOREIGN KEY ("lotId") REFERENCES "lots"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "bid_opening_checklists" ADD CONSTRAINT "FK_c0f72d8572db88859384b29ef96" FOREIGN KEY ("spdOpeningChecklistId") REFERENCES "spd_opening_checklists"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "bid_opening_checklists" DROP CONSTRAINT "FK_c0f72d8572db88859384b29ef96"`,
    );
    await queryRunner.query(
      `ALTER TABLE "bid_opening_checklists" DROP CONSTRAINT "FK_8b870c240485eb79fb8d83737b0"`,
    );
    await queryRunner.query(
      `ALTER TABLE "bid_opening_checklists" DROP CONSTRAINT "FK_ba4370a68752d5f4eabb6bb3711"`,
    );
    await queryRunner.query(
      `ALTER TABLE "shared_bidder_keys" DROP CONSTRAINT "FK_495ac12ffba96f201c91654c7d7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "bid_opening_checklists" DROP COLUMN "checked"`,
    );
    await queryRunner.query(
      `ALTER TABLE "bid_opening_checklists" DROP COLUMN "openerName"`,
    );
    await queryRunner.query(
      `ALTER TABLE "bid_opening_checklists" DROP COLUMN "openerId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "bid_opening_checklists" DROP COLUMN "bidderId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "bid_opening_checklists" DROP COLUMN "spdOpeningChecklistId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "bid_opening_checklists" DROP COLUMN "lotId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "bid_opening_checklists" DROP COLUMN "tenderId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "shared_bidder_keys" DROP COLUMN "bidRegistrationDetailId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "shared_bidder_keys" ADD "lotId" uuid NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "shared_bidder_keys" ADD "bidderId" uuid NOT NULL`,
    );
  }
}
