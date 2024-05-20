import { MigrationInterface, QueryRunner } from 'typeorm';

export class BidRegistrationDetailId1715777057149
  implements MigrationInterface
{
  name = 'BidRegistrationDetailId1715777057149';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "bid_opening_checklists" ADD "bidRegistrationDetailId" uuid NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "bid_opening_checklists" ADD CONSTRAINT "FK_7323200c8e343ceec41b03f326c" FOREIGN KEY ("bidRegistrationDetailId") REFERENCES "bid_registration_details"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "bid_opening_checklists" DROP CONSTRAINT "FK_7323200c8e343ceec41b03f326c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "bid_opening_checklists" DROP COLUMN "bidRegistrationDetailId"`,
    );
  }
}
