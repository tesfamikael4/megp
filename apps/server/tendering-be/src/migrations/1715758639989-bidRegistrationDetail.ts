import { MigrationInterface, QueryRunner } from 'typeorm';

export class BidRegistrationDetail1715758639989 implements MigrationInterface {
  name = 'BidRegistrationDetail1715758639989';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "bid_opening_checklists" ADD "bidRegistrationDetail" uuid NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "bid_opening_checklists" ADD CONSTRAINT "FK_c0f72d8572db88859384b29ef96" FOREIGN KEY ("spdOpeningChecklistId") REFERENCES "bid_registration_details"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "bid_opening_checklists" DROP CONSTRAINT "FK_c0f72d8572db88859384b29ef96"`,
    );
    await queryRunner.query(
      `ALTER TABLE "bid_opening_checklists" DROP COLUMN "bidRegistrationDetail"`,
    );
  }
}
