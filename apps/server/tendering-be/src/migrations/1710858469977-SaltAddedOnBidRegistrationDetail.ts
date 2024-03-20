import { MigrationInterface, QueryRunner } from 'typeorm';

export class SaltAddedOnBidRegistrationDetail1710858469977
  implements MigrationInterface
{
  name = 'SaltAddedOnBidRegistrationDetail1710858469977';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "bid_registration_details" ADD "salt" character varying NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "bid_registration_details" DROP COLUMN "salt"`,
    );
  }
}
