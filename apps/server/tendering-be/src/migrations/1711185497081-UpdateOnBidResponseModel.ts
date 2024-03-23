import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateOnBidResponseModel1711185497081
  implements MigrationInterface
{
  name = 'UpdateOnBidResponseModel1711185497081';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "bid_response_tenders" ADD CONSTRAINT "UQ_6888c9fd30987aa3249fb9c08c1" UNIQUE ("bidRegistrationId", "key")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "bid_response_tenders" DROP CONSTRAINT "UQ_6888c9fd30987aa3249fb9c08c1"`,
    );
  }
}
