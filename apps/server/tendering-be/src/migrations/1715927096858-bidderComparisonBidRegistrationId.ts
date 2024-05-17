import { MigrationInterface, QueryRunner } from 'typeorm';

export class BidderComparisonBidRegistrationId1715927096858
  implements MigrationInterface
{
  name = 'BidderComparisonBidRegistrationId1715927096858';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "bidders_comparisons" DROP CONSTRAINT "FK_d16cd11c0e106cc71539f114fa6"`,
    );
    await queryRunner.query(
      `ALTER TABLE "bidders_comparisons" RENAME COLUMN "bidRegistrationId" TO "bidRegistrationDetailId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "bidders_comparisons" ADD CONSTRAINT "FK_817d66b1e0add02f648c877f124" FOREIGN KEY ("bidRegistrationDetailId") REFERENCES "bid_registration_details"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "bidders_comparisons" DROP CONSTRAINT "FK_817d66b1e0add02f648c877f124"`,
    );
    await queryRunner.query(
      `ALTER TABLE "bidders_comparisons" RENAME COLUMN "bidRegistrationDetailId" TO "bidRegistrationId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "bidders_comparisons" ADD CONSTRAINT "FK_d16cd11c0e106cc71539f114fa6" FOREIGN KEY ("bidRegistrationId") REFERENCES "bid_registration_details"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
