import { MigrationInterface, QueryRunner } from 'typeorm';

export class BidRegistrationDetailRelationUpdated1710848159076
  implements MigrationInterface
{
  name = 'BidRegistrationDetailRelationUpdated1710848159076';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "bid_registration_details" ADD "financialResponse" text`,
    );
    await queryRunner.query(
      `ALTER TABLE "bid_registration_details" ADD "technicalResponse" text`,
    );
    await queryRunner.query(
      `ALTER TABLE "bid_registration_details" ADD "response" text`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "bid_registration_details" DROP COLUMN "response"`,
    );
    await queryRunner.query(
      `ALTER TABLE "bid_registration_details" DROP COLUMN "technicalResponse"`,
    );
    await queryRunner.query(
      `ALTER TABLE "bid_registration_details" DROP COLUMN "financialResponse"`,
    );
  }
}
