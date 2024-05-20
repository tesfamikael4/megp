import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateOnBidResgistration1714558084601
  implements MigrationInterface
{
  name = 'UpdateOnBidResgistration1714558084601';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "bid_registrations" ADD "bidderRegistrationNo" character varying`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "bid_registrations" DROP COLUMN "bidderRegistrationNo"`,
    );
  }
}
