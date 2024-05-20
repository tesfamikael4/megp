import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateOnBidResponse1711115792722 implements MigrationInterface {
  name = 'UpdateOnBidResponse1711115792722';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "bid_responses" ADD CONSTRAINT "UQ_d075c1d9ca365395990b3296407" UNIQUE ("bidRegistrationDetailId", "key")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "bid_responses" DROP CONSTRAINT "UQ_d075c1d9ca365395990b3296407"`,
    );
  }
}
